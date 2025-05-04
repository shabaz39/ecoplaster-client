"use client";

import React, { useState } from "react";
import { MapPin, Phone, Star, ExternalLink, Loader } from "lucide-react";
import { useQuery } from '@apollo/client';
import { GET_ACTIVE_STORES } from '@/constants/queries/storeQueries';

const StoreCards = () => {
  const { loading, error, data } = useQuery(GET_ACTIVE_STORES);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get stores from query result
  const stores = data?.getActiveStores || [];
  
  // Filter stores based on search term
  const filteredStores = stores.filter((store: any) => {
    if (!searchTerm.trim()) return true;
    
    const search = searchTerm.toLowerCase();
    return (
      store.city.toLowerCase().includes(search) ||
      store.address.toLowerCase().includes(search)
    );
  });

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

  // Get initial letter from store city
  const getInitials = (city: string) => {
    return city.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <section className="bg-cream py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-3xl font-bold text-productNameColor mb-6">
            Our Stores
          </h2>
          <div className="flex justify-center items-center py-20">
            <Loader className="h-12 w-12 animate-spin text-greenComponent" />
            <span className="ml-4 text-gray-600">Loading stores...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.error("Error loading stores:", error);
    return (
      <section className="bg-cream py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-3xl font-bold text-productNameColor mb-6">
            Our Stores
          </h2>
          <div className="text-center py-20">
            <p className="text-red-500">Sorry, we couldn't load our store locations at the moment. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  if (stores.length === 0) {
    return (
      <section className="bg-cream py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-3xl font-bold text-productNameColor mb-6">
            Our Stores
          </h2>
          <div className="text-center py-20">
            <p className="text-gray-600">No store locations are available at the moment. Please check back later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-cream py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-3xl font-bold text-productNameColor mb-6">
          Our Stores
        </h2>
        
        {/* Search bar */}
        <div className="mb-8 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search stores by city or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenComponent focus:border-transparent"
          />
        </div>
        
        {filteredStores.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600">No stores found matching your search criteria.</p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 text-greenComponent hover:underline"
            >
              Clear search and show all stores
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map((store: any) => (
              <div key={store.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Placeholder with letter instead of image */}
                <div className={`w-full h-60 ${getBackgroundColor(store.city)} flex items-center justify-center`}>
                  <span className="text-white text-8xl font-bold">
                    {getInitials(store.city)}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-productNameColor mb-2">
                    {store.city}
                  </h3>
                  <div className="flex items-center mb-3">
                    <div className="flex items-center text-newgreen">
                      <span className="font-medium mr-1">
                        {store.storeCount > 1 ? `${store.storeCount} Stores` : "1 Store"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-start mb-3">
                    <MapPin size={18} className="text-newgreen shrink-0 mt-1 mr-2" />
                    <p className="text-gray-700 text-sm">{store.address}</p>
                  </div>
                  
                  <div className="flex items-center mb-2">
                    <Phone size={18} className="text-newgreen mr-2" />
                    <a href={`tel:${store.phoneNumber}`} className="text-newgreen font-medium">
                      {store.phoneNumber}
                    </a>
                  </div>
                  
                  {store.email && (
                    <div className="flex items-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-newgreen mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <a href={`mailto:${store.email}`} className="text-newgreen font-medium">
                        {store.email}
                      </a>
                    </div>
                  )}
                  
                  {/* Map Directions Button (if coordinates are available) */}
                  {store.coordinates && (
                    <div className="mt-4">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${store.coordinates.latitude},${store.coordinates.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-greenComponent text-white rounded-md hover:bg-newgreen transition-colors"
                      >
                        <ExternalLink size={16} className="mr-2" />
                        Get Directions
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default StoreCards;