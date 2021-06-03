const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const { name, email } = args.data;
    const newUser = await prisma.user.create({
      data: {
        name,
        email
      }
    });
  
    return newUser;
  },
  async updateUser(parent, args, { prisma }, info) {
    const { id, name, email } = args.data;
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email },
    });

    return updatedUser;
  },
  async deleteUser(parent, args, { prisma }, info) {
    const { userId } = args;
    const user = await prisma.user.delete({
      where: { id: userId },
    })

    return user;
  }
}

export default Mutation;
