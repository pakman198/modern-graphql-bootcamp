const Mutation = {
  async createUser(parent, args, ctx, info) {
    const { name, email } = args.data;
    const newUser = await ctx.prisma.user.create({
      data: {
        name,
        email
      }
    });
  
    return newUser;
  },
  async updateUser(parent, { data }, { prisma }, info) {
    const { id, name, email } = data;
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email },
    });

    return updatedUser;
  },
  async deleteUser(parent, { userId }, { prisma }, info) {
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
  async createPost(parent, { data }, { prisma, pubsub }, info) {
    const { author, title, body, published } = data;
    const userExists = await prisma.user.findUnique({
      where: { id: author }
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
          connect: { id: author }
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
  async updatePost(parent, { postId, data }, { prisma }, info) {
    
    // This is not necessary, but it gives you a better idea of why the query will fail
    // If i didn't add this validation, the update query will just display some prisma error
    // that will be hard to present to the user
    const postExists = await prisma.post.findUnique({
      where: { id: postId }
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
  async deletePost(parent, { postId }, { prisma }, info) {
    const postExists = await prisma.post.findUnique({
      where: { id: postId }
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
  async createComment(parent, { data }, { prisma, pubsub }, info) {
    const { post, author, text } = data;
    const userExists = await prisma.user.findUnique({
      where: { id: author }
    });

    const postExists = await prisma.post.findUnique({
      where: { id: post }
    });

    if(!userExists || !postExists || !postExists.published) {
      throw new Error('User or Post not found');
    }

    const comment = await prisma.comment.create({
      data: {
        text,
        date: new Date(),
        author: {
          connect: { id: author }
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
  async updateComment(parent, { commentId, text }, { prisma }, info) {
    const commentExists = await prisma.comment.findUnique({
      where: { id: commentId }
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
  async deleteComment(parent, { commentId }, { prisma }, info) {
    const commentExists = await prisma.comment.findUnique({
      where: { id: commentId }
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
