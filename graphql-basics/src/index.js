import { GraphQLServer } from 'graphql-yoga';

// Type definitions (schema)
const typeDefs = `
  type Query {
    hello: String!
    name: String!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    hello: () => {
      return 'This is my first Query!';
    },
    name: () => 'Pako Herrera Hernandez'
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log('🚀 The server us up in http://localhost:4000')
});
