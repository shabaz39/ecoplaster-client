import { ApolloClient, InMemoryCache } from "@apollo/client";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

const API_URL = 'https://ecoplaster-server-1.onrender.com'

const uploadLink = createUploadLink({
    uri: `${API_URL}/graphql`,
    headers: {
        'Apollo-Require-Preflight': 'true',
    },
    credentials: 'same-origin'  // Change this from 'include' to 'same-origin'
});

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: uploadLink,
});

export default client;