"use client";

import React from 'react';
import { AlertCircle, RefreshCw, CheckCircle } from 'lucide-react';

interface PaymentStatusBannerProps {
  status: 'idle' | 'processing' | 'success' | 'failed';
  errorMessage: string | null;
  onRetry?: () => void;
}

export const PaymentStatusBanner: React.FC<PaymentStatusBannerProps> = ({ 
  status, 
  errorMessage,
  onRetry
}) => {
  if (status === 'idle') {
    return null;
  }

  const bannerConfig = {
    processing: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      icon: <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-600"></div>,
      title: 'Processing Payment',
      message: 'Please wait while we process your payment...',
    },
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      title: 'Payment Successful',
      message: 'Your payment has been processed successfully!',
    },
    failed: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      icon: <AlertCircle className="h-5 w-5 text-red-600" />,
      title: 'Payment Failed',
      message: errorMessage || 'Your payment could not be processed. Please try again.',
    },
  };

  const config = bannerConfig[status];

  return (
    <div className={`${config.bgColor} border-t ${config.borderColor} p-4`}>
      <div className="max-w-6xl mx-auto px-4 flex items-start md:items-center gap-3 flex-col md:flex-row">
        <div className="flex-shrink-0">
          {config.icon}
        </div>
        <div className="flex-1">
          <h3 className={`text-sm font-medium ${config.textColor}`}>{config.title}</h3>
          <p className="text-sm mt-1">{config.message}</p>
        </div>
        {status === 'failed' && onRetry && (
          <button 
            onClick={onRetry}
            className="px-4 py-2 text-sm bg-white border border-red-300 rounded-md text-red-700 hover:bg-red-50 flex items-center"
          >
            <RefreshCw size={14} className="mr-1" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};