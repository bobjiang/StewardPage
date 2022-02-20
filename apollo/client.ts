import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client"

let client: ApolloClient<NormalizedCacheObject>

export function getApollo() {
  if (!client) {
    client = new ApolloClient({
      link: new HttpLink({
        uri: "https://api.thegraph.com/subgraphs/name/withtally/protocol-gitcoin-bravo-v2",
      }),
      cache: new InMemoryCache(),
    })
  }
  return client
}

let withTallyClient: ApolloClient<NormalizedCacheObject>
export function getWithTallyClient() {
  if (!withTallyClient) {
    withTallyClient = new ApolloClient({
      link: new HttpLink({
        uri: "https://api.withtally.com/query",
      }),
      cache: new InMemoryCache(),
    })
  }
  return withTallyClient
}
