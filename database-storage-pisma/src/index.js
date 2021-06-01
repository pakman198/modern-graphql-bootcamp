import { GraphQLServer } from "graphql-yoga";
import { PrismaClient } from "@prisma/client";

import Query from './resolvers/Query';

const prisma = new PrismaClient()

const server = new GraphQLServer({
	typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
  },
  context: {
    prisma
  }
});

server.start(() => {
	console.log("🚀 The server us up in http://localhost:4000");
});