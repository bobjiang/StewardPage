import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

export function getApollo() {
  const client = new ApolloClient({
    link: new HttpLink({
      uri: "https://api.thegraph.com/subgraphs/name/withtally/protocol-gitcoin-bravo-v2",
    }),
    cache: new InMemoryCache(),
  });
  return client;
}
