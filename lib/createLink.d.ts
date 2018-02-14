import { ApolloClient } from "apollo-client";
export interface ClientOptions {
    uri: string;
    token: string;
}
export declare function createClient({token, uri}: ClientOptions): ApolloClient<any>;
