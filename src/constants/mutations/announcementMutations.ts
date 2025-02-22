import { gql } from "@apollo/client";

export const CREATE_ANNOUNCEMENT = gql`
  mutation CreateAnnouncement($message: String!) {
    createAnnouncement(message: $message) {
      id
      message
      
    }
  }
`;

export const DELETE_ANNOUNCEMENT = gql`
  mutation DeleteAnnouncement($id: ID!) {
    deleteAnnouncement(id: $id) {
      id
      message
     
    }
  }
`;

export const GET_ALL_ANNOUNCEMENTS = gql`
  query GetAnnouncements($limit: Int) {
    getAnnouncements(limit: $limit) {
      id
      message
 
    }
  }
`;

export const UPDATE_ANNOUNCEMENT = gql`
  mutation UpdateAnnouncement($id: ID!, $message: String!) {
    updateAnnouncement(id: $id, message: $message) {
      id
      message
      
    }
  }
`;