import { gql } from "@apollo/client";

export const CREATE_BANNER_PREFERENCE = gql`
  mutation CreateBannerPreference($input: BannerPreferenceInput!) {
    createBannerPreference(input: $input) {
      id
      budget
      concern
      look
      space
      surface
      createdAt
    }
  }
`;
