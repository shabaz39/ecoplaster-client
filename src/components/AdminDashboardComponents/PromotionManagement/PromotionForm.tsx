// Enhanced PromotionForm component with proper date handling
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
    scope: 'ORDER' | 'PRODUCT';
    code: string;
    startDate: string;
    endDate: string;
    minimumPurchase: number;
    maximumUses: number;
    maxUsesPerUser: number;
    applicableProducts: string[];
    usesCount?: number; // Optional field
  };
}

const PromotionForm: React.FC<PromotionFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discountValue: 0,
    discountType: 'PERCENTAGE',
    scope: 'ORDER',
    code: '',
    startDate: '',
    endDate: '',
    minimumPurchase: 0,
    maximumUses: 0,
    maxUsesPerUser: 0,
    applicableProducts: [] as string[],
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { data: productsData } = useQuery(GET_PRODUCTS);

  // Enhanced date parsing function
  const parseDate = (dateValue: string | number | Date | undefined): string => {
    if (!dateValue) return '';
    
    try {
      let date: Date;
      
      if (dateValue instanceof Date) {
        date = dateValue;
      } else if (typeof dateValue === 'number') {
        date = new Date(dateValue);
      } else if (typeof dateValue === 'string') {
        // Check if it's a numeric string
        if (/^\d+$/.test(dateValue)) {
          date = new Date(parseInt(dateValue, 10));
        } else {
          date = new Date(dateValue);
        }
      } else {
        return '';
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.error('Invalid date:', dateValue);
        return '';
      }
      
      // Return YYYY-MM-DD format for input field
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error parsing date:', error, dateValue);
      return '';
    }
  };

  useEffect(() => {
    if (initialData) {
      // Helper function to safely convert to number with fallback
      const safeNumber = (value: any, fallback: number = 0): number => {
        const num = Number(value);
        return isNaN(num) ? fallback : num;
      };

      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        discountValue: safeNumber(initialData.discountValue, 0),
        discountType: initialData.discountType || 'PERCENTAGE',
        scope: initialData.scope || 'ORDER',
        code: initialData.code || '',
        startDate: parseDate(initialData.startDate),
        endDate: parseDate(initialData.endDate),
        minimumPurchase: safeNumber(initialData.minimumPurchase, 0),
        maximumUses: safeNumber(initialData.maximumUses, 0),
        maxUsesPerUser: safeNumber(initialData.maxUsesPerUser, 0),
        applicableProducts: initialData.applicableProducts || [],
      });
    } else {
      // Set default dates for new promotions
      const today = new Date();
      const nextMonth = new Date();
      nextMonth.setMonth(today.getMonth() + 1);
      
      setFormData(prev => ({
        ...prev,
        startDate: today.toISOString().split('T')[0],
        endDate: nextMonth.toISOString().split('T')[0],
      }));
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let processedValue: any = value;
    
    if (type === 'number') {
      // Handle numeric inputs safely
      const numValue = parseFloat(value);
      processedValue = isNaN(numValue) ? 0 : numValue;
    }
    
    setFormData({
      ...formData,
      [name]: processedValue,
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
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      setError('Please enter valid dates');
      return;
    }
    
    if (startDate > endDate) {
      setError('End date must be after start date');
      return;
    }

    // Validate scope-specific requirements
    if (formData.scope === 'PRODUCT' && formData.applicableProducts.length === 0) {
      setError('Please select at least one product for product-level promotions');
      return;
    }
    
    setLoading(true);
    
    try {
      // Safely convert all numeric fields
      const submissionData = {
        ...formData,
        discountValue: Number(formData.discountValue) || 0,
        minimumPurchase: Number(formData.minimumPurchase) || 0,
        maximumUses: parseInt(String(formData.maximumUses)) || 0,
        maxUsesPerUser: parseInt(String(formData.maxUsesPerUser)) || 0,
        // Convert dates to ISO strings for submission
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      };
      
      console.log('Submitting promotion data:', submissionData); // Debug log
      
      await onSubmit(submissionData);
    } catch (error: any) {
      console.error('Submission error:', error);
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

          {/* NEW: Promotion Scope */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Promotion Scope*
            </label>
            <select
              name="scope"
              value={formData.scope}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenComponent"
              required
            >
              <option value="ORDER">Apply to Entire Order</option>
              <option value="PRODUCT">Apply to Individual Products</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {formData.scope === 'ORDER' 
                ? 'Discount will be applied to the total order amount'
                : 'Discount will be applied to each selected product individually'
              }
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
                value={formData.discountValue || ''}
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
                  : `Enter amount in ₹ ${formData.scope === 'PRODUCT' ? '(per product)' : '(total order)'}`}
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
                value={formData.minimumPurchase || ''}
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
                value={formData.maximumUses || ''}
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

          {/* NEW: Max Uses Per User */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Uses Per User
            </label>
            <input
              type="number"
              name="maxUsesPerUser"
              value={formData.maxUsesPerUser || ''}
              onChange={handleChange}
              min="0"
              step="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenComponent"
            />
            <p className="text-xs text-gray-500 mt-1">
              0 = Unlimited uses per user. Helps prevent abuse of promotion codes.
            </p>
          </div>
        </div>
      </div>
      
      {/* Product Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Applicable Products
          {formData.scope === 'PRODUCT' && <span className="text-red-500">*</span>}
        </label>
        <select
          multiple
          name="applicableProducts"
          value={formData.applicableProducts}
          onChange={handleProductSelection}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenComponent h-32"
          required={formData.scope === 'PRODUCT'}
        >
          {productsData?.getProducts?.map((product: any) => (
            <option key={product.id} value={product.id}>
              {product.name} ({product.code})
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          {formData.scope === 'ORDER' 
            ? 'Hold Ctrl/Cmd to select multiple products. Leave empty to apply to all products.'
            : 'Hold Ctrl/Cmd to select multiple products. At least one product must be selected for product-level promotions.'
          }
        </p>
      </div>

      {/* Usage Information Display */}
      {initialData && initialData.usesCount !== undefined && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Usage Statistics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-blue-600">Total Uses:</span>
              <span className="ml-2 font-medium">
                {initialData.maximumUses > 0 
                  ? `${initialData.usesCount || 0}/${initialData.maximumUses}` 
                  : initialData.usesCount || 0}
              </span>
            </div>
            <div>
              <span className="text-blue-600">Per User Limit:</span>
              <span className="ml-2 font-medium">
                {initialData.maxUsesPerUser || 'Unlimited'}
              </span>
            </div>
          </div>
        </div>
      )}
      
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
                discountValue: Number(initialData.discountValue) || 0,
                discountType: initialData.discountType || 'PERCENTAGE',
                scope: initialData.scope || 'ORDER',
                code: initialData.code || '',
                startDate: parseDate(initialData.startDate),
                endDate: parseDate(initialData.endDate),
                minimumPurchase: Number(initialData.minimumPurchase) || 0,
                maximumUses: Number(initialData.maximumUses) || 0,
                maxUsesPerUser: Number(initialData.maxUsesPerUser) || 0,
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
                scope: 'ORDER',
                code: '',
                startDate: today.toISOString().split('T')[0],
                endDate: nextMonth.toISOString().split('T')[0],
                minimumPurchase: 0,
                maximumUses: 0,
                maxUsesPerUser: 0,
                applicableProducts: [],
              });
            }
            setError('');
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

// IMPORTANT: Export as default
export default PromotionForm;