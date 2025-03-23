// src/components/UserDashboard/UserDashboard.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useQuery, useMutation } from "@apollo/client";
import {
  ShoppingBag,
  MessageCircle,
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
  X,
  Menu
} from "lucide-react";

// Import components and types
import OrderDetails from "./OrderDetails";
import AddressesTab from "./AddressTab"; // Import the updated AddressesTab component
import { 
 Price,
 ProductImages,
  SessionUser, 
  UserProfile, 
  EditedProfileData, 
  Address, 
  Order
} from "./types";

// Import GraphQL queries and mutations
import {
  GET_ONE_USER_ORDERS,
  GET_USER_PROFILE,
  GET_USER_ADDRESSES,
  UPDATE_USER_PROFILE,
  ADD_TO_CART,
  UPDATE_PREFERENCES
} from "../../constants/queries/userDashboardQueries";
import OrdersPagination from "./OrdersPaginationComponent";
import {   GET_USER_WISHLIST,  ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST } from "@/constants/queries/wishlistQueries";
import { safeId } from '../../utils/safeId';
 

const UserDashboard: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

  
  
  // State for UI components
  const [activeTab, setActiveTab] = useState("overview");
  const [editingProfile, setEditingProfile] = useState(false);
  const [editedProfileData, setEditedProfileData] = useState<EditedProfileData>({
    name: "",
    phoneNumber: ""
  });
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Show 5 orders per page
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get user ID from session
  const rawUserId = (session?.user as SessionUser)?.id || '';
  const userId = safeId(rawUserId);  
  // Fetch user profile data
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
  
  // Add a dedicated wishlist query
  const {
    data: wishlistData,
    loading: wishlistLoading,
    refetch: refetchWishlist
  } = useQuery(GET_USER_WISHLIST, {
    variables: { userEmail: session?.user?.email || '' },
    skip: !session?.user?.email || status !== 'authenticated',
    onError: (error) => {
      console.error('Error fetching wishlist:', error);
    }
  });

  // Fetch user addresses
  const { 
    data: addressData, 
    loading: addressLoading 
  } = useQuery(GET_USER_ADDRESSES, {
    variables: { userId },
    skip: !userId
  });

  // Fetch user orders
  const { data: ordersData, loading: ordersLoading } = useQuery(GET_ONE_USER_ORDERS, {
    variables: { userId },
    skip: !userId,
    onCompleted: (data) => {
      console.log("Orders data received:", data);
    },
    onError: (error) => {
      console.error("Error fetching orders:", error);
    }
  });

  // Mutation for updating profile
  const [updateProfile, { loading: updating }] = useMutation(UPDATE_USER_PROFILE, {
    onCompleted: () => {
      refetchProfile();
    }
  });

  // Mutation for adding to wishlist
  // Update the mutations for wishlist operations
const [addToWishlistMutation] = useMutation(ADD_TO_WISHLIST, {
  onCompleted: () => {
    refetchWishlist(); // Refetch the wishlist data
    refetchProfile(); // Optionally refetch profile as well
  },
  onError: (error) => {
    console.error('Error adding to wishlist:', error);
  }
});

