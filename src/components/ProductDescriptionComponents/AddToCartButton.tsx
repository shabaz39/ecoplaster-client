"use client";

import React from "react";

const AddToCartButton: React.FC<{ productId: string }> = ({ productId }) => {
  return (
    <button className="w-full bg-newgreensecond text-white py-3 mt-6 rounded-lg">
      Add to Cart
    </button>
  );
};

export default AddToCartButton;
