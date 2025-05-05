// ecoplaster-client/src/constants/queries/storeQueries.ts
import { gql } from '@apollo/client';

// Queries
export const GET_STORES = gql`
  query GetStores {
    getStores {
      id
      city
      state
      address
      phone
      timing
      rating
      reviews
      directions
      icon
      active
      createdAt
      updatedAt
    }
  }
`;

export const GET_ACTIVE_STORES = gql`
  query GetActiveStores {
    getActiveStores {
      id
      city
      state
      address
      phone
      timing
      rating
      reviews
      directions
      icon
      active
    }
  }
`;

export const GET_STORE_BY_ID = gql`
  query GetStoreById($id: ID!) {
    getStoreById(id: $id) {
      id
      city
      state
      address
      phone
      timing
      rating
      reviews
      directions
      icon
      active
      createdAt
      updatedAt
    }
  }
`;

// Mutations
export const CREATE_STORE = gql`
  mutation CreateStore($input: StoreInput!) {
    createStore(input: $input) {
      id
      city
      state
      address
      phone
      timing
      rating
      reviews
      directions
      icon
      active
    }
  }
`;

export const UPDATE_STORE = gql`
  mutation UpdateStore($id: ID!, $input: StoreUpdateInput!) {
    updateStore(id: $id, input: $input) {
      id
      city
      state
      address
      phone
      timing
      rating
      reviews
      directions
      icon
      active
    }
  }
`;

export const DELETE_STORE = gql`
  mutation DeleteStore($id: ID!) {
    deleteStore(id: $id)
  }
`;

export const TOGGLE_STORE_ACTIVE = gql`
  mutation ToggleStoreActive($id: ID!) {
    toggleStoreActive(id: $id) {
      id
      active
    }
  }
`;