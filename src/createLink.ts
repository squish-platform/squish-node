import WebSocket from "ws"
import fetch from "isomorphic-fetch"
import { ApolloLink, split } from "apollo-link"
import { ApolloClient } from "apollo-client"
import { InMemoryCache } from "apollo-cache-inmemory"
import { HttpLink } from "apollo-link-http"
import { setContext } from "apollo-link-context"
import { getMainDefinition } from "apollo-utilities"

import { WebSocketLink } from "apollo-link-ws"

export interface ClientOptions {
  uri: string
  token: string
}
export function createClient({ token, uri }: ClientOptions): ApolloClient<any> {
  const http = new HttpLink({ uri, fetch })
  const ws = new WebSocketLink({
    uri: uri.replace("http", "ws"),
    options: {
      reconnect: true,
      connectionParams: {
        authToken: token
      }
    },
    webSocketImpl: WebSocket
  })

  const auth = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : ""
    }
  }))

  return new ApolloClient({
    link: splitOnOperation(ws, http),
    cache: new InMemoryCache()
  })
}

function splitOnOperation(ws: WebSocketLink, http: HttpLink) {
  return split(
    // split based on operation type
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query)
      return kind === "OperationDefinition" && operation === "subscription"
    },
    ws,
    http
  )
}
