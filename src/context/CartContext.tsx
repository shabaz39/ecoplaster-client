"use client";

import React, { createContext, useState, ReactNode, useContext, useEffect } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  image?: string; // Add this line to include the image property as optional

}

interface ShippingAddress {
  zip: string;
  city: string;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  isCartOpen: boolean;
  toggleCart: () => void;
  addToCart: (product: CartItem, showSidebar?: boolean) => void;
  removeFromCart: (productId: string) => void;
  triggerCartAnimation: () => void;
  shippingAddress: ShippingAddress;
  updateShippingAddress: (address: ShippingAddress) => void;
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
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    zip: '',
    city: ''
  });

  // Load cart and shipping address from localStorage on component mount
  useEffect(() => {
    // Load cart items
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
        
        // Update cart count based on loaded items
        const count = parsedCart.reduce((total: number, item: CartItem) => total + item.quantity, 0);
        setCartCount(count);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
    
    // Load shipping address
    try {
      const savedAddress = localStorage.getItem('shippingAddress');
      if (savedAddress) {
        setShippingAddress(JSON.parse(savedAddress));
      }
    } catch (error) {
      console.error('Error loading shipping address from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Save shipping address to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
  }, [shippingAddress]);

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  const addToCart = (product: CartItem, showSidebar: boolean = true) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id 
        ? { ...item, quantity: item.quantity + product.quantity } // ADD quantities instead of replacing
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

  const updateShippingAddress = (address: ShippingAddress) => {
    setShippingAddress(address);
  };

  const triggerCartAnimation = () => {
    // Animation logic (if needed)
  };

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        cartCount, 
        isCartOpen, 
        toggleCart, 
        addToCart, 
        removeFromCart, 
        triggerCartAnimation,
        shippingAddress,
        updateShippingAddress
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;