// ecoplaster-client/src/components/AdminDashboardComponents/StoreManagement/StoreForm.tsx
import React, { useState, useEffect } from 'react';

interface StoreFormProps {
  onSubmit: (formData: any) => Promise<void>;
  initialData?: any;
  isLoading: boolean;
}

const StoreForm: React.FC<StoreFormProps> = ({ onSubmit, initialData, isLoading }) => {
  const [formData, setFormData] = useState({
    city: '',
    state: '',
    address: '',
    phone: '',
    timing: '10:00AM to 09:00PM',
    rating: 5,
    reviews: 0,
    directions: '#',
    icon: '/store-icon-1.png',
    active: true
  });
  
  const [error, setError] = useState('');

  // Set form data when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        city: initialData.city || '',
        state: initialData.state || '',
        address: initialData.address || '',
        phone: initialData.phone || '',
        timing: initialData.timing || '10:00AM to 09:00PM',
        rating: initialData.rating || 5,
        reviews: initialData.reviews || 0,
        directions: initialData.directions || '#',
        icon: initialData.icon || '/store-icon-1.png',
        active: initialData.active !== undefined ? initialData.active : true
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) : 
              name === 'active' ? (value === 'true') :
              value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!formData.city.trim()) {
      setError('City is required');
      return;
    }
    
    if (!formData.state.trim()) {
      setError('State is required');
      return;
    }
    
    if (!formData.address.trim()) {
      setError('Address is required');
      return;
    }
    
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return;
    }
    
    try {
      await onSubmit(formData);
    } catch (error: any) {
      setError(error.message || 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
          <p>{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City*
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="e.g., Bangalore"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenComponent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State*
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="e.g., Karnataka"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenComponent"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Address*
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="e.g., EcoPlaster Store, MG Road, Bangalore, Karnataka"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenComponent"
          rows={2}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number*
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g., 9492991123"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenComponent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Store Timing
          </label>
          <input
            type="text"
            name="timing"
            value={formData.timing}
            onChange={handleChange}
            placeholder="e.g., 10:00AM to 09:00PM"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenComponent"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rating (1-5)
          </label>
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            min="1"
            max="5"
            step="0.1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenComponent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reviews Count
          </label>
          <input
            type="number"
            name="reviews"
            value={formData.reviews}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenComponent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="active"
            value={formData.active.toString()}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenComponent"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Google Maps Direction URL
          </label>
          <input
            type="text"
            name="directions"
            value={formData.directions}
            onChange={handleChange}
            placeholder="e.g., https://www.google.com/maps/..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenComponent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Store Icon URL
          </label>
          <input
            type="text"
            name="icon"
            value={formData.icon}
            onChange={handleChange}
            placeholder="e.g., /store-icon-1.png"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenComponent"
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-greenComponent text-white rounded-md hover:bg-newgreen disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processing...' : initialData ? 'Update Store' : 'Create Store'}
        </button>
      </div>
    </form>
  );
};

export default StoreForm;