// src/components/UserDashboard/AddressForm.tsx
import React from 'react';
import { AddressInput } from './types';

interface AddressFormProps {
  newAddress: AddressInput;
  setNewAddress: React.Dispatch<React.SetStateAction<AddressInput>>;
  editingAddress: string | null;
  onSave: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({
  newAddress,
  setNewAddress,
  editingAddress,
  onSave,
  onCancel,
  isLoading
}) => {
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
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            onClick={onSave}
            className="px-4 py-2 bg-newgreensecond text-white rounded-md hover:bg-newgreen"
            disabled={
              isLoading || 
              !newAddress.street || 
              !newAddress.city || 
              !newAddress.state || 
              !newAddress.zip
            }
          >
            {isLoading 
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

export default AddressForm;