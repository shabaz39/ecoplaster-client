import { ApolloClient, InMemoryCache } from "@apollo/client";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import fetch from "cross-fetch"; //  for server-side fetching
import { safeId } from '../utils/safeId'; // Import the safeId utility
import { setContext } from '@apollo/client/link/context';

const API_URL = "http://localhost:4000" 

// Create the auth link to add the token to requests
const authLink = setContext(async (_, { headers }) => {
  // For client-side requests, we can try to get the session
  let token = "";
  
  // In the browser, try to get the token from localStorage or wherever you store it
  if (typeof window !== 'undefined') {
    // If you store token in localStorage or have another way to access it
    // You might need to adapt this based on how your auth system works
    const session = localStorage.getItem('session');
    if (session) {
      try {
        const parsedSession = JSON.parse(session);
        token = parsedSession.token || "";
      } catch (e) {
        console.error("Failed to parse session", e);
      }
    }
  }
  
  return {
    headers: {
      ...headers,
      'Apollo-Require-Preflight': 'true',
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

// Create the upload link
const uploadLink = createUploadLink({
    uri: `${API_URL}/graphql`,
    fetch,
    credentials: 'same-origin' // Change this from 'include' to 'same-origin'
});

// Configure cache with proper ID handling
const cache = new InMemoryCache({
  // Fixed the dataIdFromObject function to match Apollo's KeyFieldsFunction type
  dataIdFromObject: (object: any) => {
    if (object.__typename && object.id) {
      // Use safeId to handle potential Buffer objects
      return `${object.__typename}:${safeId(object.id)}`;
    }
    // Return undefined instead of null to match the expected type
    return undefined;
  },
  // Add typePolicies to properly handle IDs in specific types
  typePolicies: {
    User: {
      fields: {
        // Handle wishlist items properly
        wishlist: {
          merge(existing = [], incoming) {
            return incoming;
          }
        },
        // Handle orders properly
        orders: {
          merge(existing = [], incoming) {
            return incoming;
          }
        }
      }
    },
    Order: {
      fields: {
        // Handle user field properly
        user: {
          merge(existing, incoming) {
            return incoming;
          }
        }
      }
    }
  }
});

const client = new ApolloClient({
    link: authLink.concat(uploadLink), // Combine the auth link with the upload link
    cache: cache, // Use the enhanced cache configuration
    defaultOptions: {
      query: {
        fetchPolicy: "no-cache",
        errorPolicy: "all",
      },
      mutate: {
        fetchPolicy: "no-cache",
        errorPolicy: "all",
      },
    },
  });

export default client;