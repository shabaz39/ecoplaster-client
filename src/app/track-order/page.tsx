// src/app/track-order/page.tsx (or your preferred path)
import React from 'react';
import OrderTrackingPage from '@/components/OrderTracking/OrderTrackingPage'; // Adjust path

const TrackOrderRoute = () => {
  return (
    <div className="container mx-auto py-12">
      <OrderTrackingPage />
    </div>
  );
};

export default TrackOrderRoute;
