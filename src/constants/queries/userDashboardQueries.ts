// src/components/UserDashboard/graphql/queries.ts
import { gql } from "@apollo/client";

import { TRACK_SHIPMENT } from './shipRocketQueries'; // Assuming you have this file

export const GET_ONE_USER_SHIPROCKET_ORDERS = gql`
  query GetUserOrders($userId: ID!) {
    getUserOrders(userId: $userId) {
      id
      # orderNumber might not exist, use id if needed
      totalAmount
      createdAt
      status
      paymentStatus
      trackingNumber # Shiprocket AWB often goes here
      shippingMethod # Shiprocket Courier Name often goes here
      estimatedDelivery
      # Add shiprocket specific fields if they exist on backend and are needed
      # shiprocketOrderId
      # shiprocketShipmentId
      # shiprocketAWBCode # Redundant if trackingNumber holds it
      # shiprocketCourier # Redundant if shippingMethod holds it
      products {
        productId
        name
        quantity
        price
        image
      }
    }
  }
`;

export const GET_ONE_USER_ORDERS = gql`
 query GetUserOrders($userId: ID!) {
  getUserOrders(userId: $userId) {
    id
    userId
    user {
      id
      name
      email
      emailVerified
      phoneNumber
      phoneVerified
      savedAddresses {
        id
        type
        street
        city
        state
        country
        zip
        phoneNumber
        isDefault
      }
      walletCoins
      walletTransactions {
        id
        type
        amount
        date
        status
        description
      }
      orders {
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
        shiprocketOrderId
        shiprocketShipmentId
        shiprocketAWBCode
        shiprocketCourier
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
          imageSecondLivingRoom
        }
        searchKeywords
        searchScore
        slug
        url
        createdAt
        updatedAt
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
    products {
      productId
      quantity
      price
      name
      code
      image
    }
    totalAmount
    shippingAddress {
      id
      type
      street
      city
      state
      country
      zip
      phoneNumber
      isDefault
    }
    billingAddress {
      id
      type
      street
      city
      state
      country
      zip
      phoneNumber
      isDefault
    }
    packageDetails {
      weight
      length
      breadth
      height
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
    shiprocketOrderId
    shiprocketShipmentId
    shiprocketAWBCode
    shiprocketCourier
  }
}
`;

export const GET_USER_PROFILE = gql`
  query GetUserProfile($userId: ID!) {
    getUser(id: $userId) {
      id
      name
      email
      phoneNumber
      profileImage
      walletCoins
      wishlist {
        id
        name
        price
        images
      }
      cart {
        productId {
          id
          name
          price
          images
        }
        quantity
      }
      savedAddresses {
        id
        type
        street
        city
        state
        zip
        country
        isDefault
      }
      walletTransactions {
        id
        type
        amount
        date
        status
        description
      }
      preferences {
        notifications
        marketingEmails
      }
    }
  }
`;


export const GET_USER_ADDRESSES = gql`
query GetUserAddresses($userId: ID!) {
  getUserAddresses(userId: $userId) {
    id
    type
    street
    city
    state
    country
    zip
    isDefault
  }
}
`;

export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUser($id: ID!, $name: String, $phoneNumber: String) {
    updateUser(id: $id, name: $name, phoneNumber: $phoneNumber) {
      id
      name
      phoneNumber
    }
  }
`;

export const ADD_ADDRESS = gql`
  mutation AddAddress($id: ID!, $address: AddressInput!) {
    addAddress(id: $id, address: $address) {
      id
      savedAddresses {
        id
        type
        street
        city
        state
        zip
        country
        isDefault
      }
    }
  }
`;

export const UPDATE_ADDRESS = gql`
  mutation UpdateAddress($userId: ID!, $addressId: ID!, $updates: AddressInput!) {
    updateAddress(userId: $userId, addressId: $addressId, updates: $updates) {
      id
      savedAddresses {
        id
        type
        street
        city
        state
        zip
        country
        isDefault
      }
    }
  }
`;

export const DELETE_ADDRESS = gql`
  mutation DeleteAddress($userId: ID!, $addressId: ID!) {
    deleteAddress(userId: $userId, addressId: $addressId) {
      id
      savedAddresses {
        id
        type
        street
        city
        state
        zip
        country
        isDefault
      }
    }
  }
`;

export const ADD_TO_WISHLIST = gql`
  mutation AddToWishlist($id: ID!, $productId: ID!) {
    addToWishlist(id: $id, productId: $productId) {
      id
      wishlist {
        id
        name
      }
    }
  }
`;

export const REMOVE_FROM_WISHLIST = gql`
  mutation RemoveFromWishlist($id: ID!, $productId: ID!) {
    removeFromWishlist(id: $id, productId: $productId) {
      id
      wishlist {
        id
        name
      }
    }
  }
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($id: ID!, $productId: ID!, $quantity: Int!) {
    addToCart(id: $id, productId: $productId, quantity: $quantity) {
      id
      cart {
        productId {
          id
          name
        }
        quantity
      }
    }
  }
`;

export const UPDATE_WALLET = gql`
  mutation UpdateWallet($id: ID!, $amount: Float!) {
    updateWallet(id: $id, amount: $amount) {
      id
      walletCoins
      walletTransactions {
        id
        type
        amount
        date
        status
        description
      }
    }
  }
`;

export const UPDATE_PREFERENCES = gql`
  mutation UpdatePreferences($id: ID!, $preferences: UserPreferencesInput!) {
    updatePreferences(id: $id, preferences: $preferences) {
      id
      preferences {
        notifications
        marketingEmails
      }
    }
  }
`;