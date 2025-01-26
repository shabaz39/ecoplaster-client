import { gql } from "@apollo/client";

 
export const CREATE_CONTACT = gql`
 mutation CreateContact($input: CreateContactInput!) {
  createContact(input: $input) {
    name
    email
    mobile
    category
    description
    status
    createdAt
    updatedAt
    id
  }
}
`;
 