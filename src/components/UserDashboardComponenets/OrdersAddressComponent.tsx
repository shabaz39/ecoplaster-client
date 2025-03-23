// src/components/UserDashboard/OrdersAddressComponent.tsx
import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Edit, CheckCircle, X, Save } from 'lucide-react';
import { useQuery, useMutation } from "@apollo/client";
import { 
  GET_ONE_USER_ORDERS, 
  ADD_ADDRESS,
  UPDATE_ADDRESS,
  DELETE_ADDRESS
} from "../../constants/queries/userDashboardQueries";
import { Address, AddressInput } from './types';

interface OrderAddressesProps {
  userId: string;
  onEditAddress?: (address: Address) => void;
  onMakeDefault?: (addressId: string) => void;
  onDeleteAddress?: (addressId: string) => void;
  refetchUserProfile?: () => void;
  hideDefaultOption?: boolean; // New prop to control default option visibility
}

const OrderAddresses: React.FC<OrderAddressesProps> = ({
  userId,
  onEditAddress,
  onMakeDefault,
  onDeleteAddress,
  refetchUserProfile,
  hideDefaultOption = false // Default to showing default options
}) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showSaveToProfileButtons, setShowSaveToProfileButtons] = useState<{[key: string]: boolean}>({});

  // Mutations for address management
  const [addAddressToProfile, { loading: addingAddress }] = useMutation(ADD_ADDRESS, {
    onCompleted: () => {
      if (refetchUserProfile) refetchUserProfile();
    }
  });

  const [updateAddressInProfile, { loading: updatingAddress }] = useMutation(UPDATE_ADDRESS, {
    onCompleted: () => {
      if (refetchUserProfile) refetchUserProfile();
    }
  });

  // Fetch user orders
  const { data: ordersData, loading: ordersLoading } = useQuery(GET_ONE_USER_ORDERS, {
    variables: { userId },
    skip: !userId,
    onCompleted: (data) => {
      processOrderAddresses(data);
    },
    onError: (error) => {
      console.error("Error fetching orders for addresses:", error);
    }
  });

  // Process order addresses to extract unique addresses
  const processOrderAddresses = (data: any) => {
    if (!data?.getUserOrders) return;

    const orders = data.getUserOrders;
    const uniqueAddresses = new Map<string, Address>();
    
    // Process each order to extract shipping and billing addresses
    orders.forEach((order: any, index: number) => {
      if (order.shippingAddress) {
        const shippingAddress: Address = {
          id: order.shippingAddress.id || `shipping-${order.id}`, // Use existing ID or generate one
          type: order.shippingAddress.type || 'Home',
          street: order.shippingAddress.street,
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
          zip: order.shippingAddress.zip,
          country: order.shippingAddress.country,
          isDefault: order.shippingAddress.isDefault || (index === 0) // Make first address default if not specified
        };
        
        // Create a unique key for the address based on its content
        const addressKey = `${shippingAddress.street}-${shippingAddress.city}-${shippingAddress.zip}`;
        
        // Only add if not already in the map
        if (!uniqueAddresses.has(addressKey)) {
          uniqueAddresses.set(addressKey, shippingAddress);
        }
      }

      // Add billing address if different from shipping
      if (order.billingAddress && 
          (order.billingAddress.street !== order.shippingAddress?.street || 
           order.billingAddress.city !== order.shippingAddress?.city ||
           order.billingAddress.zip !== order.shippingAddress?.zip)) {
        
        const billingAddress: Address = {
          id: order.billingAddress.id || `billing-${order.id}`, // Use existing ID or generate one
          type: order.billingAddress.type || 'Billing',
          street: order.billingAddress.street,
          city: order.billingAddress.city,
          state: order.billingAddress.state,
          zip: order.billingAddress.zip,
          country: order.billingAddress.country,
          isDefault: false // Billing addresses are not default by default
        };
        
        // Create a unique key for the address
        const addressKey = `${billingAddress.street}-${billingAddress.city}-${billingAddress.zip}`;
        
        // Only add if not already in the map
        if (!uniqueAddresses.has(addressKey)) {
          uniqueAddresses.set(addressKey, billingAddress);
        }
      }
    });
    
    // Convert map values to array and sort (default address first, then alphabetically by street)
    const addressArray = Array.from(uniqueAddresses.values()).sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return a.street.localeCompare(b.street);
    });
    
    setAddresses(addressArray);
  };

  if (ordersLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-newgreensecond border-newgreensecond border-opacity-25 mx-auto"></div>
        <p className="mt-4 text-gray-500">Loading your addresses...</p>
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <MapPin size={64} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">No saved addresses</h3>
        <p className="text-gray-500 mb-6">You haven't added any addresses yet</p>
      </div>
    );
  }

  // Function to handle saving address to user profile
  const handleSaveToProfile = async (address: Address) => {
    // Convert the address to the expected input format
    const addressInput: AddressInput = {
      type: address.type || "Home",
      street: address.street,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
      isDefault: false // Don't make saved order addresses default automatically
    };
    
    try {
      await addAddressToProfile({
        variables: {
          id: userId,
          address: addressInput
        }
      });
      
      // Hide the save button after successful save
      setShowSaveToProfileButtons(prev => ({
        ...prev,
        [address.id]: false
      }));
      
      // Show success toast or message if you have a notification system
    } catch (error) {
      console.error("Error saving address to profile:", error);
      // Show error toast or message
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {addresses.map((address) => (
        <div 
          key={address.id} 
          className={`border rounded-lg p-4 ${address.isDefault && !hideDefaultOption ? 'border-newgreensecond bg-green-50' : 'border-gray-200'}`}
        >
          <div className="flex justify-between mb-2">
            <span className="bg-cream px-2 py-0.5 text-xs font-medium rounded">{address.type}</span>
            {address.isDefault && !hideDefaultOption && (
              <span className="bg-newgreensecond text-white px-2 py-0.5 text-xs font-medium rounded flex items-center gap-1">
                <CheckCircle size={12} />
                Default
              </span>
            )}
          </div>
          <p className="font-medium">{address.street}</p>
          <p className="text-gray-600 text-sm">{address.city}, {address.state}, {address.zip}</p>
          <p className="text-gray-600 text-sm">{address.country}</p>
          
          {/* Action buttons row */}
          <div className="mt-4 flex gap-2 justify-end">
            {/* Show save to profile button */}
            <button 
              onClick={() => handleSaveToProfile(address)}
              disabled={addingAddress}
              className="text-newgreensecond hover:text-newgreen text-sm flex items-center gap-1"
            >
              <Save size={14} />
              {addingAddress ? 'Saving...' : 'Save to Profile'}
            </button>
            
            {/* Separator */}
            <span className="text-gray-300">|</span>
            
            {/* Standard action buttons - only show if handlers are provided */}
            {onEditAddress && (
              <button 
                onClick={() => {
                  // Ensure the address has all required fields before editing
                  const addressForEdit: Address = {
                    id: address.id,
                    type: address.type || 'Home',
                    street: address.street,
                    city: address.city,
                    state: address.state,
                    zip: address.zip,
                    country: address.country,
                    isDefault: !!address.isDefault
                  };
                  onEditAddress(addressForEdit);
                }}
                className="text-gray-600 hover:text-gray-900 text-sm flex items-center gap-1"
              >
                <Edit size={14} />
                Edit
              </button>
            )}
            
            {/* Only show Make Default option if not hiding default options and address is not already default */}
            {!hideDefaultOption && !address.isDefault && onMakeDefault && (
              <>
                <span className="text-gray-300">|</span>
                <button 
                  onClick={() => onMakeDefault(address.id)}
                  className="text-gray-600 hover:text-gray-900 text-sm"
                >
                  Make Default
                </button>
              </>
            )}
            
            {!address.isDefault && onDeleteAddress && (
              <>
                <span className="text-gray-300">|</span>
                <button 
                  onClick={() => onDeleteAddress(address.id)}
                  className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                >
                  <X size={14} />
                  Remove
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderAddresses;