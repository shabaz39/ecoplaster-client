import { gql } from '@apollo/client';

// Fragment for store fields to reduce duplication
const STORE_FIELDS = gql`
  fragment StoreFields on Store {
    id
    city
    storeCount
    address
    phoneNumber
    email
    coordinates {
      latitude
      longitude
    }
    iconUrl
    isActive
    createdAt
    updatedAt
  }
`;

// Queries
export const GET_ALL_STORES = gql`
  query GetAllStores {
    getAllStores {
      ...StoreFields
    }
  }
  ${STORE_FIELDS}
`;

export const GET_ACTIVE_STORES = gql`
  query GetActiveStores {
    getActiveStores {
      ...StoreFields
    }
  }
  ${STORE_FIELDS}
`;

export const GET_STORE_BY_ID = gql`
  query GetStoreById($id: ID!) {
    getStoreById(id: $id) {
      ...StoreFields
    }
  }
  ${STORE_FIELDS}
`;

export const GET_STORES_BY_CITY = gql`
  query GetStoresByCity($city: String!) {
    getStoresByCity(city: $city) {
      ...StoreFields
    }
  }
  ${STORE_FIELDS}
`;

export const SEARCH_STORES = gql`
  query SearchStores($searchTerm: String!) {
    searchStores(searchTerm: $searchTerm) {
      ...StoreFields
    }
  }
  ${STORE_FIELDS}
`;

// Mutations
export const CREATE_STORE = gql`
  mutation CreateStore($input: StoreInput!) {
    createStore(input: $input) {
      ...StoreFields
    }
  }
  ${STORE_FIELDS}
`;

export const UPDATE_STORE = gql`
  mutation UpdateStore($id: ID!, $input: StoreUpdateInput!) {
    updateStore(id: $id, input: $input) {
      ...StoreFields
    }
  }
  ${STORE_FIELDS}
`;

export const DELETE_STORE = gql`
  mutation DeleteStore($id: ID!) {
    deleteStore(id: $id)
  }
`;

export const TOGGLE_STORE_STATUS = gql`
  mutation ToggleStoreStatus($id: ID!) {
    toggleStoreStatus(id: $id) {
      id
      isActive
    }
  }
`;