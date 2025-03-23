"use client";

import React from 'react';
import { CreditCard, Smartphone, Landmark, Wallet } from 'lucide-react';

interface PaymentMethodsProps {
  selectedMethod: string;
  onSelectMethod: (method: string) => void;
}

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({ 
  selectedMethod, 
  onSelectMethod 
}) => {
  const methods = [
    {
      id: 'card',
      name: 'Card',
      description: 'Credit & Debit Cards',
      icon: <CreditCard size={20} />,
    },
    {
      id: 'upi',
      name: 'UPI',
      description: 'Google Pay, PhonePe, etc.',
      icon: <Smartphone size={20} />,
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      description: 'All major banks',
      icon: <Landmark size={20} />,
    },
    {
      id: 'wallet',
      name: 'Wallet',
      description: 'Paytm, Amazon Pay, etc.',
      icon: <Wallet size={20} />,
    },
  ];

  return (
    <div className="space-y-4">
      {methods.map((method) => (
        <div 
          key={method.id}
          onClick={() => onSelectMethod(method.id)}
          className={`p-4 rounded-lg border-2 flex items-center gap-4 cursor-pointer transition-all
            ${selectedMethod === method.id
              ? 'border-newgreensecond bg-green-50'
              : 'border-gray-200 hover:border-gray-300'
            }`}
        >
          <div className={`text-2xl ${selectedMethod === method.id ? 'text-newgreensecond' : 'text-gray-400'}`}>
            {method.icon}
          </div>
          
          <div className="flex-1">
            <h3 className={`font-medium ${selectedMethod === method.id ? 'text-newgreensecond' : 'text-gray-700'}`}>
              {method.name}
            </h3>
            <p className="text-sm text-gray-500">{method.description}</p>
          </div>
          
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
            ${selectedMethod === method.id 
              ? 'border-newgreensecond' 
              : 'border-gray-300'
            }`}
          >
            {selectedMethod === method.id && (
              <div className="w-3 h-3 rounded-full bg-newgreensecond"></div>
            )}
          </div>
        </div>
      ))}
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Your payment information is secure. We use industry-standard encryption to protect your data.
        </p>
        <div className="flex items-center gap-2 mt-2">
          <img src="/images/razorpay-logo.png" alt="Razorpay" className="h-6" />
          <span className="text-xs text-gray-500">Powered by Razorpay</span>
        </div>
      </div>
    </div>
  );
};