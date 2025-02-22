// graphql/mutations.ts
import { gql } from "@apollo/client";

export const CREATE_USER = gql`
mutation CreateUser($name: String!, $email: String!, $phoneNumber: String!, $password: String!) {
  createUser(name: $name, email: $email, phoneNumber: $phoneNumber, password: $password) {
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
    returnedOrders {
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
    role
    isActive
    accountLocked
    lastLogin
    loginAttempts
    wishlist
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


export const UPDATE_USER = gql `
 mutation UpdateUser($updateUserId: ID!, $name: String, $email: String, $phoneNumber: String, $walletCoins: Float, $isActive: Boolean, $accountLocked: Boolean, $preferences: UserPreferencesInput) {
  updateUser(id: $updateUserId, name: $name, email: $email, phoneNumber: $phoneNumber, walletCoins: $walletCoins, isActive: $isActive, accountLocked: $accountLocked, preferences: $preferences) {
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
    returnedOrders {
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
    role
    isActive
    accountLocked
    lastLogin
    loginAttempts
    wishlist
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
`

export const GET_ALL_USERS = gql`
 

 query GetAllUsers {
  getAllUsers {
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
    returnedOrders {
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
    role
    isActive
    accountLocked
    lastLogin
    loginAttempts
    wishlist
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


export const UPDATE_WALLET = gql`
 mutation UpdateWallet($updateWalletId: ID!, $amount: Float!) {
  updateWallet(id: $updateWalletId, amount: $amount) {
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
    returnedOrders {
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
    role
    isActive
    accountLocked
    lastLogin
    loginAttempts
    wishlist
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