// src/components/UserDashboard/types.ts

export interface SessionUser {
    id?: string;
    role: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
  
  export interface ProductItem {
    productId: string;
    name: string;
    code?: string | null; // <<< ADD THIS LINE (make optional)
    quantity: number;
    price: number;
    image: string;
  }
  
  export interface Order {
    id: string;
    orderNumber: string;
    createdAt: string;
    status: string;
    totalAmount: number;
    paymentStatus: string;
    products: ProductItem[];
    trackingNumber: string;
    shippingMethod: string;
    estimatedDelivery: string;
     // --- Add Shiprocket fields ---
     shiprocketOrderId?: string | null;
     shiprocketShipmentId?: string | null;
     shiprocketAWBCode?: string | null; // Shiprocket's AWB
     shiprocketCourier?: string | null; // Shiprocket's Courier
     // --- End Shiprocket fields ---
  }
  
  export interface Address {
    id: string;
    type?: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    isDefault?: boolean;
  }
  
  export interface WalletTransaction {
    id: string;
    type: string;
    amount: number;
    date: string;
    status: string;
    description?: string;
  }
  
  export interface UserPreferences {
    notifications: boolean;
    marketingEmails: boolean;
  }
  
  export interface WishlistItem {
    id: string;
    name: string;
    price: number | Price;  // Can be either number or Price object
    images: string[] | ProductImages;  // Can be either string[] or ProductImages object
  }
  export interface UserProfile {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    profileImage?: string;
    walletCoins: number;
    preferences: UserPreferences;
    wishlist: WishlistItem[];
    cart: Array<{productId: any, quantity: number}>;
    savedAddresses: Address[];
    // shippingAddress: Address[];
    walletTransactions?: WalletTransaction[];
  }
  
  export interface EditedProfileData {
    name: string;
    phoneNumber: string;
  }

  export interface Price {
    mrp: number;
    offerPrice: number;
  }
  
  export interface ProductImages {
    imageMain: string;
    imageArtTable: string;
    imageWall: string;
    imageBedroom: string;
    imageRoom: string;
    imageLivingRoom: string;
    imageSecondLivingRoom: string;

  }

  export interface AddressInput {
    type: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    isDefault: boolean;
  }

 
  // Order status steps definition for progress tracking
  export const orderStatusSteps = {
    "Pending": 0,
    "Processing": 1,
    "Shipped": 2,
    "Delivered": 3,
    "Cancelled": -1,
    "Returned": -2
  };
  
  // Helper functions
  export const formatDate = (dateString: string | number) => {
    try {
      // Handle different types of date inputs
      let date: Date;
      
      if (typeof dateString === 'number' || !isNaN(Number(dateString))) {
        // If it's a number (timestamp) or numeric string
        const timestamp = typeof dateString === 'number' ? dateString : Number(dateString);
        date = new Date(timestamp);
      } else {
        // Otherwise treat as ISO date string or other date format
        date = new Date(dateString);
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date value:', dateString);
        return 'Invalid date';
      }
      
      return date.toLocaleString('en-IN', { // Use Indian locale for consistency
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true // Use AM/PM
      });
    } catch (error) {
      console.error('Error formatting date:', error, 'Value:', dateString);
      return 'Invalid date';
    }
  };

  // Now, add a utility function to extract the date part from timestamps
const getDateOnly = (dateValue: string | number | Date): string => {
    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) {
        console.warn('Invalid date in getDateOnly:', dateValue);
        return '';
      }
      return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
    } catch (error) {
      console.error('Error in getDateOnly:', error);
      return '';
    }
  };

  
  // Status color helpers
  export const getStatusColor = (status: string): string => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Shipped":
        return "bg-purple-100 text-purple-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  export const getPaymentStatusColor = (status: string): string => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };