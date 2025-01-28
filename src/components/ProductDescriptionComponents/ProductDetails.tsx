"use client";

import React from "react";
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
  return (
    <div>
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="text-gray-700">{product.description}</p>

      {/* Rating */}
      <div className="flex items-center space-x-2 mt-2">
        <span className="flex text-yellow-500">
          {[...Array(5)].map((_, i) => (
            <Star key={i} fill={i < product.rating ? "yellow" : "gray"} />
          ))}
        </span>
        <span className="text-gray-600">{product.reviews} Reviews</span>
      </div>
    </div>
  );
};

export default ProductDetails;
