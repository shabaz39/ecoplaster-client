// src/components/UserDashboard/AddMoneyModal.tsx
import React from 'react';

interface AddMoneyModalProps {
  moneyAmount: number;
  setMoneyAmount: React.Dispatch<React.SetStateAction<number>>;
  onSubmit: () => void;
  onClose: () => void;
  isLoading: boolean;
}

const AddMoneyModal: React.FC<AddMoneyModalProps> = ({
  moneyAmount,
  setMoneyAmount,
  onSubmit,
  onClose,
  isLoading
}) => {
  const presetAmounts = [100, 500, 1000, 2000];
  
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
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={isLoading || moneyAmount <= 0}
            className="px-4 py-2 bg-newgreensecond text-white rounded-md hover:bg-newgreen disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Add Money'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMoneyModal;