// components/AdminDashboardComponents/PromotionManagement/PromotionForm.tsx
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '@/constants/queries/productQueries';

interface PromotionFormProps {
  onSubmit: (formData: any) => Promise<void>;
  initialData?: {
    id: string;
    title: string;
    description: string;
    discountValue: number;
    discountType: 'PERCENTAGE' | 'FIXED';
    code: string;
    startDate: string;
    endDate: string;
    minimumPurchase: number;
    maximumUses: number;
    applicableProducts: string[];
  };
}

const PromotionForm: React.FC<PromotionFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discountValue: 0,
    discountType: 'PERCENTAGE',
    code: '',
    startDate: '',
    endDate: '',
    minimumPurchase: 0,
    maximumUses: 0,
    applicableProducts: [] as string[],
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { data: productsData } = useQuery(GET_PRODUCTS);

  useEffect(() => {
    if (initialData) {
      // Format dates for input fields (YYYY-MM-DD)
      const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };

      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        discountValue: initialData.discountValue || 0,
        discountType: initialData.discountType || 'PERCENTAGE',
        code: initialData.code || '',
        startDate: formatDate(initialData.startDate),
        endDate: formatDate(initialData.endDate),
        minimumPurchase: initialData.minimumPurchase || 0,
        maximumUses: initialData.maximumUses || 0,
        applicableProducts: initialData.applicableProducts || [],
      });
    } else {
      // Set default dates for new promotions
      const today = new Date();
      const nextMonth = new Date();
      nextMonth.setMonth(today.getMonth() + 1);
      
      setFormData({
        ...formData,
        startDate: today.toISOString().split('T')[0],
        endDate: nextMonth.toISOString().split('T')[0],
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) : value,
    });
  };

  const handleProductSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({
      ...formData,
      applicableProducts: selectedOptions,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!formData.code.trim()) {
      setError('Promotion code is required');
      return;
    }
    
    if (formData.discountValue <= 0) {
      setError('Discount value must be greater than 0');
      return;
    }
    
    if (formData.discountType === 'PERCENTAGE' && formData.discountValue > 100) {
      setError('Percentage discount cannot exceed 100%');
      return;
    }
    
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    
    if (startDate > endDate) {
      setError('End date must be after start date');
      return;
    }
    
    setLoading(true);
    
    try {
      await onSubmit({
        ...formData,
        // Convert strings to proper types
        discountValue: parseFloat(formData.discountValue.toString()),
        minimumPurchase: parseFloat(formData.minimumPurchase.toString()),
        maximumUses: parseInt(formData.maximumUses.toString()),
      });
    } catch (error: any) {
      setError(error.message || 'An error occurred while saving the promotion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-black">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
          <p>{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Promotion Title*
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Summer Sale"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenComponent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description*
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Details about the promotion..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenComponent"
              rows={3}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Promotion Code*
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="SUMMER25"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenComponent"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Customers will enter this code at checkout
            </p>
          </div>
        </div>
        
        {/* Discount Details */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Type*
              </label>
              <select
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenComponent"
                required
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed Amount (₹)</option>
              </select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Value*
              </label>
              <input
                type="number"
                name="discountValue"
                value={formData.discountValue}
                onChange={handleChange}
                min="0"
                max={formData.discountType === 'PERCENTAGE' ? 100 : undefined}
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenComponent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.discountType === 'PERCENTAGE' 
                  ? 'Enter percentage (0-100)' 
                  : 'Enter amount in ₹'}
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date*
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenComponent"
                required
              />
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date*
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenComponent"
                required
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Purchase (₹)
              </label>
              <input
                type="number"
                name="minimumPurchase"
                value={formData.minimumPurchase}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenComponent"
              />
              <p className="text-xs text-gray-500 mt-1">
                0 = No minimum
              </p>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Uses
              </label>
              <input
                type="number"
                name="maximumUses"
                value={formData.maximumUses}
                onChange={handleChange}
                min="0"
                step="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenComponent"
              />
              <p className="text-xs text-gray-500 mt-1">
                0 = Unlimited uses
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Applicable Products
        </label>
        <select
          multiple
          name="applicableProducts"
          value={formData.applicableProducts}
          onChange={handleProductSelection}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenComponent h-32"
        >
          {productsData?.getProducts?.map((product: any) => (
            <option key={product.id} value={product.id}>
              {product.name} ({product.code})
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Hold Ctrl/Cmd to select multiple products. Leave empty to apply to all products.
        </p>
      </div>
      
      {/* Form Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={() => {
            if (initialData) {
              // Reset to initial data
              setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                discountValue: initialData.discountValue || 0,
                discountType: initialData.discountType || 'PERCENTAGE',
                code: initialData.code || '',
                startDate: new Date(initialData.startDate).toISOString().split('T')[0],
                endDate: new Date(initialData.endDate).toISOString().split('T')[0],
                minimumPurchase: initialData.minimumPurchase || 0,
                maximumUses: initialData.maximumUses || 0,
                applicableProducts: initialData.applicableProducts || [],
              });
            } else {
              // Reset to empty form
              const today = new Date();
              const nextMonth = new Date();
              nextMonth.setMonth(today.getMonth() + 1);
              
              setFormData({
                title: '',
                description: '',
                discountValue: 0,
                discountType: 'PERCENTAGE',
                code: '',
                startDate: today.toISOString().split('T')[0],
                endDate: nextMonth.toISOString().split('T')[0],
                minimumPurchase: 0,
                maximumUses: 0,
                applicableProducts: [],
              });
            }
          }}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-greenComponent text-white rounded-md hover:bg-newgreen disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? 'Saving...' : initialData ? 'Update Promotion' : 'Create Promotion'}
        </button>
      </div>
    </form>
  );
};

export default PromotionForm;