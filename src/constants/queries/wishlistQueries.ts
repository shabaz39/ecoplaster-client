// src/graphql/wishlist.ts
import { gql } from '@apollo/client';
 
export const GET_ADMIN_WISHLIST = gql`
  query GetAdminWishlist($adminEmail: String!) {
    getAdminWishlist(adminEmail: $adminEmail) {
      id
      name
      code
      color
      fabric
      price {
        mrp
        offerPrice
      }
      images {
        imageMain
      }
    }
  }
`;
export const GET_USER_WISHLIST = gql`
  query GetUserWishlist($userEmail: String!) {
    getUserWishlist(userEmail: $userEmail) {
    id
    name
    code
    color
    fabric
    price {
      mrp
      offerPrice
    }
    series
    finish
    images {
      imageMain
      imageArtTable
      imageWall
      imageBedroom
      imageRoom
      imageLivingRoom
    }
  }
  }
`;

// Notice the parameter type is ID! instead of String!
export const ADD_TO_WISHLIST = gql`
  mutation AddToWishlist($productId: ID!, $userEmail: ID!) {
    addToWishlist(productId: $productId, userEmail: $userEmail) {
      id
      name
      email
      wishlist {
        id
        name
        code
        price {
          mrp
          offerPrice
        }
        images {
          imageMain
        }
      }
    }
  }
`;

// Notice the parameter type is ID! instead of String!
export const REMOVE_FROM_WISHLIST = gql`
  mutation RemoveFromWishlist($productId: ID!, $userEmail: ID!) {
    removeFromWishlist(productId: $productId, userEmail: $userEmail) {
      id
      name
      email
      wishlist {
        id
        name
        code
        price {
          mrp
          offerPrice
        }
        images {
          imageMain
        }
      }
    }
  }
`;