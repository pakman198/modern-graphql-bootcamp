const Subscription = {
  comment: {
    subscribe(parent, { postId }, { db, pubsub}, info) {
      const postExist = db.posts.find(post => post.id === postId && post.published);

      if(!postExist) { 
        throw new Error("Post not found");
      }

      return pubsub.asyncIterator(`comment`)
    }
  },
  post: {
    subscribe(parent, args, { pubsub}, info) {

      return pubsub.asyncIterator(`post`)
    }
  }
}

export default Subscription;
