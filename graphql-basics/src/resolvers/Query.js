const Query = {
  users(parent, args, ctx, info) {
    return ctx.db.users;
  },
  posts(parent, args, ctx, info) {
    return ctx.db.posts;
  },
  comments(parent, args, ctx, info) {
    return ctx.db.comments;
  },
  me() {
    return {
      id: "1234567890",
      name: "Pako",
      email: "pako@example.com",
      age: 33,
    };
  },
  post() {
    return {
      id: "1234567890",
      title: "GraphQL 101",
      body: "This is an introduction to GraphQL",
      published: false,
    };
  },
}

export default Query;
