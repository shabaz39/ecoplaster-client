import { ApolloClient, InMemoryCache } from "@apollo/client";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import fetch from "cross-fetch"; //  for server-side fetching
import { safeId } from '../utils/safeId'; // Import the safeId utility

const API_URL = "http://localhost:4000" 

// 'https://ecoplaster-server-1.onrender.com'

const uploadLink = createUploadLink({
    uri: `${API_URL}/graphql`,
    fetch,
    headers: {
        'Apollo-Require-Preflight': 'true',
    },
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
    link: uploadLink,
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