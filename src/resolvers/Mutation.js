import bcrypt from 'bcrypt';

import getUserId from '../utils/getUserId';
import generateToken from '../utils/generateToken';
import hashPassword from '../utils/hashPassword';

const Mutation = {
  async generatePwdHash(parent, { password }, { prisma }, info) {
    const pwd = await hashPassword(password);
    
    return pwd;
  },
  async login(parent, { user, password }, { prisma }, info) {
    const userExists = await prisma.user.findUnique({
      where: { email: user }
    });

    if(!userExists) {
      throw new Error('Unable to login');
    }

    const isValidPassword = await bcrypt.compare(password, userExists.password);

    if(!isValidPassword) {
      throw new Error('Unable to login');
    }

    console.log({ userExists })

    return {
      user: userExists,
      token: generateToken(userExists.id)
    };

  },
  async createUser(parent, args, ctx, info) {
    const { name, email, password } = args.data;

    const hashedPwd = await hashPassword(password);

    console.log({ hashedPwd });

    const newUser = await ctx.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPwd
      }
    });
  
    return newUser;
  },
  async updateUser(parent, { data }, { prisma, request }, info) {
    const userId = getUserId(request);

    const userExists = await prisma.user.findUnique({
      where: { id: userId }
    });

    if(!userExists) {
      throw new Error('User not found');
    }

    const updated = { ...data };

    if (typeof data.password === 'string') {
      updated.password = await hashPassword(data.password);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updated,
    });

    return updatedUser;
  },
  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    
    const userExists = await prisma.user.findUnique({
      where: { id: userId }
    });

    if(!userExists) {
      throw new Error('User not found');
    }

    // at this moment prisma 2 doesnt support cascade delete so we need to delete relations manually
    const deleteComments = prisma.comment.deleteMany({
      where: { userId }
    });

    const deletePosts = prisma.post.deleteMany({
      where: { userId }
    });

    const deleteUser = prisma.user.delete({
      where: { id: userId }
    })

    // The transaction runs synchronously so deleteUser must run last.
    const [deletedComments, deletedPosts, user] = await prisma.$transaction([deleteComments, deletePosts, deleteUser]);

    return user;
  },
  async createPost(parent, { data }, { prisma, pubsub, request }, info) {
    const userId = getUserId(request);
    
    const { title, body, published } = data;
    const userExists = await prisma.user.findUnique({
      where: { id: userId }
    });

    if(!userExists) {
      throw new Error('User not found');
    }

    const post = await prisma.post.create({
      data: {
        title,
        body,
        published: !!published,
        author: {
          connect: { id: userId }
        }
      },
      include: {
        author: true
      }
    });

    const payload = {
      mutation: 'CREATE',
      data: post
    }

    pubsub.publish('POST_SUBSCRIPTION', { post: payload })

    return post;
  },
  async updatePost(parent, { postId, data }, { prisma, request }, info) {
    const userId = getUserId(request);
    
    // This is not necessary, but it gives you a better idea of why the query will fail
    // If i didn't add this validation, the update query will just display some prisma error
    // that will be hard to present to the user
    const postExists = await prisma.post.findFirst({
      where: { 
        id: postId,
        userId
      }
    });

    if(!postExists) {
      throw new Error('Post not found');
    }

    const post = await prisma.post.update({
      where: {
        id: postId
      },
      data: {...data},
      include: {
        author: true
      }
    });

    console.log({ post });

    return post;
  },
  async deletePost(parent, { postId }, { prisma, request }, info) {
    const userId = getUserId(request);
    const postExists = await prisma.post.findFirst({
      where: { 
        id: postId,
        userId
      }
    });

    if(!postExists) {
      throw new Error('Post not found');
    }

    const comments = prisma.comment.deleteMany({
      where: { postId },
    })

    const post = prisma.post.delete({
      where: { id: postId },
    })

    const  [deletedComments, deletedPost] = await prisma.$transaction([comments, post]);

    return deletedPost;
  },
  async createComment(parent, { data }, { prisma, pubsub, request }, info) {
    const userId = getUserId(request);
    const { post, text } = data;

    const postExists = await prisma.post.findFirst({
      where: { 
        id: post,
        userId
      }
    });

    if(!postExists || !postExists.published) {
      throw new Error('Post not found');
    }

    const comment = await prisma.comment.create({
      data: {
        text,
        date: new Date(),
        author: {
          connect: { id: userId }
        },
        post: {
          connect: { id: post }
        }
      },
      include: {
        author: true,
        post: true
      }
    });

    const payload = {
      mutation: 'CREATE',
      data: comment
    }

    pubsub.publish('COMMENT_SUBSCRIPTION', { comment: payload })

    return comment;
  },
  async updateComment(parent, { commentId, text }, { prisma, request }, info) {
    const userId = getUserId(request);
    const commentExists = await prisma.comment.findFirst({
      where: { 
        id: commentId,
        userId
      }
    });

    if(!commentExists) {
      throw new Error('Comment not found')
    }

    const updatedComment = await prisma.comment.update({
      where: {
        id: commentId
      },
      data: { text },
      include: {
        post: true,
        author: true
      }
    });

    return updatedComment;
  },
  async deleteComment(parent, { commentId }, { prisma, request }, info) {
    const userId = getUserId(request);
    const commentExists = await prisma.comment.findFirst({
      where: { 
        id: commentId,
        userId
      }
    });

    if(!commentExists) {
      throw new Error('Comment not found');
    }

    const comment = await prisma.comment.delete({
      where: { id: commentId },
      include: {
        post: true,
        author: true
      }
    })

    return comment;
  },
}

export default Mutation;
