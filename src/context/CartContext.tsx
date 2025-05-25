"use client";
import React, { createContext, useState, ReactNode, useContext, useEffect } from "react";

// CartItem & Discount types
export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  image?: string;
}

interface ShippingAddress {
  zip: string;
  city: string;
}

export interface DiscountCalculation {
  totalDiscount: number;
  itemDiscounts: Array<{
    productId: string;
    originalPrice: number;
    discountAmount: number;
    finalPrice: number;
    quantity: number;
  }>;
  promotionApplied: {
    id: string;
    code: string;
    title: string;
    discountType: "PERCENTAGE" | "FIXED";
    scope: "ORDER" | "PRODUCT";
  };
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
  clearCart: () => void;

  // Promotion state
  appliedPromotion: DiscountCalculation | null;
  setAppliedPromotion: (promo: DiscountCalculation | null) => void;
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
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({ zip: '', city: '' });
  const [appliedPromotion, setAppliedPromotion] = useState<DiscountCalculation | null>(null);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
        const count = parsedCart.reduce((total: number, item: CartItem) => total + item.quantity, 0);
        setCartCount(count);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
    try {
      const savedAddress = localStorage.getItem('shippingAddress');
      if (savedAddress) setShippingAddress(JSON.parse(savedAddress));
    } catch (error) {
      console.error('Error loading shipping address from localStorage:', error);
    }
    try {
      const savedPromo = localStorage.getItem('appliedPromotion');
      if (savedPromo) setAppliedPromotion(JSON.parse(savedPromo));
    } catch (error) {
      console.error('Error loading promo from localStorage:', error);
    }
  }, []);

  useEffect(() => { localStorage.setItem('cart', JSON.stringify(cartItems)); }, [cartItems]);
  useEffect(() => { localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress)); }, [shippingAddress]);
  useEffect(() => {
    if (appliedPromotion) localStorage.setItem('appliedPromotion', JSON.stringify(appliedPromotion));
    else localStorage.removeItem('appliedPromotion');
  }, [appliedPromotion]);

  const toggleCart = () => setIsCartOpen(prev => !prev);

  const clearCart = () => {
    setCartItems([]);
    setAppliedPromotion(null);
    localStorage.removeItem('cart');
    localStorage.removeItem('appliedPromotion');
  };

  const addToCart = (product: CartItem, showSidebar: boolean = true) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      }
      return [...prev, product];
    });
    setCartCount(prev => prev + product.quantity);
    if (showSidebar) setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => {
      const updatedCart = prev
        .map(item => item.id === productId ? { ...item, quantity: item.quantity - 1 } : item)
        .filter(item => item.quantity > 0);
      return updatedCart;
    });
    setCartCount(prev => (prev > 0 ? prev - 1 : 0));
  };

  const updateShippingAddress = (address: ShippingAddress) => setShippingAddress(address);

  const triggerCartAnimation = () => {};

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
        updateShippingAddress,
        clearCart,
        appliedPromotion,
        setAppliedPromotion
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
