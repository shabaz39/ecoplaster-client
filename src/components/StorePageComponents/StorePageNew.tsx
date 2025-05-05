// ecoplaster-client/src/app/stores/page.tsx
"use client";

import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ACTIVE_STORES } from '@/constants/queries/storeQueries';
import { MapPin, Phone, Star, Clock, ExternalLink } from 'lucide-react';
import LoadingSpinner from '../AdminDashboardComponents/Common/LoadingSpinner';
 
const StoresPageNew: React.FC = () => {
  const { data, loading, error } = useQuery(GET_ACTIVE_STORES);
  const stores = data?.getActiveStores || [];

  // Generate a background color based on store name
  const getBackgroundColor = (name: string) => {
    const colors = [
      "bg-blue-500", "bg-green-500", "bg-yellow-500", 
      "bg-purple-500", "bg-pink-500", "bg-indigo-500", 
      "bg-red-500", "bg-orange-500", "bg-teal-500"
    ];
    
    // Use the first character of store name to consistently select a color
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Get initial letters from store name
  const getInitials = (name: string) => {
    return name.charAt(0);
  };

  return (
    <div className="bg-cream min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-productNameColor mb-2 text-center">
          Our Store Network
        </h1>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
          Visit any of our locations across India for expert advice and 
          high-quality EcoPlaster products. Our staff are ready to help 
          with all your sustainable wall texture needs.
        </p>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center py-10">
            <LoadingSpinner />
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="p-6 bg-red-50 text-red-700 rounded-lg text-center max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold mb-2">Error Loading Stores</h3>
            <p>We apologize, but we couldn't load our store information at this time. Please try again later.</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && stores.length === 0 && (
          <div className="p-8 bg-white rounded-lg shadow-md text-center max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold mb-2">No Stores Found</h3>
            <p>We're currently updating our store database. Please check back soon for our store locations.</p>
          </div>
        )}

        {/* Store grid */}
        {!loading && !error && stores.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {stores.map((store:any) => (
              <div key={store.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Store letter banner */}
                <div className={`w-full h-48 ${getBackgroundColor(store.city)} flex items-center justify-center`}>
                  <span className="text-white text-8xl font-bold">
                    {getInitials(store.city)}
                  </span>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-productNameColor mb-2">
                    {store.city}, {store.state}
                  </h2>
                  
                  <div className="flex items-center mb-4">
                    {[...Array(Math.floor(store.rating))].map((_, i) => (
                      <Star key={i} className="text-newgreen" size={16} fill="#FFD700" />
                    ))}
                    <span className="ml-2 text-gray-600 text-sm">
                      ({store.reviews} Reviews)
                    </span>
                  </div>
                  
                  <div className="flex items-start space-x-2 mb-3">
                    <MapPin size={18} className="flex-shrink-0 mt-1 text-newgreen" />
                    <p className="text-gray-700">{store.address}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <Clock size={18} className="text-newgreen" />
                    <p className="text-gray-700 font-medium">{store.timing}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-5">
                    <Phone size={18} className="text-newgreen" />
                    <a href={`tel:${store.phone}`} className="text-newgreen font-semibold hover:underline">
                      {store.phone}
                    </a>
                  </div>
                  
                  {store.directions && store.directions !== '#' && (
                    <a 
                      href={store.directions} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full py-2 bg-greenComponent text-white rounded-md hover:bg-newgreen transition duration-200"
                    >
                      <ExternalLink size={16} className="mr-2" />
                      Get Directions
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoresPageNew;