const { GraphQLServer, PubSub } = require("graphql-yoga");

const messages = [];

//Setup Schema for types
//! - Required field
const typeDefs = `
    type Message {
        id: ID!
        user: String!
        content: String!
    }

    type Query {
        messages: [Message!]
    }

    type Mutation {
        postMessage(user: String!, content: String!): ID!
    }

    type Subscription {
      messages: [Message!]
    }
`;

const subscribers = [];
const onMessagesUpdate = (fn) => subscribers.push(fn);

/*Managing how to get data of Query types above*/
/*Managing how to mutation request affects curret 
messages array*/
const resolvers = {
  Query: {
    messages: () => messages,
  },
  Mutation: {
    postMessage: (parent, { user, content }) => {
      const id = messages.length;
      messages.push({
        id,
        user,
        content,
      });
      subscribers.forEach((fn) => fn());
      return id;
    },
  },
  Subscription: {
    messages: {
      subscribe: (parent, args, { pubsub }) => {
        //Random channel for each new user subscription
        const channel = Math.random().toString(36).slice(2, 15);

        //Publish messages to users channel on new message update
        onMessagesUpdate(() => pubsub.publish(channel, { messages }));

        /*Send content first time on first connection, instead of waiting
        for a new message*/
        setTimeout(() => pubsub.publish(channel, { messages }), 0);
        return pubsub.asyncIterator(channel);
      },
    },
  },
};

const pubsub = new PubSub();
const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } });

//Start server
server.start(({ port }) => {
  console.log(`Server on http://localhost${port}/`);
});
