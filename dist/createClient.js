"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocket = require("ws");
const fetch = require("isomorphic-unfetch");
const apollo_link_1 = require("apollo-link");
const apollo_client_1 = require("apollo-client");
const apollo_cache_inmemory_1 = require("apollo-cache-inmemory");
const apollo_link_http_1 = require("apollo-link-http");
const apollo_utilities_1 = require("apollo-utilities");
const apollo_link_ws_1 = require("apollo-link-ws");
function createClient(config) {
    const { uri, token } = config;
    const http = apollo_link_http_1.createHttpLink({
        uri,
        fetch,
        headers: {
            Authorization: "Bearer " + token
        }
    });
    const ws = new apollo_link_ws_1.WebSocketLink({
        uri: uri.replace("http", "ws"),
        options: {
            lazy: true,
            reconnect: true,
            connectionParams: {
                authToken: token
            }
        },
        webSocketImpl: WebSocket
    });
    return new apollo_client_1.ApolloClient({
        ssrMode: true,
        link: splitOnOperation(ws, http),
        cache: new apollo_cache_inmemory_1.InMemoryCache()
    });
}
exports.createClient = createClient;
function splitOnOperation(ws, http) {
    return apollo_link_1.split(
    // split based on operation type
    ({ query }) => {
        const node = apollo_utilities_1.getMainDefinition(query);
        return node.kind === "OperationDefinition" && node.operation === "subscription";
    }, ws, http);
}
//# sourceMappingURL=createClient.js.map