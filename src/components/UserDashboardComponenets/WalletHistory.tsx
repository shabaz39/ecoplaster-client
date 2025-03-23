// src/components/UserDashboard/WalletHistory.tsx
import React from 'react';
import { WalletTransaction, formatDate } from './types';

interface WalletHistoryProps {
  transactions: WalletTransaction[];
}

const WalletHistory: React.FC<WalletHistoryProps> = ({ transactions }) => {
  return (
    <div>
      <h3 className="font-medium text-gray-800 mb-4">Transaction History</h3>
      {transactions?.length > 0 ? (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex justify-between items-center p-3 border-b">
              <div>
                <p className="font-medium">{transaction.type}</p>
                <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                {transaction.description && (
                  <p className="text-xs text-gray-500">{transaction.description}</p>
                )}
              </div>
              <div className={transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-4">No transactions yet</p>
      )}
    </div>
  );
};

export default WalletHistory;