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

const db = {
  users,
  posts,
  comments
}

export default db;