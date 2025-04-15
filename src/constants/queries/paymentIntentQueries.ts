// src/constants/queries/paymentIntentQueries.ts
import { gql } from '@apollo/client';

export const GET_PAYMENT_INTENT = gql`
query GetPaymentIntent($id: ID!) {
  getPaymentIntent(id: $id) {
    id
    userId
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
    paymentMethod
    expiresAt
    metadata
  }
}
`;

// Create a payment intent (temporary order)
export const CREATE_PAYMENT_INTENT = gql`
  mutation CreatePaymentIntent($input: PaymentIntentInput!) {
    createPaymentIntent(input: $input) {
      id
      amount
      status
    }
  }
`;

// Confirm an order based on payment intent (for COD)
export const CONFIRM_ORDER = gql`
  mutation ConfirmOrder($paymentIntentId: ID!, $paymentStatus: String!) {
    confirmOrder(paymentIntentId: $paymentIntentId, paymentStatus: $paymentStatus) {
      id
      status
      paymentStatus
      totalAmount
      createdAt
    }
  }
`;

// Verify payment and confirm order in one step
export const VERIFY_PAYMENT_AND_CONFIRM_ORDER = gql`
  mutation VerifyPaymentAndConfirmOrder($input: VerifyPaymentAndConfirmInput!) {
    verifyPaymentAndConfirmOrder(input: $input) {
      success
      orderId
      status
    }
  }
`;

// TypeScript interfaces
export interface PaymentIntentInput {
  userId: string;
  products: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  shippingAddress: {
    type: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    phoneNumber: string;
    isDefault?: boolean;
  };
  billingAddress?: {
    type: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    phoneNumber: string;
    isDefault?: boolean;
  };
  paymentMethod: string;
}

export interface VerifyPaymentAndConfirmInput {
  intentId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}