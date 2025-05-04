// ecoplaster-client/src/components/AdminDashboardComponents/StoreManagement/StoreForm.tsx
import React, { useState, useEffect } from 'react';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Store {
  id: string;
  city: string;
  storeCount: number;
  address: string;
  phoneNumber: string;
  email?: string;
  coordinates?: Coordinates;
  iconUrl: string;
  isActive: boolean;
}

// Define a form data interface with optional fields
interface StoreFormData {
  city: string;
  storeCount: number;
  address: string;
  phoneNumber: string;
  email: string;
  coordinates: Coordinates;
  iconUrl: string;
  isActive: boolean;
}

// Define a submit data interface that matches expected backend format
interface StoreSubmitData {
  city: string;
  storeCount: number;
  address: string;
  phoneNumber: string;
  email?: string;
  coordinates?: Coordinates;
  iconUrl: string;
  isActive: boolean;
}

interface StoreFormProps {
  initialData?: Store | null;
  onSubmit: (data: StoreSubmitData) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const ICON_OPTIONS = [
  { value: "/store-icon-1.png", label: "Icon 1" },
  { value: "/store-icon-2.png", label: "Icon 2" },
  { value: "/store-icon-3.png", label: "Icon 3" },
  { value: "/store-icon-4.png", label: "Icon 4" },
  { value: "/store-icon-5.png", label: "Icon 5" },
  { value: "/store-icon-6.png", label: "Icon 6" },
  { value: "/store-icon-7.png", label: "Icon 7" },
  { value: "/store-icon-8.png", label: "Icon 8" },
  { value: "/store-icon-9.png", label: "Icon 9" },
];

const StoreForm: React.FC<StoreFormProps> = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState<StoreFormData>({
    city: '',
    storeCount: 1,
    address: '',
    phoneNumber: '',
    email: '',
    coordinates: {
      latitude: 0,
      longitude: 0
    },
    iconUrl: '/store-icon-1.png',
    isActive: true
  });

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with existing data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        city: initialData.city || '',
        storeCount: initialData.storeCount || 1,
        address: initialData.address || '',
        phoneNumber: initialData.phoneNumber || '',
        email: initialData.email || '',
        coordinates: initialData.coordinates || { latitude: 0, longitude: 0 },
        iconUrl: initialData.iconUrl || '/store-icon-1.png',
        isActive: initialData.isActive !== undefined ? initialData.isActive : true
      });
    }
  }, [initialData]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Convert value based on input type
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0
      });
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Handle coordinate changes
  const handleCoordinateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      coordinates: {
        ...formData.coordinates,
        [name]: parseFloat(value) || 0
      }
    });
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9+\-\s]{10,15}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (formData.storeCount < 1) {
      newErrors.storeCount = 'Store count must be at least 1';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Create a properly typed submission object with optional fields
      const submitData: StoreSubmitData = {
        city: formData.city,
        storeCount: formData.storeCount,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        iconUrl: formData.iconUrl,
        isActive: formData.isActive
      };
      
      // Only include non-empty email
      if (formData.email) {
        submitData.email = formData.email;
      }
      
      // Only include coordinates if both values are non-zero
      if (formData.coordinates.latitude !== 0 || formData.coordinates.longitude !== 0) {
        submitData.coordinates = formData.coordinates;
      }
      
      onSubmit(submitData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="text-lg font-semibold mb-4">
        {initialData ? 'Edit Store Location' : 'Add New Store Location'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City*
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
            required
          />
          {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
        </div>
        
        {/* Store Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Stores
          </label>
          <input
            type="number"
            name="storeCount"
            value={formData.storeCount}
            onChange={handleChange}
            min="1"
            className={`w-full px-3 py-2 border rounded-md ${errors.storeCount ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.storeCount && <p className="mt-1 text-xs text-red-500">{errors.storeCount}</p>}
        </div>
        
        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address*
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={2}
            className={`w-full px-3 py-2 border rounded-md ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
            required
          />
          {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
        </div>
        
        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number*
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
            required
          />
          {errors.phoneNumber && <p className="mt-1 text-xs text-red-500">{errors.phoneNumber}</p>}
        </div>
        
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email (Optional)
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>
        
        {/* Icon Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Store Icon
          </label>
          <div className="flex flex-wrap gap-2 mt-2">
            {ICON_OPTIONS.map((icon) => (
              <div 
                key={icon.value}
                onClick={() => setFormData({...formData, iconUrl: icon.value})}
                className={`w-10 h-10 rounded border-2 cursor-pointer ${
                  formData.iconUrl === icon.value 
                    ? 'border-greenComponent bg-green-50' 
                    : 'border-gray-200'
                }`}
              >
                <img src={icon.value} alt={icon.label} className="w-full h-full object-contain p-1" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Active Status */}
        <div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              className="h-4 w-4 text-greenComponent focus:ring-greenComponent border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Active</span>
          </label>
          <p className="mt-1 text-xs text-gray-500">
            Inactive stores will not be displayed on the website
          </p>
        </div>
      </div>
      
      {/* Map Coordinates (Optional) */}
      <div className="mt-6">
        <details className="border rounded p-2">
          <summary className="text-sm font-medium text-gray-700 cursor-pointer">
            Map Coordinates (Optional)
          </summary>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Latitude
              </label>
              <input
                type="number"
                name="latitude"
                value={formData.coordinates.latitude}
                onChange={handleCoordinateChange}
                step="any"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Longitude
              </label>
              <input
                type="number"
                name="longitude"
                value={formData.coordinates.longitude}
                onChange={handleCoordinateChange}
                step="any"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Coordinates can be used to display the store location on a map
          </p>
        </details>
      </div>
      
      {/* Form Actions */}
      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-greenComponent text-white rounded-md hover:bg-newgreen disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Store' : 'Add Store'}
        </button>
      </div>
    </form>
  );
};

export default StoreForm;