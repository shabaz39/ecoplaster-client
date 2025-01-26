"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const BulkOrdersSection: React.FC = () => {
  const router = useRouter();
  const [isloading, setLoading] = useState(false)

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <section className="bg-beige px-4 mx-4 mt-10 lg:mx-64 sm:px-8 lg:px-64 lg:py-8 py-2 rounded-md">
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4">
        {/* Text Content */}
        <div className="text-center lg:text-left flex-1 mt-4 md:mt-0">
          <h2 className="text-lg font-semibold text-newgreensecond">
            Hostels · Enterprise · Hotels · Office
          </h2>
          <h3 className="lg:text-2xl font-bold text-newgreensecond mt-2">
            EcoPlaster for Business
          </h3>
          <p className="mt-2 text-gray-700">Special Pricing & Custom Solutions</p>
          <button
            onClick={() => navigateTo("/bulkorders")}
            className="mt-4 px-6 py-2 bg-newgreensecond text-white rounded-lg hover:bg-newgreen transition"
          >
            Place Bulk Order
          </button>
        </div>

        {/* Image */}
        <div className="flex-1 flex justify-center">
          <img
            src="/bulkorder.svg"
            alt="Bulk Orders Illustration"
            className="w-64 lg:w-64 max-w-sm lg:max-w-md"
          />
        </div>
      </div>
    </section>
  );
};

export default BulkOrdersSection;
