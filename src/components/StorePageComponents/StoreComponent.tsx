// ecoplaster-client/src/components/StoresSection.tsx
"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { GET_ACTIVE_STORES } from '@/constants/queries/storeQueries';

interface Store {
  id: string;
  city: string;
  state: string;
  icon: string;
}

const StoresSection: React.FC = () => {
  const visibleCards = 8; // Number of cards visible at a time
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Fetch stores from server
  const { data, loading, error } = useQuery(GET_ACTIVE_STORES);
  const stores = data?.getActiveStores || [];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % stores.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + stores.length) % stores.length
    );
  };

  const getVisibleStores = () => {
    const result = [];
    for (let i = 0; i < visibleCards; i++) {
      // If we don't have enough stores, show fewer cards
      if (i >= stores.length) break;
      const index = (currentIndex + i) % stores.length;
      result.push(stores[index]);
    }
    return result;
  };

  const visibleStores = stores.length > 0 ? getVisibleStores() : [];

  const navigateTo = (path: string) => {
    setIsLoading(true); // Start loading
    setTimeout(() => {
      router.push(path);
    }, 500);
  };

  // If loading, show skeleton UI
  if (loading) {
    return (
      <section className="bg-white py-8 px-4 sm:px-8 lg:px-64">
        <div className="max-w-8xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="bg-gray-200 h-8 w-48 rounded-md animate-pulse"></div>
            <div className="bg-gray-200 h-8 w-32 rounded-md animate-pulse"></div>
          </div>
          <div className="flex gap-4 overflow-hidden">
            {[...Array(visibleCards)].map((_, index) => (
              <div key={index} className="w-40 bg-gray-200 rounded-md shadow-md p-4 h-32 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-8 px-4 sm:px-8 lg:px-64">
      <div className="max-w-8xl mx-auto ">
        {/* Section Title */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="relative pb-2 text-2xl font-bold text-gray-800 text-left">
            Ecoplaster Stores        
            <div className="mt-1">
              <span className="absolute left-0 bottom-0 h-[3px] w-14 bg-newgreen rounded-md"></span>
            </div>
          </h2>

          <button 
            className="text-sm font-medium text-newgreen hover:underline"
            onClick={() => navigateTo("/stores")}
          >
            {stores.length}+ Stores &rarr;
          </button>
        </div>

        {/* Error state */}
        {error && (
          <div className="p-4 text-red-600 bg-red-100 rounded-md">
            Error loading stores. Please try again later.
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && stores.length === 0 && (
          <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-md">
            No stores are currently available.
          </div>
        )}

        {/* Scrollable Store Cards */}
        {!loading && !error && stores.length > 0 && (
          <div className="relative flex items-center">
            {/* Left Navigation */}
            <button
              onClick={handlePrev}
              className="bg-white rounded-full shadow-md p-2 z-10 hover:bg-gray-200 disabled:opacity-50"
              disabled={stores.length <= visibleCards}
            >
              <ChevronLeft className="w-5 h-5 text-gray-800" />
            </button>

            {/* Scrollable container */}
            <div className="overflow-hidden flex-1">
              <div className="flex transition-transform duration-300 ease-in-out">
                {visibleStores.map((store, index) => (
                  <div
                    key={store.id}
                    className="flex-shrink-0 w-40 bg-gray-100 rounded-md shadow-md p-4 mx-2 text-center"
                  >
                    <img
                      src={store.icon}
                      alt={store.city}
                      className="w-12 h-12 mx-auto mb-3"
                    />
                    <h3 className="text-sm font-bold text-gray-800">
                      {store.city}
                    </h3>
                    <p className="text-xs text-gray-600">{store.state}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Navigation */}
            <button
              onClick={handleNext}
              className="bg-white rounded-full shadow-md p-2 z-10 hover:bg-gray-200 disabled:opacity-50"
              disabled={stores.length <= visibleCards}
            >
              <ChevronRight className="w-5 h-5 text-gray-800" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default StoresSection;