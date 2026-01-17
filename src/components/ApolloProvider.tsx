"use client";

import React, { ReactNode } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider as Provider,
} from "@apollo/client";

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_API || 'https://ecoplaster-server.netlify.app/.netlify/functions/graphql',
  cache: new InMemoryCache(),
});

const ApolloProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <Provider client={client}>{children}</Provider>;
};

export default ApolloProvider;
