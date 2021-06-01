const Query = {
  context(parent, args, ctx, info) {
    const { user } = ctx.prisma;
    console.log({ user })

    return "hoLa"
  },
  me() {
    return {
      id: '100',
      name: 'Pacquiao'
    }
  },
  hello() {
    return "HELLO PRISMA"
  }
}

export default Query;
