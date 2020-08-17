const { GraphQLServer } = require("graphql-yoga");

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
`;

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
      return id;
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });

//Start server
server.start(({ port }) => {
  console.log(`Server on http://localhost${port}/`);
});
