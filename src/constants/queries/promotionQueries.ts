// constants/queries/promotionQueries.ts
import { gql } from '@apollo/client';

export const GET_ALL_PROMOTIONS = gql`
  query GetAllPromotions {
    getAllPromotions {
      id
      title
      description
      discountValue
      discountType
      scope
      code
      startDate
      endDate
      active
      applicableProducts
      minimumPurchase
      maximumUses
      maxUsesPerUser
      usesCount
      createdAt
      updatedAt
    }
  }
`;

export const GET_ACTIVE_PROMOTIONS = gql`
  query GetActivePromotions {
    getActivePromotions {
      id
      title
      description
      discountValue
      discountType
      scope
      code
      startDate
      endDate
      active
      applicableProducts
      minimumPurchase
      maximumUses
      maxUsesPerUser
      usesCount
    }
  }
`;

export const GET_PROMOTION_BY_ID = gql`
  query GetPromotionById($id: ID!) {
    getPromotionById(id: $id) {
      id
      title
      description
      discountValue
      discountType
      scope
      code
      startDate
      endDate
      active
      applicableProducts
      minimumPurchase
      maximumUses
      maxUsesPerUser
      usesCount
      usageHistory {
        userId
        orderId
        usedAt
        discountApplied
        orderTotal
      }
      createdAt
      updatedAt
    }
  }
`;

export const VALIDATE_PROMO_CODE = gql`
  query ValidatePromoCode($code: String!, $userId: ID) {
    validatePromoCode(code: $code, userId: $userId) {
      id
      title
      description
      discountValue
      discountType
      scope
      code
      minimumPurchase
      applicableProducts
    }
  }
`;

export const CREATE_PROMOTION = gql`
  mutation CreatePromotion($input: PromotionInput!) {
    createPromotion(input: $input) {
      id
      title
      description
      discountValue
      discountType
      scope
      code
      startDate
      endDate
      active
      applicableProducts
      minimumPurchase
      maximumUses
      maxUsesPerUser
      usesCount
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PROMOTION = gql`
  mutation UpdatePromotion($id: ID!, $input: PromotionUpdateInput!) {
    updatePromotion(id: $id, input: $input) {
      id
      title
      description
      discountValue
      discountType
      scope
      code
      startDate
      endDate
      active
      applicableProducts
      minimumPurchase
      maximumUses
      maxUsesPerUser
      usesCount
      updatedAt
    }
  }
`;

export const DELETE_PROMOTION = gql`
  mutation DeletePromotion($id: ID!) {
    deletePromotion(id: $id)
  }
`;

export const RECORD_PROMOTION_USAGE = gql`
  mutation RecordPromotionUsage(
    $promotionId: ID!
    $userId: ID!
    $orderId: ID!
    $discountApplied: Float!
    $orderTotal: Float!
  ) {
    recordPromotionUsage(
      promotionId: $promotionId
      userId: $userId
      orderId: $orderId
      discountApplied: $discountApplied
      orderTotal: $orderTotal
    ) {
      id
      usesCount
      usageHistory {
        userId
        orderId
        usedAt
        discountApplied
        orderTotal
      }
    }
  }
`;

// New query for calculating discount
export const CALCULATE_PROMOTION_DISCOUNT = gql`
  query CalculatePromotionDiscount($code: String!, $cartItems: [CartItemInput!]!, $userId: ID) {
    calculatePromotionDiscount(code: $code, cartItems: $cartItems, userId: $userId) {
      totalDiscount
      itemDiscounts {
        productId
        originalPrice
        discountAmount
        finalPrice
        quantity
      }
      promotionApplied {
        id
        code
        title
        discountType
        scope
      }
    }
  }
`;

// Get user's promotion usage history
export const GET_USER_PROMOTION_USAGE = gql`
  query GetUserPromotionUsage($userId: ID!, $promotionId: ID) {
    getUserPromotionUsage(userId: $userId, promotionId: $promotionId) {
      promotionId
      promotionTitle
      promotionCode
      usageCount
      maxUsesPerUser
      canUseAgain
      usageHistory {
        userId
        orderId
        usedAt
        discountApplied
        orderTotal
      }
    }
  }
`;

export const GET_USER_PROMOTION_USAGE_HISTORY = gql`
  query GetUserPromotionUsageHistory($userId: ID!, $limit: Int) {
    getUserPromotionUsageHistory(userId: $userId, limit: $limit) {
      promotionId
      promotionTitle
      promotionCode
      orderId
      discountApplied
      orderTotal
      usedAt
    }
  }
`;