// src/graphql/wishlist.ts
import { gql } from '@apollo/client';

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
      images {
        imageMain
      }
    }
  }
`;

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

export const ADD_TO_WISHLIST = gql`
 mutation AddToWishlist($userEmail: String!, $productId: ID!) {
  addToWishlist(userEmail: $userEmail, productId: $productId) {
    id
    name
    email
    emailVerified
    phoneNumber
    phoneVerified
    savedAddresses {
      street
      city
      state
      country
      zip
    }
    walletCoins
    orders {
      id
      userId
      products {
        productId
        quantity
        price
      }
      totalAmount
      shippingAddress {
        street
        city
        state
        country
        zip
      }
      billingAddress {
        street
        city
        state
        country
        zip
      }
      paymentMethod
      paymentStatus
      trackingNumber
      shippingMethod
      transactionId
      status
      estimatedDelivery
      notes
      statusHistory {
        status
        updatedAt
      }
      createdAt
    }
    cancelledOrders {
      id
      userId
      totalAmount
      paymentMethod
      paymentStatus
      trackingNumber
      shippingMethod
      transactionId
      status
      estimatedDelivery
      notes
      createdAt
    }
    returnedOrders {
      id
      userId
      totalAmount
      paymentMethod
      paymentStatus
      trackingNumber
      shippingMethod
      transactionId
      status
      estimatedDelivery
      notes
      createdAt
    }
    role
    isActive
    accountLocked
    lastLogin
    loginAttempts
    wishlist {
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
    cart {
      productId
      quantity
    }
    referralCode
    referredBy
    preferences {
      notifications
      marketingEmails
    }
    dealershipName
    permissions
    supportTickets {
      ticketId
      issue
      status
    }
    createdAt
    updatedAt
  }
}
`;

export const REMOVE_FROM_WISHLIST = gql`
  mutation RemoveFromWishlist($userEmail: String!, $productId: ID!) {
    removeFromWishlist(userEmail: $userEmail, productId: $productId) {
      id
      email
      wishlist {
        id
      }
    }
  }
`;