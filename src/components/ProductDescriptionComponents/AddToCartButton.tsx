"use client";

import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useRouter } from "next/navigation";
import { ShoppingCart, ArrowRight } from "lucide-react";

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  productPrice: number;
  productOriginalPrice: number;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ 
  productId, 
  productName, 
  productPrice,
  productOriginalPrice
}) => {
  const { addToCart } = useCart();
  const router = useRouter();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    if (!isAdded) {
      addToCart({
        id: productId,
        name: productName,
        price: productPrice,
        originalPrice: productOriginalPrice,
        quantity: 1
      });
      setIsAdded(true);
      // Trigger cart sidebar here if you have a toggle function in cart context
      // toggleCart();
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