// components/common/PromoCodeInput.tsx
import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { VALIDATE_PROMO_CODE } from '@/constants/queries/promotionQueries';
import { toast } from 'react-toastify';

interface PromoCodeInputProps {
  onApply: (promotion: any) => void;
  onClear: () => void;
  appliedPromo: any | null;
}

const PromoCodeInput: React.FC<PromoCodeInputProps> = ({ onApply, onClear, appliedPromo }) => {
  const [code, setCode] = useState('');
  
  const [validatePromoCode, { loading }] = useLazyQuery(VALIDATE_PROMO_CODE, {
    onCompleted: (data) => {
      if (data.validatePromoCode) {
        onApply(data.validatePromoCode);
        toast.success('Promotion code applied!');
        setCode('');
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Invalid promotion code');
    }
  });
  
  const handleApply = () => {
    if (!code.trim()) {
      toast.error('Please enter a promotion code');
      return;
    }
    
    validatePromoCode({ variables: { code: code.trim() } });
  };
  
  return (
    <div className="mt-4 border-t pt-4">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Promotion Code</h3>
      
      {appliedPromo ? (
        <div className="flex items-center justify-between bg-green-50 p-3 rounded-md mb-3">
          <div>
            <span className="font-medium text-green-700">{appliedPromo.code}</span>
            <p className="text-sm text-green-600">
              {appliedPromo.title}: {appliedPromo.discountType === 'PERCENTAGE' 
                ? `${appliedPromo.discountValue}% off` 
                : `₹${appliedPromo.discountValue} off`}
            </p>
          </div>
          <button 
            onClick={onClear}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="flex mb-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter promo code"
            className="flex-1 border rounded-l px-3 py-2 focus:outline-none focus:ring-1 focus:ring-greenComponent"
          />
          <button
            onClick={handleApply}
            disabled={loading}
            className="bg-greenComponent text-white px-4 py-2 rounded-r hover:bg-newgreen disabled:opacity-50"
          >
            {loading ? 'Applying...' : 'Apply'}
          </button>
        </div>
      )}
      
      <p className="text-xs text-gray-500">
        Enter a valid promotion code to receive discounts on your order.
      </p>
    </div>
  );
};

export default PromoCodeInput;