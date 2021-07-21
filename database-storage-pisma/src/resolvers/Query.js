import getUserId from '../utils/getUserId';

const Query = {
  context(parent, args, ctx, info) {
    const { user } = ctx.prisma;

    return "hoLa"
  },
  async me(parent, args, { prisma , request }, info) {
    const userId = getUserId(request);

    const user = await prisma.user.findUnique({
      where: {
        id: userId
      },
      include: { 
        posts: true,
        comments: true
      }
    });

    if(!user) {
      throw new Error('User not found')
    }

    return user;
  },
  async user(parent, args, { prisma }, info) {
    const { userId } = args;
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      },
      include: { 
        posts: true,
        comments: true
      }
    });

    if(!user) {
      throw new Error('User not found')
    }

    return user;
  },
  async users(parent, args, { prisma }, info) {
    const users = await prisma.user.findMany({
      include: { 
        posts: true,
        comments: true
      }
    });

    return users;
  },
  async post(parent, args, { prisma, request }, info) {
    const userId = getUserId(request, false);
    const { postId } = args;

    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        OR: [
          { published: true },
          { userId }
        ]
      },
      include: {
        author: true,
        comments: {
          include: {
            author: true
          }
        }
      }
    });

    if(!post) {
      throw new Error('Post not found')
    }

    return post;
  },
  async allPosts(parent, args, { prisma }, info) {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
        comments: {
          include: {
            author: true
          }
        }
      }
    });

    return posts;
  },
  async myPosts(parent, { query }, { prisma, request }, info) {
    const userId = getUserId(request);
    let condition = { userId };

    if (query) {
      condition = {
        userId,
        OR: [
          {
            title: { 
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            body: { 
              contains: query,
              mode: 'insensitive'
            }
          }
        ]
      };
    }

    console.log({ query })

    const posts = await prisma.post.findMany({
      where: condition,
      include: {
        author: true,
        comments: {
          include: {
            author: true
          }
        }
      }
    });

    return posts;
  },
  async posts(parent, { query }, { prisma }, info) {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
        OR: [
          {
            title: { 
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            body: { 
              contains: query,
              mode: 'insensitive'
            }
          }
        ]
      },
      include: {
        author: true,
        comments: {
          include: {
            author: true
          }
        }
      }
    });

    return posts;
  },
  async comment(parent, { commentId }, { prisma }, info) {
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId
      },
      include: {
        post: true,
        author: true,
      }
    });

    if(!comment) {
      throw new Error('Comment not found')
    }

    return comment;
  },
  async comments(parent, args, { prisma }, info) {
    const comments = await prisma.comment.findMany({
      include: {
        post: true,
        author: true,
      }
    });

    return comments;
  },
}

export default Query;
