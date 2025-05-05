// ecoplaster-client/src/types/store.types.ts
export interface Store {
    id: string;
    city: string;
    state: string;
    address: string;
    phone: string;
    timing: string;
    rating: number;
    reviews: number;
    directions: string;
    icon: string;
    active: boolean;
    createdAt?: string; // Make optional with ?
    updatedAt?: string; // Make optional with ?
  }