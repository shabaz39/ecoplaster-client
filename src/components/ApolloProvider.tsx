"use client";

import React, { ReactNode } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider as Provider,
} from "@apollo/client";

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_API || 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});

const ApolloProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <Provider client={client}>{children}</Provider>;
};

export default ApolloProvider;
