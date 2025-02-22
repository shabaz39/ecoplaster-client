// components/AdminDashboard/common/LoadingSpinner.tsx
import React from 'react';

const LoadingSpinner = () => (
  <div className="flex justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-2 border-greenComponent border-t-transparent"></div>
  </div>
);

export default LoadingSpinner;