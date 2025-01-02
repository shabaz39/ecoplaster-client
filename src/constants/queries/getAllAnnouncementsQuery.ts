import { gql } from '@apollo/client';

export const getAllAnnouncement = gql`
  query GetAnnouncements($limit: Int) {
    getAnnouncements(limit: $limit) {
      id
      message
    }
  }
`;