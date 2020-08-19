import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";

import { Container } from "shards-react";

const client = new ApolloClient({
  uri: "http://localhost:4000/",
  cache: new InMemoryCache(),
});

const GET_MESSAGES = gql`
  query {
    messages {
      id
      content
      user
    }
  }
`;

const Messages = ({ user }) => {
  const { data } = useQuery(GET_MESSAGES);
  if (!data) {
    return null;
  }
  return (
    <>
      {data.messages.map(({ id, user: messageUser, content }, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            justifyContent: user === messageUser ? "flex-end" : "flex-start",
            paddingBottom: "1em",
          }}
        >
          <div
            style={{
              background: user === messageUser ? "blue" : "green",
              color: user === messageUser ? "white" : "black",
              padding: "1em",
              borderRadius: "1em",
              maxWidth: "60%",
            }}
          >
            {content}
          </div>
        </div>
      ))}
    </>
  );
};

const Chat = () => (
  <Container>
    <Messages user="John" />
  </Container>
);

export default () => (
  <ApolloProvider client={client}>
    <Chat />
  </ApolloProvider>
);
