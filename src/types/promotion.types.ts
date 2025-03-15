// types/promotion.types.ts
export enum DiscountType {
    PERCENTAGE = 'PERCENTAGE',
    FIXED = 'FIXED'
  }
  
  export interface IPromotion {
    id: string;
    title: string;
    description: string;
    discountValue: number;
    discountType: DiscountType;
    code: string;
    startDate: string;
    endDate: string;
    active: boolean;
    applicableProducts: string[];
    minimumPurchase: number;
    maximumUses: number;
    usesCount: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreatePromotionInput {
    title: string;
    description: string;
    discountValue: number;
    discountType: DiscountType;
    code: string;
    startDate: string;
    endDate: string;
    active?: boolean;
    applicableProducts?: string[];
    minimumPurchase?: number;
    maximumUses?: number;
  }
  
  export interface UpdatePromotionInput {
    title?: string;
    description?: string;
    discountValue?: number;
    discountType?: DiscountType;
    code?: string;
    startDate?: string;
    endDate?: string;
    active?: boolean;
    applicableProducts?: string[];
    minimumPurchase?: number;
    maximumUses?: number;
  }