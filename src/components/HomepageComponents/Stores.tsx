"use client";

import React, { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useRouter } from 'next/navigation';

const stores = [
  { city: "Tirupati", stores: "1 STORE", icon: "https://res.cloudinary.com/djzmj5oqp/image/upload/v1748687758/pwfkapcqxbvvprdmp9il.png" },
  { city: "Bengaluru", stores: "1 STORE", icon: "https://res.cloudinary.com/djzmj5oqp/image/upload/v1748687758/zxzixnpobhfm09dkakx7.png" },
  { city: "Kakinada", stores: "1 STORE", icon: "https://res.cloudinary.com/djzmj5oqp/image/upload/v1748687758/po9yv6wgozr9sjob7rdd.png" },
  { city: "Calicut", stores: "1 STORE", icon: "https://res.cloudinary.com/djzmj5oqp/image/upload/v1748687758/xh1xgvmx9xvyb5expwqy.png" },
  { city: "Deoli", stores: "1 STORE", icon: "https://res.cloudinary.com/djzmj5oqp/image/upload/v1748687758/ita2ixwstereddkkay9o.png" },
  { city: "Bhubaneshwar", stores: "1 STORE", icon: "https://res.cloudinary.com/djzmj5oqp/image/upload/v1748687758/tivni0oamfpzfoyezcnp.png" },
  { city: "Ambala", stores: "1 STORE", icon: "https://res.cloudinary.com/djzmj5oqp/image/upload/v1748687758/xejwx66amkodqctfokla.png" },
  { city: "Hisar", stores: "1 STORE", icon: "https://res.cloudinary.com/djzmj5oqp/image/upload/v1748687758/mxeupbnannrcjeyzvevh.png" },
  { city: "Anantnag", stores: "1 STORE", icon: "https://res.cloudinary.com/djzmj5oqp/image/upload/v1748687758/psecf5nrnums5gwzdfqh.png" },
  { city: "Srinagar", stores: "1 STORE", icon: "https://res.cloudinary.com/djzmj5oqp/image/upload/v1748687758/psecf5nrnums5gwzdfqh.png" },
];

const StoresSection: React.FC = () => {
  const visibleCards = 8; // Number of cards visible at a time
  const [currentIndex, setCurrentIndex] = useState(0);

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
      const index = (currentIndex + i) % stores.length;
      result.push(stores[index]);
    }
    return result;
  };

  const visibleStores = getVisibleStores();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const navigateTo = (path: string) => {
    setIsLoading(true); // Start loading
    setTimeout(() => {
      router.push(path);
    }, 500);
  };

  return (
    <section className="bg-white py-8 px-4 sm:px-8 lg:px-64">
      <div className="max-w-8xl mx-auto ">
        {/* Section Title */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="relative pb-2 text-2xl font-bold text-gray-800 text-left">
            Ecoplaster Stores        
            <div className=" mt-1">
              <span className="absolute left-0 bottom-0 h-[3px] w-14 bg-newgreen rounded-md"></span>
            </div>
          </h2>

          <button className="text-sm font-medium text-newgreen hover:underline"
                  onClick={() => navigateTo("/stores")}
          >
            10+ Stores &rarr;
          </button>
        </div>

        {/* Scrollable Store Cards */}
        <div className="relative flex items-center">
          {/* Left Navigation */}
          <button
            onClick={handlePrev}
            className="bg-white rounded-full shadow-md p-2 z-10 hover:bg-gray-200 disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5 text-gray-800" />
          </button>

          {/* Scrollable container */}
          <div className="overflow-hidden flex-1">
            <div className="flex transition-transform duration-300 ease-in-out">
              {visibleStores.map((store, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-40 bg-gray-100 rounded-md shadow-md p-4 mx-2 text-center"
                >
                  <img
                    src={store.icon}
                    alt={store.city}
                    className="w-12 h-12 mx-auto mb-3 object-contain"
                  />
                  <h3 className="text-sm font-bold text-gray-800">
                    {store.city}
                  </h3>
                  <p className="text-xs text-gray-600">{store.stores}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Navigation */}
          <button
            onClick={handleNext}
            className="bg-white rounded-full shadow-md p-2 z-10 hover:bg-gray-200 disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5 text-gray-800" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default StoresSection;