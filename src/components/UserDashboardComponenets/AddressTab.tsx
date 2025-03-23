// src/components/UserDashboard/AddressesTab.tsx
import React, { useState } from 'react';
import { MapPin, Plus, Edit, CheckCircle, X, Save } from 'lucide-react';
import { useQuery, useMutation } from "@apollo/client";
import { 
  GET_USER_PROFILE,
  GET_USER_ADDRESSES,
  ADD_ADDRESS,
  UPDATE_ADDRESS,
  DELETE_ADDRESS
} from "../../constants/queries/userDashboardQueries";
import { Address, AddressInput } from './types';
import AddressForm from './AddressForm';
import OrderAddresses from './OrdersAddressComponent';

interface AddressesTabProps {
  userId: string;
}

const AddressesTab: React.FC<AddressesTabProps> = ({ userId }) => {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [newAddress, setNewAddress] = useState<AddressInput>({
    type: "Home",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
    isDefault: false
  });

  // Fetch user addresses using the dedicated query
  const { 
    data: addressData, 
    loading: addressLoading, 
    refetch: refetchAddresses 
  } = useQuery(GET_USER_ADDRESSES, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: 'network-only' // Ensure we always get fresh data
  });

  // Fetch user profile data for other user information
  const { 
    refetch: refetchProfile 
  } = useQuery(GET_USER_PROFILE, {
    variables: { userId },
    skip: !userId
  });

  // Mutations
  const [addAddress, { loading: addingAddress }] = useMutation(ADD_ADDRESS, {
    onCompleted: () => {
      refetchAddresses();
      refetchProfile();
      setShowAddressForm(false);
      resetAddressForm();
    }
  });

  const [updateAddress, { loading: updatingAddress }] = useMutation(UPDATE_ADDRESS, {
    onCompleted: () => {
      refetchAddresses();
      refetchProfile();
      setEditingAddress(null);
      resetAddressForm();
    }
  });

  const [deleteAddress, { loading: deletingAddress }] = useMutation(DELETE_ADDRESS, {
    onCompleted: () => {
      refetchAddresses();
      refetchProfile();
    }
  });

  // Extract addresses from query response
  const savedAddresses = addressData?.getUserAddresses || [];

  // Helper functions
  const resetAddressForm = () => {
    setNewAddress({
      type: "Home",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "India",
      isDefault: false
    });
  };

  const handleCancelAddressForm = () => {
    setShowAddressForm(false);
    setEditingAddress(null);
    resetAddressForm();
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

  const handleSaveAddress = () => {
    if (editingAddress) {
      handleUpdateAddress();
    } else {
      handleAddAddress();
    }
  };

  const handleEditAddress = (address: Address) => {
    // If the address ID starts with "shipping-" or "billing-", it's from an order
    // and not yet in the user's saved addresses
    const isOrderAddress = address.id && (address.id.startsWith('shipping-') || address.id.startsWith('billing-'));
    
    // Set the form data
    setNewAddress({
      type: address.type || "Home",
      street: address.street || "",
      city: address.city || "",
      state: address.state || "",
      zip: address.zip || "",
      country: address.country || "India",
      isDefault: address.isDefault || false
    });
    
    // For order addresses, don't set the editingAddress ID since it doesn't exist in savedAddresses
    if (isOrderAddress) {
      setEditingAddress(null); // Will create a new address instead of updating
    } else {
      setEditingAddress(address.id);
    }
    
    setShowAddressForm(true);
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

  const handleMakeDefaultAddress = async (addressId: string) => {
    const address = savedAddresses.find((addr: any) => addr.id === addressId);
    if (!address) return;
    
    try {
      // Update address to make it default
      await updateAddress({
        variables: {
          userId,
          addressId,
          updates: { 
            type: address.type,
            street: address.street,
            city: address.city,
            state: address.state,
            zip: address.zip,
            country: address.country,
            isDefault: true 
          }
        }
      });
    } catch (error) {
      console.error("Error making address default:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">My Addresses</h2>
        <button 
          onClick={() => {
            setShowAddressForm(true);
            setEditingAddress(null);
            resetAddressForm();
          }}
          className="bg-newgreensecond text-white px-4 py-2 rounded hover:bg-newgreen transition-colors"
        >
          + Add New Address
        </button>
      </div>
      
      {/* Address Form */}
      {showAddressForm && (
        <AddressForm 
          newAddress={newAddress}
          setNewAddress={setNewAddress}
          editingAddress={editingAddress}
          onSave={handleSaveAddress}
          onCancel={handleCancelAddressForm}
          isLoading={addingAddress || updatingAddress}
        />
      )}
      
      {/* Saved Addresses Section */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Saved Addresses</h3>
        
        {addressLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-newgreensecond border-newgreensecond border-opacity-25 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading your addresses...</p>
          </div>
        ) : savedAddresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedAddresses.map((address: any) => (
              <div 
                key={address.id} 
                className={`border rounded-lg p-4 ${address.isDefault ? 'border-newgreensecond bg-green-50' : 'border-gray-200'}`}
              >
                <div className="flex justify-between mb-2">
                  <span className="bg-cream px-2 py-0.5 text-xs font-medium rounded">{address.type}</span>
                  {address.isDefault && (
                    <span className="bg-newgreensecond text-white px-2 py-0.5 text-xs font-medium rounded flex items-center gap-1">
                      <CheckCircle size={12} />
                      Default
                    </span>
                  )}
                </div>
                <p className="font-medium">{address.street}</p>
                <p className="text-gray-600 text-sm">{address.city}, {address.state}, {address.zip}</p>
                <p className="text-gray-600 text-sm">{address.country}</p>
                
                <div className="mt-4 flex gap-2 justify-end">
                  <button 
                    onClick={() => handleEditAddress(address)}
                    className="text-gray-600 hover:text-gray-900 text-sm flex items-center gap-1"
                  >
                    <Edit size={14} />
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
                        disabled={deletingAddress}
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
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <MapPin size={40} className="mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500">You haven't added any addresses yet</p>
          </div>
        )}
      </div>
      
      {/* Order Addresses */}
      <div>
        <h3 className="text-lg font-medium mb-4">Addresses from Your Orders</h3>
        <OrderAddresses 
          userId={userId} 
          onEditAddress={handleEditAddress}
          onMakeDefault={handleMakeDefaultAddress}
          onDeleteAddress={handleDeleteAddress}
          refetchUserProfile={refetchAddresses}
          hideDefaultOption={true} // Add this flag to hide default option in order addresses
        />
      </div>
    </div>
  );
};

export default AddressesTab;