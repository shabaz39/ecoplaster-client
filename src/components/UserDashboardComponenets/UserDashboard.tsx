"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useQuery, useMutation, gql } from "@apollo/client";
import {
  ShoppingBag,
  MessageCircle,
  Gift,
  Wallet,
  MapPin,
  LogOut,
  HelpCircle,
  User,
  Heart,
  Bell,
  Settings,
  Package,
  Edit,
  ChevronRight,
  Clock,
  CheckCircle,
  TruckIcon,
  XCircle,
  AlertCircle,
  X
} from "lucide-react";

// Define types for session user, orders, addresses, etc.
interface SessionUser {
  id?: string;
  role: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface ProductItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
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
}

interface Address {
  id: string;
  type: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

interface WalletTransaction {
  id: string;
  type: string;
  amount: number;
  date: string;
  status: string;
  description?: string;
}

interface UserPreferences {
  notifications: boolean;
  marketingEmails: boolean;
}

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  images: string[];
}

interface UserProfile {
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
  walletTransactions?: WalletTransaction[];
}

interface EditedProfileData {
  name: string;
  phoneNumber: string;
}

interface AddressInput {
  type: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

// GraphQL queries
const GET_USER_ORDERS = gql`
  query GetUserOrders($userId: ID!) {
    getUserOrders(userId: $userId) {
      id
      orderNumber
      createdAt
      status
      totalAmount
      paymentStatus
      products {
        productId
        name
        quantity
        price
        image
      }
      trackingNumber
      shippingMethod
      estimatedDelivery
    }
  }
`;

const GET_USER_PROFILE = gql`
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

// Mutations
const UPDATE_USER_PROFILE = gql`
  mutation UpdateUser($id: ID!, $name: String, $phoneNumber: String) {
    updateUser(id: $id, name: $name, phoneNumber: $phoneNumber) {
      id
      name
      phoneNumber
    }
  }
`;

const ADD_ADDRESS = gql`
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

const UPDATE_ADDRESS = gql`
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

const DELETE_ADDRESS = gql`
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

const ADD_TO_WISHLIST = gql`
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

const REMOVE_FROM_WISHLIST = gql`
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

const ADD_TO_CART = gql`
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

const UPDATE_WALLET = gql`
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

const UPDATE_PREFERENCES = gql`
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

// Order status steps definition for progress tracking
const orderStatusSteps = {
  "Pending": 0,
  "Processing": 1,
  "Shipped": 2,
  "Delivered": 3,
  "Cancelled": -1,
  "Returned": -2
};

const UserDashboard: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [editingProfile, setEditingProfile] = useState(false);
  const [editedProfileData, setEditedProfileData] = useState<EditedProfileData>({
    name: "",
    phoneNumber: ""
  });
  const [newAddress, setNewAddress] = useState<AddressInput>({
    type: "Home",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
    isDefault: false
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [moneyAmount, setMoneyAmount] = useState(500);
  const [filterStatus, setFilterStatus] = useState("All");

  // Using optional chaining and providing fallback for session.user?.id
  const userId = (session?.user as SessionUser)?.id || '';
  
  // Fetch user profile (includes orders, wishlist, addresses, etc.)
  const { 
    data: profileData, 
    loading: profileLoading, 
    refetch: refetchProfile 
  } = useQuery(GET_USER_PROFILE, {
    variables: { userId },
    skip: !userId,
    onCompleted: (data) => {
      if (data?.getUser) {
        setEditedProfileData({
          name: data.getUser.name || "",
          phoneNumber: data.getUser.phoneNumber || ""
        });
      }
    }
  });

  // Fetch user orders
  const { data: ordersData, loading: ordersLoading } = useQuery(GET_USER_ORDERS, {
    variables: { userId },
    skip: !userId,
  });

  // Update profile mutation
  const [updateProfile, { loading: updating }] = useMutation(UPDATE_USER_PROFILE, {
    onCompleted: () => {
      refetchProfile();
    }
  });

  // Add address mutation
  const [addAddress, { loading: addingAddress }] = useMutation(ADD_ADDRESS, {
    onCompleted: () => {
      refetchProfile();
      setShowAddressForm(false);
      setNewAddress({
        type: "Home",
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "India",
        isDefault: false
      });
    }
  });

  // Update address mutation
  const [updateAddress, { loading: updatingAddress }] = useMutation(UPDATE_ADDRESS, {
    onCompleted: () => {
      refetchProfile();
      setEditingAddress(null);
      setNewAddress({
        type: "Home",
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "India",
        isDefault: false
      });
    }
  });

  // Delete address mutation
  const [deleteAddress] = useMutation(DELETE_ADDRESS, {
    onCompleted: () => {
      refetchProfile();
    }
  });

  // Add to wishlist mutation
  const [addToWishlist] = useMutation(ADD_TO_WISHLIST, {
    onCompleted: () => {
      refetchProfile();
    }
  });

  // Remove from wishlist mutation
  const [removeFromWishlist] = useMutation(REMOVE_FROM_WISHLIST, {
    onCompleted: () => {
      refetchProfile();
    }
  });

  // Add to cart mutation
  const [addToCart] = useMutation(ADD_TO_CART, {
    onCompleted: () => {
      refetchProfile();
    }
  });

  // Update wallet mutation
  const [updateWallet, { loading: updatingWallet }] = useMutation(UPDATE_WALLET, {
    onCompleted: () => {
      refetchProfile();
    }
  });

  // Update preferences mutation
  const [updatePreferences] = useMutation(UPDATE_PREFERENCES, {
    onCompleted: () => {
      refetchProfile();
    }
  });

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const handleUpdateProfile = async () => {
    try {
      await updateProfile({
        variables: {
          id: userId,
          name: editedProfileData.name,
          phoneNumber: editedProfileData.phoneNumber
        }
      });
      setEditingProfile(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleAddAddress = async () => {
    try {
      await addAddress({
        variables: {
          id: userId,
          address: newAddress
        }
      });
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  const handleUpdateAddress = async () => {
    if (!editingAddress) return;
    
    try {
      await updateAddress({
        variables: {
          userId,
          addressId: editingAddress,
          updates: newAddress
        }
      });
    } catch (error) {
      console.error("Error updating address:", error);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await deleteAddress({
        variables: {
          userId,
          addressId
        }
      });
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address.id);
    setNewAddress({
      type: address.type,
      street: address.street,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
      isDefault: address.isDefault
    });
    setShowAddressForm(true);
  };

  const handleMakeDefaultAddress = async (addressId: string) => {
    const address = addresses.find(addr => addr.id === addressId);
    if (!address) return;
    
    try {
      await updateAddress({
        variables: {
          userId,
          addressId,
          updates: { ...address, isDefault: true }
        }
      });
    } catch (error) {
      console.error("Error making address default:", error);
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart({
        variables: {
          id: userId,
          productId,
          quantity: 1
        }
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeFromWishlist({
        variables: {
          id: userId,
          productId
        }
      });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  const handleAddMoney = async (amount: number) => {
    try {
      await updateWallet({
        variables: {
          id: userId,
          amount
        }
      });
      setShowAddMoneyModal(false);
    } catch (error) {
      console.error("Error adding money to wallet:", error);
    }
  };

  const handleUpdatePreferences = async (key: string, value: boolean) => {
    try {
      const preferences = { ...userProfile.preferences };
      preferences[key as keyof UserPreferences] = value;
      
      await updatePreferences({
        variables: {
          id: userId,
          preferences
        }
      });
    } catch (error) {
      console.error("Error updating preferences:", error);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return 'Invalid date';
    }
  };
  // For demo purposes, we'll use this as a fallback if there's no real data
  const mockOrders: Order[] = [
    {
      id: "ord123",
      orderNumber: "ECO-12345",
      createdAt: new Date().toISOString(),
      status: "Delivered",
      totalAmount: 2850,
      paymentStatus: "Paid",
      products: [
        {
          productId: "prod1",
          name: "EcoPlaster Silk Series",
          quantity: 1,
          price: 1850,
          image: "/product1 (1).webp"
        },
        {
          productId: "prod2",
          name: "EcoPlaster Gold Series",
          quantity: 1,
          price: 1000,
          image: "/product1 (2).webp"
        }
      ],
      trackingNumber: "SHIP98765",
      shippingMethod: "Standard",
      estimatedDelivery: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString()
    },
    {
      id: "ord456",
      orderNumber: "ECO-67890",
      createdAt: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
      status: "Processing",
      totalAmount: 3150,
      paymentStatus: "Paid",
      products: [
        {
          productId: "prod3",
          name: "EcoPlaster Dual Series",
          quantity: 2,
          price: 1575,
          image: "/product1 (3).webp"
        }
      ],
      trackingNumber: "",
      shippingMethod: "Express",
      estimatedDelivery: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString()
    }
  ];

  const mockWishlistItems: WishlistItem[] = [
    {
      id: "prod1",
      name: "EcoPlaster Silk Series",
      price: 1850,
      images: ["/product1 (1).webp"]
    },
    {
      id: "prod2",
      name: "EcoPlaster Gold Series",
      price: 1000,
      images: ["/product1 (2).webp"]
    },
    {
      id: "prod3",
      name: "EcoPlaster Dual Series",
      price: 1575,
      images: ["/product1 (3).webp"]
    },
    {
      id: "prod4",
      name: "EcoPlaster Premium Series",
      price: 2100,
      images: ["/product1 (4).webp"]
    }
  ];

  const mockTransactions: WalletTransaction[] = [
    { id: 'tr1', type: 'Order Refund', amount: 350, date: '2023-03-01', status: 'Completed', description: 'Refund for order #ECO-12345' },
    { id: 'tr2', type: 'Order Payment', amount: -1200, date: '2023-02-25', status: 'Completed', description: 'Payment for order #ECO-67890' },
    { id: 'tr3', type: 'Wallet Recharge', amount: 1000, date: '2023-02-18', status: 'Completed', description: 'Added via credit card' },
    { id: 'tr4', type: 'Referral Bonus', amount: 250, date: '2023-02-10', status: 'Completed', description: 'Referral bonus for user123' }
  ];

  // Determine which data to use (real data or mock data)
  const orders = ordersData?.getUserOrders || mockOrders;
  const userProfile: UserProfile = profileData?.getUser || {
    id: userId || 'user123',
    name: session?.user?.name || "User",
    email: session?.user?.email || "user@example.com",
    phoneNumber: "+91 9876543210",
    profileImage: session?.user?.image,
    walletCoins: 500,
    wishlist: mockWishlistItems,
    savedAddresses: [],
    cart: [],
    walletTransactions: mockTransactions,
    preferences: {
      notifications: true,
      marketingEmails: false
    }
  };
  
  const addresses = userProfile?.savedAddresses || [];
  const wishlistItems = userProfile?.wishlist || [];
  const walletTransactions = userProfile?.walletTransactions || mockTransactions;

  // Filter orders based on selected status
  const filteredOrders = filterStatus === "All" 
    ? orders 
    : orders.filter((order :any)=> order.status === filterStatus);

  // Get order status color
  const getStatusColor = (status: string) => {
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

  // Get payment status color
  const getPaymentStatusColor = (status: string) => {
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

  // Render the order tracking component with a progress bar
  const OrderTracking = ({ order }: { order: Order }) => {
    const currentStep = orderStatusSteps[order.status as keyof typeof orderStatusSteps];
    
    // If order is cancelled or returned, show appropriate message
    if (currentStep < 0) {
      return (
        <div className="mt-4 p-4 border rounded-lg">
          {currentStep === -1 ? (
            <div className="flex items-center text-red-500">
              <XCircle className="mr-2" size={20} />
              <span>Order has been cancelled</span>
            </div>
          ) : (
            <div className="flex items-center text-orange-500">
              <AlertCircle className="mr-2" size={20} />
              <span>Order has been returned</span>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="mt-4 p-4 border rounded-lg">
        <h4 className="font-medium mb-4">Order Status</h4>
        <div className="relative">
          {/* Progress Bar */}
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
            <div className="bg-newgreensecond h-full" style={{ width: `${(currentStep / 3) * 100}%` }}></div>
          </div>
          
          {/* Status Steps */}
          <div className="flex justify-between">
            {['Pending', 'Processing', 'Shipped', 'Delivered'].map((step, index) => (
              <div key={step} className="flex flex-col items-center">
                <div className={`w-6 h-6 flex items-center justify-center rounded-full mb-1 ${index <= currentStep ? 'bg-newgreensecond text-white' : 'bg-gray-200'}`}>
                  {index < currentStep ? (
                    <CheckCircle size={14} />
                  ) : (
                    index === currentStep ? (
                      <Clock size={14} />
                    ) : (
                      <span className="text-xs">{index + 1}</span>
                    )
                  )}
                </div>
                <span className={`text-xs ${index <= currentStep ? 'text-newgreensecond font-medium' : 'text-gray-500'}`}>
                  {step}
                </span>
              </div>
            ))}
          </div>

          {/* Delivery Info */}
          {order.estimatedDelivery && (
            <div className="mt-4 text-sm">
              <span className="text-gray-600">Estimated delivery: </span>
              <span className="font-medium">{formatDate(order.estimatedDelivery)}</span>
            </div>
          )}
          
          {/* Tracking Info */}
          {order.trackingNumber && (
            <div className="mt-2 text-sm">
              <span className="text-gray-600">Tracking number: </span>
              <span className="font-medium">{order.trackingNumber}</span>
              <button className="ml-2 text-newgreensecond hover:underline">Track</button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render order details section
  const OrderDetails = ({ order }: { order: Order }) => {
    const [showDetails, setShowDetails] = useState(false);
    
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 mb-4">
        <div className="p-4">
          <div className="flex flex-wrap justify-between items-center">
            <div>
              <div className="flex items-center">
                <h3 className="font-medium">{order.orderNumber}</h3>
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <p className="text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">₹{order.totalAmount.toLocaleString()}</p>
              <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                {order.paymentStatus}
              </span>
            </div>
          </div>
          
          {/* Order items preview */}
          <div className="mt-3 flex overflow-x-auto gap-2">
            {order.products.map((product: ProductItem) => (
              <div key={product.productId} className="flex-shrink-0 w-16">
                <div className="h-16 w-16 rounded-md bg-gray-100 overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-3 flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {order.products.length} {order.products.length === 1 ? 'item' : 'items'}
            </span>
            <button 
              onClick={() => setShowDetails(!showDetails)} 
              className="text-newgreensecond hover:text-newgreen text-sm flex items-center"
            >
              {showDetails ? 'Hide details' : 'View details'}
              <ChevronRight className={`w-4 h-4 ml-1 ${showDetails ? 'rotate-90' : ''}`} />
            </button>
          </div>
        </div>
        
        {/* Expanded details */}
        {showDetails && (
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <h4 className="font-medium mb-2">Items in your order</h4>
            <div className="space-y-4">
              {order.products.map((product: ProductItem) => (
                <div key={product.productId} className="flex gap-4 items-center">
                  <div className="h-16 w-16 rounded-md bg-gray-100 overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium">{product.name}</h5>
                    <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{product.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Order tracking */}
            <OrderTracking order={order} />
            
            {/* Actions */}
            <div className="mt-4 flex justify-end gap-2">
              <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50">
                Need Help?
              </button>
              {order.status === "Delivered" && (
                <button className="px-3 py-1 bg-newgreensecond text-white text-sm rounded hover:bg-newgreen">
                  Write a Review
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };
  // Address Form component
  const AddressForm = () => {
    return (
      <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
        <h3 className="font-medium text-gray-800 mb-4">
          {editingAddress ? 'Edit Address' : 'Add New Address'}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address Type
            </label>
            <select
              value={newAddress.type}
              onChange={(e) => setNewAddress({...newAddress, type: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newgreensecond"
            >
              <option value="Home">Home</option>
              <option value="Office">Office</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address
            </label>
            <input
              type="text"
              value={newAddress.street}
              onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newgreensecond"
              placeholder="Enter your street address"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                value={newAddress.city}
                onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newgreensecond"
                placeholder="City"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                value={newAddress.state}
                onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newgreensecond"
                placeholder="State"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code
              </label>
              <input
                type="text"
                value={newAddress.zip}
                onChange={(e) => setNewAddress({...newAddress, zip: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newgreensecond"
                placeholder="PIN code"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                value={newAddress.country}
                onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newgreensecond"
                placeholder="Country"
              />
            </div>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isDefault"
              checked={newAddress.isDefault}
              onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
              className="h-4 w-4 text-newgreensecond focus:ring-newgreensecond border-gray-300 rounded"
            />
            <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
              Set as default address
            </label>
          </div>
          <div className="flex justify-end gap-3">
            <button 
              onClick={() => {
                setShowAddressForm(false);
                setEditingAddress(null);
                setNewAddress({
                  type: "Home",
                  street: "",
                  city: "",
                  state: "",
                  zip: "",
                  country: "India",
                  isDefault: false
                });
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={editingAddress ? handleUpdateAddress : handleAddAddress}
              className="px-4 py-2 bg-newgreensecond text-white rounded-md hover:bg-newgreen"
              disabled={
                addingAddress || 
                updatingAddress || 
                !newAddress.street || 
                !newAddress.city || 
                !newAddress.state || 
                !newAddress.zip
              }
            >
              {addingAddress || updatingAddress 
                ? 'Saving...' 
                : editingAddress 
                  ? 'Update Address' 
                  : 'Save Address'
              }
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Wallet transaction history component
  const WalletHistory = () => {
    return (
      <div>
        <h3 className="font-medium text-gray-800 mb-4">Transaction History</h3>
        {walletTransactions?.length > 0 ? (
          <div className="space-y-3">
            {walletTransactions.map((transaction) => (
              <div key={transaction.id} className="flex justify-between items-center p-3 border-b">
                <div>
                  <p className="font-medium">{transaction.type}</p>
                  <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                  {transaction.description && (
                    <p className="text-xs text-gray-500">{transaction.description}</p>
                  )}
                </div>
                <div className={transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                  {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">No transactions yet</p>
        )}
      </div>
    );
  };
  
  // Add Money to Wallet Modal
  const AddMoneyModal = () => {
    const presetAmounts = [100, 500, 1000, 2000];
    
    const handleSubmit = () => {
      handleAddMoney(moneyAmount);
    };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Add Money to Wallet</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter Amount (₹)
            </label>
            <input
              type="number"
              value={moneyAmount}
              onChange={(e) => setMoneyAmount(Number(e.target.value))}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newgreensecond"
            />
          </div>
          
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">Quick Select:</p>
            <div className="flex flex-wrap gap-2">
              {presetAmounts.map(amount => (
                <button
                  key={amount}
                  onClick={() => setMoneyAmount(amount)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    moneyAmount === amount 
                      ? 'bg-newgreensecond text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ₹{amount}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowAddMoneyModal(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={updatingWallet || moneyAmount <= 0}
              className="px-4 py-2 bg-newgreensecond text-white rounded-md hover:bg-newgreen disabled:opacity-50"
            >
              {updatingWallet ? 'Processing...' : 'Add Money'}
            </button>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <header className="bg-white px-6 py-8 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-700">
            Good {new Date().getHours() < 12 ? 'Morning' : 
                  new Date().getHours() < 17 ? 'Afternoon' : 'Evening'},
          </h1>
          <h2 className="text-xl font-semibold text-newgreensecond">
            {userProfile.name}
          </h2>
          <p className="text-sm text-gray-600">{userProfile.email}</p>
        </div>
        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-newgreensecond">
          {userProfile.profileImage ? (
            <img 
              src={userProfile.profileImage} 
              alt={userProfile.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <User className="text-gray-400" size={24} />
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-64 bg-white rounded-lg shadow-sm p-4">
            <nav>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'overview' 
                        ? 'bg-newgreensecond text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <User size={20} />
                    <span>Overview</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'orders' 
                        ? 'bg-newgreensecond text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ShoppingBag size={20} />
                    <span>My Orders</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('addresses')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'addresses' 
                        ? 'bg-newgreensecond text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <MapPin size={20} />
                    <span>My Addresses</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('wishlist')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'wishlist' 
                        ? 'bg-newgreensecond text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Heart size={20} />
                    <span>Wishlist</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('wallet')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'wallet' 
                        ? 'bg-newgreensecond text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Wallet size={20} />
                    <span>Wallet</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'settings' 
                        ? 'bg-newgreensecond text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Settings size={20} />
                    <span>Settings</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push('/contactus')}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <MessageCircle size={20} />
                    <span>Contact Support</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                  </button>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Overview</h2>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-newbeige rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-white rounded-full">
                          <ShoppingBag size={20} className="text-newgreensecond" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Orders</p>
                          <p className="text-xl font-semibold">{orders.length}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-newbeige rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-white rounded-full">
                          <Heart size={20} className="text-newgreensecond" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Wishlist</p>
                          <p className="text-xl font-semibold">{wishlistItems.length}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-newbeige rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-white rounded-full">
                          <Wallet size={20} className="text-newgreensecond" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Wallet</p>
                          <p className="text-xl font-semibold">₹{userProfile.walletCoins}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-newbeige rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-white rounded-full">
                          <MapPin size={20} className="text-newgreensecond" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Addresses</p>
                          <p className="text-xl font-semibold">{addresses.length}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Recent Orders */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-gray-800">Recent Orders</h3>
                      <button 
                        onClick={() => setActiveTab('orders')}
                        className="text-newgreensecond hover:underline text-sm"
                      >
                        View All
                      </button>
                    </div>
                    
                    {orders.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <ShoppingBag size={40} className="mx-auto text-gray-300 mb-2" />
                        <p className="text-gray-500">You haven't placed any orders yet</p>
                        <button
                          onClick={() => router.push('/allproducts')}
                          className="mt-4 bg-newgreensecond text-white px-4 py-2 rounded hover:bg-newgreen transition-colors"
                        >
                          Start Shopping
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.slice(0, 2).map((order:any) => (
                          <OrderDetails key={order.id} order={order} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Quick Links */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Quick Links</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { name: "Track Order", icon: TruckIcon, href: () => setActiveTab('orders') },
                      { name: "My Wishlist", icon: Heart, href: () => setActiveTab('wishlist') },
                      { name: "Account Settings", icon: Settings, href: () => setActiveTab('settings') },
                      { name: "Help Center", icon: HelpCircle, href: () => router.push('/faqs') }
                    ].map((link, index) => (
                      <button
                        key={index}
                        onClick={() => link.href()}
                        className="bg-cream hover:bg-gray-100 p-4 rounded-lg flex flex-col items-center justify-center gap-2"
                      >
                        <link.icon size={24} className="text-newgreensecond" />
                        <span className="text-sm font-medium text-gray-700">{link.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">My Orders</h2>
                
                {ordersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-newgreensecond border-newgreensecond border-opacity-25 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Loading your orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Package size={64} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No orders found</h3>
                    <p className="text-gray-500 mb-6">You haven't placed any orders yet</p>
                    <button
                      onClick={() => router.push('/allproducts')}
                      className="bg-newgreensecond text-white px-6 py-2 rounded-lg hover:bg-newgreen transition-colors"
                    >
                      Browse Products
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Order Filtering */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((status) => (
                        <button 
                          key={status}
                          onClick={() => setFilterStatus(status)}
                          className={`px-3 py-1 rounded-full text-sm ${
                            filterStatus === status
                              ? 'bg-newgreensecond text-white'
                              : 'bg-cream text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                    
                    {/* Orders List */}
                    <div className="space-y-4">
                      {filteredOrders.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                          <p className="text-gray-500">No orders with status "{filterStatus}"</p>
                        </div>
                      ) : (
                        filteredOrders.map((order:any) => (
                          <OrderDetails key={order.id} order={order} />
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">My Addresses</h2>
                  <button 
                    onClick={() => {
                      setShowAddressForm(true);
                      setEditingAddress(null);
                    }}
                    className="bg-newgreensecond text-white px-4 py-2 rounded hover:bg-newgreen transition-colors"
                  >
                    + Add New Address
                  </button>
                </div>
                
                {/* Address Form */}
                {showAddressForm && <AddressForm />}
                
                {profileLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-newgreensecond border-newgreensecond border-opacity-25 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Loading your addresses...</p>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <MapPin size={64} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No saved addresses</h3>
                    <p className="text-gray-500 mb-6">You haven't added any addresses yet</p>
                    <button 
                      onClick={() => setShowAddressForm(true)}
                      className="bg-newgreensecond text-white px-4 py-2 rounded hover:bg-newgreen transition-colors"
                    >
                      Add Your First Address
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                      <div 
                        key={address.id} 
                        className={`border rounded-lg p-4 ${address.isDefault ? 'border-newgreensecond bg-green-50' : 'border-gray-200'}`}
                      >
                        <div className="flex justify-between mb-2">
                          <span className="bg-cream px-2 py-0.5 text-xs font-medium rounded">{address.type}</span>
                          {address.isDefault && (
                            <span className="bg-newgreensecond text-white px-2 py-0.5 text-xs font-medium rounded">Default</span>
                          )}
                        </div>
                        <p className="font-medium">{address.street}</p>
                        <p className="text-gray-600 text-sm">{address.city}, {address.state}, {address.zip}</p>
                        <p className="text-gray-600 text-sm">{address.country}</p>
                        
                        <div className="mt-4 flex gap-2 justify-end">
                          <button 
                            onClick={() => handleEditAddress(address)}
                            className="text-gray-600 hover:text-gray-900 text-sm"
                          >
                            Edit
                          </button>
                          {!address.isDefault && (
                            <>
                              <span className="text-gray-300">|</span>
                              <button 
                                onClick={() => handleMakeDefaultAddress(address.id)}
                                className="text-gray-600 hover:text-gray-900 text-sm"
                              >
                                Make Default
                              </button>
                              <span className="text-gray-300">|</span>
                              <button 
                                onClick={() => handleDeleteAddress(address.id)}
                                className="text-red-600 hover:text-red-700 text-sm"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">My Wishlist</h2>
                
                {profileLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-newgreensecond border-newgreensecond border-opacity-25 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Loading your wishlist...</p>
                  </div>
                ) : wishlistItems.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Heart size={64} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-500 mb-6">Save items you like for later</p>
                    <button
                      onClick={() => router.push('/allproducts')}
                      className="bg-newgreensecond text-white px-6 py-2 rounded-lg hover:bg-newgreen transition-colors"
                    >
                      Browse Products
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlistItems.map((item) => (
                      <div key={item.id} className="border rounded-lg overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="relative aspect-square bg-gray-100">
                          <img 
                            src={item.images[0]} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                          <button 
                            onClick={() => handleRemoveFromWishlist(item.id)}
                            className="absolute top-2 right-2 p-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={16} className="text-red-500" />
                          </button>
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium mb-1">{item.name}</h3>
                          <p className="text-newgreensecond font-bold">₹{item.price.toLocaleString()}</p>
                          <button 
                            className="mt-2 w-full bg-newgreensecond text-white py-1.5 rounded hover:bg-newgreen transition-colors text-sm"
                            onClick={() => handleAddToCart(item.id)}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Wallet Tab */}
            {activeTab === 'wallet' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">My Wallet</h2>
                
                <div className="bg-gradient-to-r from-newgreen to-newgreensecond rounded-xl p-6 text-white mb-6">
                  <p className="text-lg opacity-90 mb-1">Available Balance</p>
                  <h3 className="text-3xl font-bold mb-4">₹{userProfile.walletCoins.toLocaleString()}</h3>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setShowAddMoneyModal(true)}
                      className="bg-white text-newgreensecond px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Add Money
                    </button>
                    <button className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors">
                      Withdraw
                    </button>
                  </div>
                </div>
                
                <WalletHistory />
              </div>
            )}
            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Account Settings</h2>
                
                {/* Profile Information */}
                <div className="mb-8">
                  <div className="flex justify-between mb-4">
                    <h3 className="font-medium text-gray-800">Profile Information</h3>
                    {!editingProfile && (
                      <button 
                        onClick={() => setEditingProfile(true)}
                        className="text-newgreensecond hover:text-newgreen text-sm flex items-center gap-1"
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                    )}
                  </div>
                  
                  {editingProfile ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={editedProfileData.name}
                          onChange={(e) => setEditedProfileData({...editedProfileData, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newgreensecond"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={editedProfileData.phoneNumber}
                          onChange={(e) => setEditedProfileData({...editedProfileData, phoneNumber: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newgreensecond"
                        />
                      </div>
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => setEditingProfile(false)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleUpdateProfile}
                          className="px-4 py-2 bg-newgreensecond text-white rounded-md hover:bg-newgreen"
                          disabled={updating}
                        >
                          {updating ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium">{userProfile.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email Address</p>
                        <p className="font-medium">{userProfile.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone Number</p>
                        <p className="font-medium">{userProfile.phoneNumber || 'Not provided'}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Password Management */}
                <div className="mb-8">
                  <h3 className="font-medium text-gray-800 mb-4">Password & Security</h3>
                  <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition-colors">
                    Change Password
                  </button>
                </div>
                
                {/* Notification Preferences */}
                <div className="mb-8">
                  <h3 className="font-medium text-gray-800 mb-4">Notification Preferences</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Order Updates</p>
                        <p className="text-sm text-gray-500">Receive updates about your orders</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={true} 
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-newgreensecond"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Price Alerts</p>
                        <p className="text-sm text-gray-500">Get notified about price drops on your wishlist</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={userProfile.preferences?.notifications || false} 
                          onChange={(e) => handleUpdatePreferences('notifications', e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-newgreensecond"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Marketing Emails</p>
                        <p className="text-sm text-gray-500">Receive promotional offers and news</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={userProfile.preferences?.marketingEmails || false} 
                          onChange={(e) => handleUpdatePreferences('marketingEmails', e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-newgreensecond"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Account Actions */}
                <div>
                  <h3 className="font-medium text-gray-800 mb-4">Account Actions</h3>
                  <div className="space-y-3">
                    <div>
                      <button 
                        onClick={handleSignOut} 
                        className="text-red-600 hover:text-red-700 flex items-center gap-2"
                      >
                        <LogOut size={18} />
                        Sign Out
                      </button>
                    </div>
                    <div>
                      <button className="text-red-600 hover:text-red-700">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Add Money Modal */}
      {showAddMoneyModal && <AddMoneyModal />}
    </div>
  );
};

export default UserDashboard;