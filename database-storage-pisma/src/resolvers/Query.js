const Query = {
  context(parent, args, ctx, info) {
    const { user } = ctx.prisma;
    console.log({ user })

    return "hoLa"
  },
  async user(parent, args, { prisma }, info) {
    const { userId } = args;
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    return user;
  },
  async users(parent, args, { prisma }, info) {
    const users = await prisma.user.findMany();

    return users;
  }
}

export default Query;
