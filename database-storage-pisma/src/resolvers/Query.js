const Query = {
  context(parent, args, ctx, info) {
    const { user } = ctx.prisma;

    return "hoLa"
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
  async post(parent, args, { prisma }, info) {
    const { postId } = args;
    const post = await prisma.post.findUnique({
      where: {
        id: postId
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
  async posts(parent, args, { prisma }, info) {
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
