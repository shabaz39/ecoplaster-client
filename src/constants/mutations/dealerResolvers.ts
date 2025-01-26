// graphql/mutations.ts
import { gql } from "@apollo/client";

export const ADD_DEALER = gql`
 mutation AddDealer($fullName: String!, $email: String!, $mobileNumber: String!, $city: String!, $type: String!, $notifications: Boolean!) {
  addDealer(fullName: $fullName, email: $email, mobileNumber: $mobileNumber, city: $city, type: $type, notifications: $notifications) {
    updatedAt
    type
    notifications
    mobileNumber
    id
    fullName
    email
    createdAt
    city
  }
}
`;

// graphql/queries.ts
 
export const GET_DEALERS = gql`
  query GetDealers {
    getDealers {
      id
      fullName
      email
      mobileNumber
      city
      type
      notifications
      createdAt
      updatedAt
    }
  }
`;

export const GET_DEALER = gql`
  query GetDealer($id: ID!) {
    getDealer(id: $id) {
      id
      fullName
      email
      mobileNumber
      city
      type
      notifications
      createdAt
      updatedAt
    }
  }
`;