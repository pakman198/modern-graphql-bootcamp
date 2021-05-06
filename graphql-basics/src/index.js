import { GraphQLServer } from "graphql-yoga";
import { v4 as uuidv4 } from 'uuid'

// dummy data
const users = [
	{
		id: "1",
		name: "Pako",
		email: "pako@example.com",
		age: 32,
	},
	{
		id: "2",
		name: "Laura",
		email: "laura@example.com",
		age: 29,
	},
	{
		id: "3",
		name: "Alejandro",
		email: "Alejandro@example.com",
		age: 31,
	},
];

const posts = [
	{
		id: "123",
		title: "GraphQL 101",
		body: "Dummy content",
    published: true,
    author: '1',
	},
	{
		id: "234",
		title: "GraphQL 102",
		body: "Dummy content",
    published: false,
    author: '2',
	},
	{
		id: "345",
		title: "GraphQL 103",
		body: "Dummy content",
    published: true,
    author: '1',
	},
];

const comments = [
  {
    id: '123',
    text: 'Great content',
    author: '1',
    post: '123',
  },
  {
    id: '456',
    text: 'Could you provide an example',
    author: '2',
    post: '234',
  },
  {
    id: '789',
    text: 'Any recommendations?',
    author: '3',
    post: '345',
  },
  {
    id: '987',
    text: 'What up!',
    author: '1',
    post: '345',
  }
]

// Type definitions (schema)
const typeDefs = `
  type Query {
    users: [User!]!
    posts: [Post!]!
    comments: [Comment!]!
    me: User!
    post: Post!
  }

  type Mutation {
    createUser(userInput: CreateUserInput!): User!
    createPost(postInput: CreatePostInput!): Post!
    createComment(commentInput: CreateCommentInput!): Comment!
  }

  input CreateUserInput {
    name: String!, 
    email: String, 
    age: Int
  }

  input CreatePostInput {
    title: String!, 
    body: String!, 
    published: Boolean!, 
    author: ID!
  }

  input CreateCommentInput {
    text: String!, 
    author: ID!, 
    post: ID!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int,
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }
`;

// Resolvers
const resolvers = {
	Query: {
    users() {
      return users;
    },
    posts() {
      return posts;
    },
    comments() {
      return comments;
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
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      const isEmailTaken = users.some(user => user.email === args.userInput.email)

      if(isEmailTaken) {
        throw new Error('The email already exists');
      }

      const { name, email, age } = args.userInput;

      const user = {
        id: uuidv4(),
        name,
        email,
        age,
      };

      console.log(args)
      users.push(user);

      return user;
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some(user => user.id === args.postInput.author);

      if(!userExists) {
        throw new Error('User not found');
      }

      const { title, body, published, author } = args.postInput;

      const post = {
        id: uuidv4(),
        title,
        body,
        published,
        author,
      };

      posts.push(post);

      return post;
    },
    createComment(parent, args, ctx, info) {
      const userExists = users.some(user => user.id === args.commentInput.author);
      const postExists = posts.some(post => post.id === args.commentInput.post && post.published);

      if(!userExists) {
        throw new Error('User not found');
      }

      if(!postExists) {
        throw new Error('Post not found or not published');
      }

      const { text, author, post } = args.commentInput;
      const comment = {
        id: uuidv4(),
        text,
        author,
        post,
      }

      comments.push(comment);

      return comment;

    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => user.id === parent.author);
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => comment.post === parent.id)
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => post.author === parent.id);
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => comment.author === parent.id)
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find(user => user.id === parent.author);
    },
    post(parent, args, ctx, info) {
      return posts.find(post => post.id === parent.post);
    }
  }
};

const server = new GraphQLServer({
	typeDefs,
	resolvers,
});

server.start(() => {
	console.log("🚀 The server us up in http://localhost:4000");
});
