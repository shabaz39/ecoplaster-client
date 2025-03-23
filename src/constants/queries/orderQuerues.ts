// File: ecoplaster-client/src/constants/queries/orderQueries.ts
import { gql } from '@apollo/client';

export const GET_ALL_ORDERS = gql`
  query GetAllOrders {
    getAllOrders {
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
  }
`;

export const GET_USER_ORDERS = gql`
  query GetUserOrders($userId: ID!) {
    getUserOrders(userId: $userId) {
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
  }
`;

export const GET_ORDER = gql`
  query GetOrder($id: ID!) {
    getOrder(id: $id) {
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
  }
`;

export const GET_ORDER_STATS = gql`
  query GetOrderStats {
    getOrderStats {
      totalOrders
      totalRevenue
      ordersByStatus
      recentOrders {
        date
        count
        revenue
      }
    }
  }
`;

export const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($orderId: ID!, $status: String!) {
    updateOrderStatus(orderId: $orderId, status: $status) {
      id
      status
      statusHistory {
        status
        updatedAt
      }
    }
  }
`;

export const UPDATE_ORDER_TRACKING = gql`
  mutation UpdateOrderTrackingInfo($orderId: ID!, $trackingNumber: String!, $shippingMethod: String!) {
    updateOrderTrackingInfo(orderId: $orderId, trackingNumber: $trackingNumber, shippingMethod: $shippingMethod) {
      id
      trackingNumber
      shippingMethod
    }
  }
`;

export const ADD_ORDER_NOTE = gql`
  mutation AddOrderNote($orderId: ID!, $note: String!) {
    addOrderNote(orderId: $orderId, note: $note) {
      id
      notes
    }
  }
`;

export const PLACE_ORDER = gql`
  mutation PlaceOrder($userId: ID!, $orderInput: OrderInput!) {
    placeOrder(userId: $userId, orderInput: $orderInput) {
      id
      totalAmount
      status
      paymentStatus
      trackingNumber
      createdAt
      products {
        productId
        name
        quantity
        price
      }
    }
  }
`;

export const CANCEL_ORDER = gql`
  mutation CancelOrder($orderId: ID!, $userId: ID!) {
    cancelOrder(orderId: $orderId, userId: $userId) {
      id
      status
    }
  }
`;

// Order status constants
export const ORDER_STATUSES = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  RETURNED: 'Returned'
};

// Payment status constants
export const PAYMENT_STATUSES = {
  PAID: 'Paid',
  PENDING: 'Pending',
  FAILED: 'Failed'
};

// Payment methods
export const PAYMENT_METHODS = {
  CARD: 'Card',
  UPI: 'UPI',
  COD: 'COD',
  NET_BANKING: 'Net Banking'
};

// Status badge colors
export const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case ORDER_STATUSES.PENDING:
      return 'bg-yellow-100 text-yellow-800';
    case ORDER_STATUSES.PROCESSING:
      return 'bg-blue-100 text-blue-800';
    case ORDER_STATUSES.SHIPPED:
      return 'bg-purple-100 text-purple-800';
    case ORDER_STATUSES.DELIVERED:
      return 'bg-green-100 text-green-800';
    case ORDER_STATUSES.CANCELLED:
      return 'bg-red-100 text-red-800';
    case ORDER_STATUSES.RETURNED:
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Payment status badge colors
export const getPaymentStatusBadgeClass = (status: string) => {
  switch (status) {
    case PAYMENT_STATUSES.PAID:
      return 'bg-green-100 text-green-800';
    case PAYMENT_STATUSES.PENDING:
      return 'bg-yellow-100 text-yellow-800';
    case PAYMENT_STATUSES.FAILED:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};