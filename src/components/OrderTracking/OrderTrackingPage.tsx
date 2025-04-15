
// src/components/OrderTracking/OrderTrackingPage.tsx
"use client";

import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { PackageCheck, Truck, MapPin, Search, AlertCircle, Package } from 'lucide-react';
import LoadingSpinner from '../AdminDashboardComponents/Common/LoadingSpinner'; // Adjust path
import { TRACK_SHIPMENT } from '@/constants/queries/shipRocketQueries'; // Adjust path

const OrderTrackingPage: React.FC = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [trackingResult, setTrackingResult] = useState<any>(null); // Store result here

  const [trackShipment, { loading }] = useLazyQuery(TRACK_SHIPMENT, {
    fetchPolicy: 'network-only', // Always fetch fresh data
    onCompleted: (data) => {
      if (data?.trackShipment?.tracking_data) {
        setTrackingResult(data.trackShipment.tracking_data);
        setError(null);
      } else {
         setError('No tracking information found for this number.');
         setTrackingResult(null);
      }
    },
    onError: (error) => {
      setError(`Error tracking shipment: ${error.message}`);
      setTrackingResult(null);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number or AWB code.');
      setTrackingResult(null);
      return;
    }
    setError(null);
    setTrackingResult(null); // Clear previous results
    trackShipment({ variables: { awbCode: trackingNumber.trim() } });
  };

  // Format date for display
  const formatDate = (dateStr: string | number | Date) => {
     if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleString('en-IN', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      });
    } catch {
      return String(dateStr);
    }
  };

  // Helper function to get appropriate icon for tracking status
  const getStatusIcon = (status: string) => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('delivered')) {
      return <PackageCheck className="h-5 w-5 text-green-500" />;
    } else if (lowerStatus.includes('transit') || lowerStatus.includes('shipped') || lowerStatus.includes('pickup')) {
      return <Truck className="h-5 w-5 text-blue-500" />;
    } else if (lowerStatus.includes('out for delivery')) {
        return <Truck className="h-5 w-5 text-yellow-500 animate-pulse"/>;
    } else if (lowerStatus.includes('info received') || lowerStatus.includes('manifested')) {
        return <Package className="h-5 w-5 text-gray-500"/>;
    } else {
      return <MapPin className="h-5 w-5 text-gray-500" />;
    }
  };

  const trackingActivities = trackingResult?.shipment_track_activities || [];
  const hasTrackingData = trackingActivities.length > 0;

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Track Your Order</h1>
          <p className="mt-2 text-gray-600">
            Enter your Tracking Number or AWB Code below.
          </p>
        </div>

        {/* Tracking Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <label htmlFor="tracking-number" className="sr-only">
                Tracking Number / AWB
              </label>
              <input
                type="text"
                id="tracking-number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter your tracking number or AWB code"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newgreensecond text-sm"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-6 py-3 bg-newgreensecond text-white rounded-md hover:bg-newgreen transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm font-medium"
              >
                {loading ? (
                   <LoadingSpinner />
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Track Shipment
                  </>
                )}
              </button>
            </div>
          </form>
          {error && (
            <div className="mt-3 text-red-600 text-sm flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" /> {error}
            </div>
          )}
        </div>

        {/* Tracking Results */}
        {loading ? (
           <div className="bg-white rounded-lg shadow-sm p-8 text-center">
             <LoadingSpinner />
             <p className="mt-4 text-gray-600 text-sm">Fetching shipment details...</p>
           </div>
        ) : hasTrackingData ? (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-6 text-gray-900">Shipment Progress for AWB: {trackingNumber}</h2>

            {/* Latest Status Summary */}
             <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                 <p className="text-sm font-medium text-blue-800">Current Status:</p>
                 <p className="text-lg font-semibold text-blue-900">{trackingActivities[0]?.status}</p>
                 <p className="text-xs text-blue-700">{formatDate(trackingActivities[0]?.date)}</p>
             </div>

            {/* Timeline */}
            <div className="relative pl-6 pb-2 border-l-2 border-gray-200">
              {trackingActivities.map((activity: any, index: number) => (
                <div key={index} className="relative mb-6">
                   <div className="absolute -left-[29px] top-0 h-6 w-6 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center z-10">
                    {getStatusIcon(activity.status)}
                  </div>
                  <div className="ml-4">
                     <div className="bg-gray-50 p-3 rounded-md border border-gray-100 shadow-sm">
                      <p className="font-medium text-sm text-gray-800">{activity.status}</p>
                      <p className="text-xs text-gray-600 mt-1">{activity.activity}</p>
                      {activity.location && <p className="text-xs text-gray-500 mt-1">Location: {activity.location}</p>}
                      <p className="text-xs text-gray-500 mt-1">{formatDate(activity.date)}</p>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : trackingResult ? ( // Handle case where tracking_data exists but activities are empty
           <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Tracking information received, but no activities recorded yet.</p>
              <p className="text-sm text-gray-500 mt-1">Please check back later.</p>
           </div>
        ) : null}

      </div>
    </div>
  );
};

export default OrderTrackingPage;