const [removeFromWishlistMutation] = useMutation(REMOVE_FROM_WISHLIST, {
  onCompleted: () => {
    refetchWishlist(); // Refetch the wishlist data
    refetchProfile(); // Optionally refetch profile as well
  },
  onError: (error) => {
    console.error('Error removing from wishlist:', error);
  }
});

  // Mutation for adding to cart
  const [addToCart] = useMutation(ADD_TO_CART, {
    onCompleted: () => {
      refetchProfile();
    }
  });

  // Mutation for updating preferences
  const [updatePreferences] = useMutation(UPDATE_PREFERENCES, {
    onCompleted: () => {
      refetchProfile();
    }
  });

  // Helper functions for user actions
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

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart({
        variables: {
          id: userId,
          productId: safeId(productId),
          quantity: 1
        }
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

// Update the handler functions
const handleAddToWishlist = async (productId: string) => {
    try {
      const userEmail = session?.user?.email;
      if (!userEmail) return;
      
      await addToWishlistMutation({
        variables: { productId, userEmail }  // Note the order: productId first, then userEmail
      });
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };
  
  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      const userEmail = session?.user?.email;
      if (!userEmail) return;
      
      await removeFromWishlistMutation({
        variables: { productId, userEmail }  // Note the order: productId first, then userEmail
      });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };


  const handleUpdatePreferences = async (key: string, value: boolean) => {
    try {
      const preferences = { ...userProfile.preferences };
      preferences[key as keyof typeof preferences] = value;
      
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

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Change tab and close mobile menu on small screens
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (window.innerWidth < 768) {
      setMobileMenuOpen(false);
    }
  };

 // Update the user profile and wishlist extraction part
const userProfile: UserProfile = profileData?.getUser || {
    id: userId || '',
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phoneNumber: "",
    profileImage: session?.user?.image,
    walletCoins: 0,
    wishlist: [], // We'll set this from wishlistData separately
    savedAddresses: [],
    cart: [],
    walletTransactions: [],
    preferences: {
      notifications: false,
      marketingEmails: false
    }
  };
  
  // Extract values for easier access - only using backend data
  const orders: Order[] = ordersData?.getUserOrders || [];
  const addresses = addressData?.getUserAddresses || [];
// Extract wishlist items from dedicated query instead of profile data
const wishlistItems = wishlistData?.getUserWishlist || [];
const isWishlistLoading = profileLoading || wishlistLoading;

  // Filter orders based on selected status
  const filteredOrders = filterStatus === "All" 
    ? orders 
    : orders.filter((order) => order.status === filterStatus);

  // Calculate the orders to show on the current page
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Reset pagination when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);
  
  // Reset to page 1 if the current page is now invalid
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage));
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [filteredOrders.length, currentPage, itemsPerPage]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Get the sidebar element
      const sidebar = document.getElementById('mobile-sidebar');
      
      // Check if the click was outside the sidebar
      if (mobileMenuOpen && sidebar && !sidebar.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    // Add event listener
    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  return (
    <div className="bg-gray-50 min-h-screen text-black">
      {/* Header Section */}
      <header className="bg-white px-4 md:px-6 py-4 md:py-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            type="button"
            className="inline-flex items-center justify-center md:hidden"
            onClick={toggleMobileMenu}
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          
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
      <div className="container mx-auto px-0 md:px-4 py-0 md:py-6">
        <div className="flex flex-col md:flex-row">
          {/* Overlay for mobile menu */}
          {mobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-gray-600 bg-opacity-75 z-30 md:hidden" 
              onClick={() => setMobileMenuOpen(false)}
            ></div>
          )}

          {/* Sidebar Navigation */}
          <aside 
            id="mobile-sidebar"
            className={`
              fixed md:relative top-0 left-0 bottom-0 z-40
              w-64 md:w-64 md:min-h-screen bg-white shadow-xl md:shadow-sm
              transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
              md:translate-x-0 transition duration-200 ease-in-out
              overflow-y-auto md:sticky md:top-6
            `}
          >
            <nav className="px-3 py-4 md:px-4 md:py-6">
              <ul className="space-y-2">
                {[
                  { id: 'overview', label: 'Overview', icon: User },
                  { id: 'orders', label: 'My Orders', icon: ShoppingBag },
                  { id: 'addresses', label: 'My Addresses', icon: MapPin },
                  { id: 'wishlist', label: 'Wishlist', icon: Heart },
                  { id: 'wallet', label: 'Wallet', icon: Wallet },
                  { id: 'settings', label: 'Settings', icon: Settings }
                ].map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => handleTabChange(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === item.id 
                          ? 'bg-newgreensecond text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
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
          <main className="flex-1 md:ml-6 pb-10 pt-6 px-4 md:px-0">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Overview</h2>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                      { label: 'Orders', value: orders.length, icon: ShoppingBag },
                      { label: 'Wishlist', value: wishlistItems.length, icon: Heart },
                      { label: 'Wallet', value: `₹${userProfile.walletCoins || 0}`, icon: Wallet },
                      { label: 'Addresses', value: addresses.length, icon: MapPin }
                    ].map((stat, index) => (
                      <div key={index} className="bg-newbeige rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-white rounded-full">
                            <stat.icon size={20} className="text-newgreensecond" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">{stat.label}</p>
                            <p className="text-xl font-semibold">{stat.value}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Recent Orders */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-gray-800">Recent Orders</h3>
                      <button 
                        onClick={() => handleTabChange('orders')}
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
                        {orders.slice(0, 2).map((order) => (
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
                      { name: "Track Order", icon: TruckIcon, action: () => handleTabChange('orders') },
                      { name: "My Wishlist", icon: Heart, action: () => handleTabChange('wishlist') },
                      { name: "Account Settings", icon: Settings, action: () => handleTabChange('settings') },
                      { name: "Help Center", icon: HelpCircle, action: () => router.push('/faqs') }
                    ].map((link, index) => (
                      <button
                        key={index}
                        onClick={link.action}
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
                          onClick={() => {
                            setFilterStatus(status);
                            setCurrentPage(1); // Reset to page 1 when filter changes
                          }}
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
                    
                    {/* Orders Summary */}
                    <div className="text-sm text-gray-600 mb-2">
                      Showing {Math.min(filteredOrders.length, (currentPage - 1) * itemsPerPage + 1)}-
                      {Math.min(filteredOrders.length, currentPage * itemsPerPage)} of {filteredOrders.length} orders
                    </div>
                    
                    {/* Orders List */}
                    <div className="space-y-4">
                      {filteredOrders.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                          <p className="text-gray-500">No orders with status "{filterStatus}"</p>
                        </div>
                      ) : (
                        paginatedOrders.map((order) => (
                          <OrderDetails key={order.id} order={order} />
                        ))
                      )}
                    </div>
                    
                    {/* Pagination */}
                    <OrdersPagination 
                      currentPage={currentPage}
                      totalItems={filteredOrders.length}
                      itemsPerPage={itemsPerPage}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab - Now using the improved AddressesTab component */}
            {activeTab === 'addresses' && (
              <AddressesTab userId={userId} />
            )}
            
           {/* Wishlist Tab */}
 {activeTab === 'wishlist' && (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <h2 className="text-xl font-semibold text-gray-800 mb-6">My Wishlist</h2>
    
    {isWishlistLoading ? (
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
        {wishlistItems.map((item:any) => (
          <div key={item.id} className="border rounded-lg overflow-hidden group hover:shadow-md transition-shadow">
            <div className="relative aspect-square bg-gray-100">
              {/* Fix for the image path issue */}
              <img 
                src={Array.isArray(item.images) ? item.images[0] : item.images?.imageMain} 
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
              {/* Fix for the price structure issue */}
              <p className="text-newgreensecond font-bold">
                ₹{typeof item.price === 'object' 
                    ? (item.price?.offerPrice || item.price?.mrp) 
                    : item.price}
              </p>
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
                
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <img 
                    src="/images/wallet-coming-soon.svg" 
                    alt="Wallet Coming Soon" 
                    className="w-32 h-32 mx-auto mb-4 opacity-70"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = "data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3crect x='2' y='6' width='20' height='12' rx='2' ry='2'%3e%3c/rect%3e%3cpath d='M22 10H18a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h4'%3e%3c/path%3e%3c/svg%3e";
                    }}
                  />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Our Digital Piggy Bank Is Under Construction!</h3>
                  <p className="text-gray-600 mb-4">We're building something special for your EcoPlaster savings. Our team is busy coding away, making sure your future wallet experience is smooth as silk plaster.</p>
                  <p className="text-gray-600 mb-6">Check back soon – your wallet will be ready before your next home renovation project!</p>
                  <button 
                    onClick={() => handleTabChange('overview')}
                    className="px-4 py-2 bg-newgreensecond text-white rounded-md hover:bg-newgreen transition-colors"
                  >
                    Back to Dashboard
                  </button>
                </div>
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
                    {[
                      {
                        id: 'orderUpdates',
                        title: 'Order Updates',
                        description: 'Receive updates about your orders',
                        checked: true,
                        disabled: true
                      },
                      {
                        id: 'notifications',
                        title: 'Price Alerts',
                        description: 'Get notified about price drops on your wishlist',
                        checked: userProfile.preferences?.notifications || false,
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
                          handleUpdatePreferences('notifications', e.target.checked)
                      },
                      {
                        id: 'marketingEmails',
                        title: 'Marketing Emails',
                        description: 'Receive promotional offers and news',
                        checked: userProfile.preferences?.marketingEmails || false,
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
                          handleUpdatePreferences('marketingEmails', e.target.checked)
                      }
                    ].map((preference) => (
                      <div key={preference.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{preference.title}</p>
                          <p className="text-sm text-gray-500">{preference.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={preference.checked} 
                            onChange={preference.onChange}
                            disabled={preference.disabled}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-newgreensecond"></div>
                        </label>
                      </div>
                    ))}
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
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;