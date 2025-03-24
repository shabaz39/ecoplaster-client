// src/constants/queries/paymentQueries.ts
import { gql } from '@apollo/client';



// Get payment by ID
export const GET_PAYMENT_BY_ID = gql`
  query GetPaymentById($id: ID!) {
    getPaymentById(id: $id) {
      _id
      userId
      orderId
      razorpayOrderId
      razorpayPaymentId
      amount
      currency
      status
      paymentMethod
      errorCode
      errorDescription
      createdAt
      updatedAt
      refundDetails {
        refundId
        amount
        status
        createdAt
        reason
      }
    }
  }
`;

// Get payment by order ID
export const GET_PAYMENT_BY_ORDER_ID = gql`
  query GetPaymentByOrderId($orderId: ID!) {
    getPaymentByOrderId(orderId: $orderId) {
      _id
      userId
      orderId
      razorpayOrderId
      razorpayPaymentId
      amount
      currency
      status
      paymentMethod
      errorCode
      errorDescription
      createdAt
      updatedAt
      refundDetails {
        refundId
        amount
        status
        createdAt
        reason
      }
    }
  }
`;

// Get user payments
export const GET_USER_PAYMENTS = gql`
  query GetUserPayments($userId: ID!) {
    getUserPayments(userId: $userId) {
      _id
      orderId
      razorpayOrderId
      razorpayPaymentId
      amount
      currency
      status
      paymentMethod
      createdAt
    }
  }
`;

// Create payment order
export const CREATE_PAYMENT_ORDER = gql`
  mutation CreatePaymentOrder($input: PaymentOrderInput!) {
    createPaymentOrder(input: $input) {
      razorpayOrderId
      amount
      currency
      receipt
      paymentId
      key
    }
  }
`;

// Verify payment
export const VERIFY_PAYMENT = gql`
  mutation VerifyPayment($input: PaymentVerificationInput!) {
    verifyPayment(input: $input) {
      paymentId
      orderId
      status
    }
  }
`;

// Handle payment failure
export const HANDLE_PAYMENT_FAILURE = gql`
  mutation HandlePaymentFailure($input: PaymentFailureInput!) {
    handlePaymentFailure(input: $input) {
      paymentId
      orderId
      status
    }
  }
`;

// Get order by ID (this was missing in the error logs)

export const GET_ORDER_BY_ID = gql`
query GetOrder($getOrderId: ID!) {
  getOrder(id: $getOrderId) {
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
      isDefault
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
}
`;
