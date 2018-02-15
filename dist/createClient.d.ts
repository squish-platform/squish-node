import { ApolloClient } from "apollo-client";
export declare function createClient(config: {
    token: string;
    uri: string;
}): ApolloClient<any>;
