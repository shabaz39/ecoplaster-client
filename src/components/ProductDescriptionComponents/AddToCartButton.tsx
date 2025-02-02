"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useRouter } from "next/navigation";
import { ShoppingCart, ArrowRight } from "lucide-react";

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  productPrice: number;
  productOriginalPrice: number;
  quantity: number;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  productId,
  productName,
  productPrice,
  productOriginalPrice,
  quantity
}) => {
  const { cartItems, addToCart } = useCart();
  const router = useRouter();
  
  // Check if product is already in cart
  const existingItem = cartItems.find(item => item.id === productId);
  const [isAdded, setIsAdded] = useState(!!existingItem);

  // Update isAdded state when cart items change
  useEffect(() => {
    setIsAdded(!!cartItems.find(item => item.id === productId));
  }, [cartItems, productId]);

  const handleAddToCart = () => {
    if (!isAdded) {
      addToCart({
        id: productId,
        name: productName,
        price: productPrice,
        originalPrice: productOriginalPrice,
        quantity: quantity
      }, true); // Show sidebar on initial add
      
      setIsAdded(true);
    } else {
      router.push("/checkout");
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      className={`w-full py-3 mt-6 rounded-lg flex items-center justify-center gap-2
                transition-all duration-300 ${
                  isAdded
                    ? "bg-newgreen hover:bg-newgreensecond"
                    : "bg-newgreensecond hover:bg-newgreen"
                }`}
    >
      <span className="text-white font-medium">
        {isAdded ? (
          <div className="flex items-center gap-2">
            Proceed to Checkout <ArrowRight size={20} />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            Add to Cart <ShoppingCart size={20} />
          </div>
        )}
      </span>
    </button>
  );
};

export default AddToCartButton;