import { GraphQLServer, PubSub } from "graphql-yoga";
import { PrismaClient } from "@prisma/client";

import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import Subscription from './resolvers/Subscription';
import User from './resolvers/User';

const prisma = new PrismaClient();
const pubsub = new PubSub();

const server = new GraphQLServer({
	typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    Subscription,
    User
  },
  context(request) {
    return {
      request,
      prisma,
      pubsub
    }
  }
});

server.start({
  port: process.env.PORT || 4000,
  endpoint: '/gql'
}, () => {
	console.log("🚀 The server us up in http://localhost:4000");
});