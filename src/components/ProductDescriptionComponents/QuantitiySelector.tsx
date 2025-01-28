"use client";

import React, { useState } from "react";

const QuantitySelector: React.FC = () => {
  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="flex items-center space-x-4 mt-4">
      <button
        onClick={handleDecrease}
        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg bg-gray-100 hover:bg-gray-200"
      >
        -
      </button>
      <span className="text-lg font-semibold">{quantity}</span>
      <button
        onClick={handleIncrease}
        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg bg-gray-100 hover:bg-gray-200"
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
