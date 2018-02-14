import * as WebSocket from "ws"
import * as fetch from "unfetch"
import { split } from "apollo-link"
import { ApolloClient } from "apollo-client"
import { InMemoryCache } from "apollo-cache-inmemory"
import { createHttpLink } from "apollo-link-http"
import { getMainDefinition } from "apollo-utilities"

import { WebSocketLink } from "apollo-link-ws"

export function createClient(config: { token: string; uri: string }): ApolloClient<any> {
  const { uri, token } = config

  const http = createHttpLink({
    uri,
    fetch,
    headers: {
      Authorization: "Bearer " + token
    }
  })

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

  return new ApolloClient({
    link: splitOnOperation(ws, http),
    cache: new InMemoryCache()
  })
}

function splitOnOperation(ws: WebSocketLink, http: any) {
  return split(
    // split based on operation type
    ({ query }) => {
      const node = getMainDefinition(query)
      return node.kind === "OperationDefinition" && node.operation === "subscription"
    },
    ws,
    http
  )
}
