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
    // at this moment prisma 2 doesnt support cascade delete so we need to delete relations manually
    const posts = await prisma.post.deleteMany({
      where: { userId }
    });

    const user = await prisma.user.delete({
      where: { id: userId },
    })

    return user;
  },
  async createPost(parent, { data }, { prisma }, info) {
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

    console.log({ post })

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
    const post = await prisma.post.delete({
      where: { id: postId },
    })

    return post;
  },
}

export default Mutation;
