"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";

interface ProductDetailsProps {
  product: {
    name: string;
    description: string;
    rating: number;
    reviews: number;
  };
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleRatingClick = (index: number) => {
    setUserRating(index + 1);
  };

  return (
    <div className="space-y-4">
      {/* Product Title */}
      <h1 className="text-xl md:text-3xl text-black font-bold leading-tight">
        {product.name}
      </h1>

      {/* Static Rating */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex text-yellow-500">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={16} 
              className={i < product.rating ? "fill-yellow-400" : "fill-gray-200"} 
            />
          ))}
        </span>
        <span className="text-sm text-black">({product.reviews} Reviews)</span>
      </div>

      {/* Description */}
      <p className="text-sm md:text-base text-black">{product.description}</p>

      {/* User Rating Section */}
      <div className="pt-4 border-t">
        <h3 className="text-base md:text-lg font-semibold text-black mb-2">
          Rate this product
        </h3>
        <div className="flex items-center gap-2">
          {[...Array(5)].map((_, i) => (
            <button
              key={i}
              onClick={() => handleRatingClick(i)}
              onMouseEnter={() => setHoverRating(i + 1)}
              onMouseLeave={() => setHoverRating(null)}
              className="focus:outline-none transition-transform transform hover:scale-110"
            >
              <Star
                size={24}
                className={`${
                  (hoverRating || userRating || 0) > i 
                    ? "fill-yellow-400 text-yellow-400" 
                    : "text-gray-300"
                } transition-colors duration-300`}
              />
            </button>
          ))}
          {userRating && (
            <span className="text-sm text-black ml-2">
              You rated: {userRating} stars
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;