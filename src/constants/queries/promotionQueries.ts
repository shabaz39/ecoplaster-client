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
    code
    startDate
    endDate
    active
    applicableProducts
    minimumPurchase
    maximumUses
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
      code
      startDate
      endDate
      active
      minimumPurchase
      maximumUses
      usesCount
      applicableProducts
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
      code
      startDate
      endDate
      active
      minimumPurchase
      maximumUses
      usesCount
      applicableProducts
      createdAt
      updatedAt
    }
  }
`;

export const VALIDATE_PROMO_CODE = gql`
  query ValidatePromoCode($code: String!) {
    validatePromoCode(code: $code) {
      id
      title
      discountValue
      discountType
      minimumPurchase
      code
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
      code
      startDate
      endDate
      active
      minimumPurchase
      maximumUses
      applicableProducts
      createdAt
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
      code
      startDate
      endDate
      active
      minimumPurchase
      maximumUses
      usesCount
      applicableProducts
      updatedAt
    }
  }
`;

export const DELETE_PROMOTION = gql`
  mutation DeletePromotion($id: ID!) {
    deletePromotion(id: $id)
  }
`;

export const INCREMENT_PROMOTION_USES = gql`
  mutation IncrementPromotionUses($id: ID!) {
    incrementPromotionUses(id: $id) {
      id
      usesCount
    }
  }
`;