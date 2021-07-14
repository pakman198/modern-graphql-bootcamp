import { GraphQLServer, PubSub } from "graphql-yoga";
import { PrismaClient } from "@prisma/client";

import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import Subscription from './resolvers/Subscription';

const prisma = new PrismaClient();
const pubsub = new PubSub();

const server = new GraphQLServer({
	typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    Subscription
  },
  context: {
    prisma,
    pubsub
  }
});

server.start(() => {
	console.log("🚀 The server us up in http://localhost:4000");
});