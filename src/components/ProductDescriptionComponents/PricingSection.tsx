"use client";

import React from "react";

interface PricingSectionProps {
  product: {
    price: {
      mrp: number;
      offerPrice: number;
    };
  };
}

const PricingSection: React.FC<PricingSectionProps> = ({ product }) => {
  return (
    <div className="mt-4">
      <span className="text-2xl font-bold text-green-600">
        ₹{product.price.offerPrice}
      </span>
      <span className="ml-2 text-gray-500 line-through">
        ₹{product.price.mrp}
      </span>
      <span className="ml-2 text-red-500">
        {Math.round(
          ((product.price.mrp - product.price.offerPrice) / product.price.mrp) *
            100
        )}
        % OFF
      </span>
    </div>
  );
};

export default PricingSection;
