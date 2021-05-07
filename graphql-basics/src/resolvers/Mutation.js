import { v4 as uuidv4 } from 'uuid'

const Mutation = {
  createUser(parent, args, { db }, info) {
    const isEmailTaken = db.users.some(user => user.email === args.userInput.email)

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
    db.users.push(user);

    return user;
  },
  deleteUser(parent, args, { db }, info) {
    const userIndex = db.users.findIndex(user => user.id === args.user);

    if(userIndex === -1) {
      throw new Error('User not found')
    }

    const [deletedUser] = db.users.splice(userIndex, 1);

    db.posts = db.posts.filter(post => {
      const postExist = post.author === deletedUser.id;

      if(postExist) {
        db.comments = db.comments.filter(comment => comment.post !== post.id)
      }

      return !postExist;
    });
    db.comments = db.comments.filter(comment => comment.author !== deletedUser.id);

    return deletedUser;
  },
  createPost(parent, args, { db }, info) {
    const userExists = db.users.some(user => user.id === args.postInput.author);

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

    db.posts.push(post);

    return post;
  },
  deletePost(parent, args, { db }, info) {
    const postIndex = db.posts.findIndex(post => post.id === args.postId);

    if(postIndex === -1) {
      throw new Error('Post not found')
    }

    const [deletedPost] = db.posts.splice(postIndex, 1);

    db.comments = db.comments.filter(comment => comment.post !== deletedPost.id);

    return deletedPost;
  },
  createComment(parent, args, { db }, info) {
    const userExists = db.users.some(user => user.id === args.commentInput.author);
    const postExists = db.posts.some(post => post.id === args.commentInput.post && post.published);

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

    db.comments.push(comment);

    return comment;

  },
  deleteComment(parent, args, { db }, info) {
    const commentIndex = db.comments.findIndex(comment => comment.id === args.commentId);

    if(commentIndex === -1) {
      throw new Error('Comment not found')
    }

    const [deletedComment] = db.comments.splice(commentIndex, 1);

    return deletedComment;
  },
};

export default Mutation;
