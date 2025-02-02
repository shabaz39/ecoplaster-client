"use client";

import React, { createContext, useState, ReactNode, useContext } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice:number;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  isCartOpen: boolean;
  toggleCart: () => void;
  addToCart: (product: CartItem, showSidebar?: boolean) => void;  // Updated signature
  removeFromCart: (productId: string) => void; // ✅ Add this function
  triggerCartAnimation: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };


  const addToCart = (product: CartItem, showSidebar: boolean = true) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id 
            ? { ...item, quantity: product.quantity } // Replace quantity instead of incrementing
            : item
        );
      }
      return [...prev, product]; // Add new item with specified quantity
    });
  
    setCartCount((prev) => prev + product.quantity);
    if (showSidebar) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => {
      const updatedCart = prev
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0); // Remove items with 0 quantity

      return updatedCart;
    });

    setCartCount((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const triggerCartAnimation = () => {
    // Animation logic (if needed)
  };

  return (
    <CartContext.Provider value={{ cartItems, cartCount, isCartOpen, toggleCart, addToCart, removeFromCart, triggerCartAnimation }}>
      {children}
    </CartContext.Provider>
  );
};
