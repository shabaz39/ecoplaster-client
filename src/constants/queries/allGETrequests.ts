import { gql } from '@apollo/client';


export const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      id
      name
      email
      phoneNumber
      role
      isActive
    }
  }
`;

export const GET_ALL_DEALERS = gql`
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

export const GET_ALL_CONTACTS = gql`
 query GetContacts {
  getContacts {
    id
    name
    email
    mobile
    category
    description
    status
    createdAt
    updatedAt
  }
}
`;
