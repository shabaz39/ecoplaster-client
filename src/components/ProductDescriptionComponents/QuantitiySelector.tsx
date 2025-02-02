"use client";

import React from "react";
import { useCart } from "../../context/CartContext";

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  productId: string;
  productName: string;
  productPrice: number;
  productOriginalPrice: number;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onQuantityChange,
  productId,
  productName,
  productPrice,
  productOriginalPrice,
}) => {
  const { cartItems, addToCart, removeFromCart } = useCart();
  const existingItem = cartItems.find(item => item.id === productId);

  const handleIncrease = () => {
    const newQuantity = quantity + 1;
    onQuantityChange(newQuantity);
    
    if (existingItem) {
      addToCart({
        id: productId,
        name: productName,
        price: productPrice,
        originalPrice: productOriginalPrice,
        quantity: newQuantity
      }, false); // Don't show sidebar on quantity change
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      onQuantityChange(newQuantity);
      
      if (existingItem) {
        addToCart({
          id: productId,
          name: productName,
          price: productPrice,
          originalPrice: productOriginalPrice,
          quantity: newQuantity
        }, false); // Don't show sidebar on quantity change
      }
    }
  };

  return (
    <div className="flex items-center space-x-4 mt-4 text-black">
      <button
        onClick={handleDecrease}
        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg bg-gray-100 hover:bg-gray-200"
        disabled={quantity <= 1}
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