import { withFilter } from 'graphql-yoga';

const Subscription = {
  user: {
    subscribe(parent, args, { pubsub }, info) {

      return pubsub.asyncIterator(`user`)
    }
  },
  post: {
    subscribe: withFilter(
      (parent, args, { pubsub }, info) => pubsub.asyncIterator('POST_SUBSCRIPTION'),
      (payload, args, { prisma }, info) => {
        console.log(JSON.stringify(payload, null, 2));

        return payload.post.data.published;

      }
    )
  },
  comment: {
    subscribe: withFilter(
      (parent, args, { pubsub }, info) => pubsub.asyncIterator('COMMENT_SUBSCRIPTION'),
      (payload, { postId }, { prisma }, info) => {
        console.log({ postId, payload })
        console.log(JSON.stringify(payload, null, 2));

        return payload.comment.data.post.id === postId

      }
    )
  },
}

export default Subscription;
