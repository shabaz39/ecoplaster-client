"use client";

import React from "react";
import { useCart } from "../../context/CartContext";
import { X, ChevronLeft, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

const CartSidebar = () => {
  const { cartItems, isCartOpen, toggleCart } = useCart();
  const router = useRouter();
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div
      className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-lg z-50 transform ${
        isCartOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <button onClick={toggleCart} className="text-black hover:text-newgreensecond">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-xl font-semibold text-black">Review Cart</h2>
          <div className="w-6"></div>
        </div>
        
        {/* Delivery Location */}
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
          <MapPin size={16} />
          <span>Delivering to</span>
          <span className="font-medium">516006, Kadappah</span>
          <button className="ml-auto text-newgreensecond font-medium">CHANGE</button>
        </div>
      </div>

      {/* Cart Items */}
      <div className="overflow-y-auto h-[calc(100vh-280px)] p-4">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg mb-4 p-4 border border-gray-100">
              <div className="flex justify-between mb-2">
                <h3 className="font-medium text-black">{item.name}</h3>
                <button className="text-gray-400 hover:text-red-500">
                  <X size={16} />
                </button>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border rounded-md">
                  <span className="px-3 py-1 border-x text-black">Quantity:</span>

                     <span className="px-3 py-1 border-x text-black">{item.quantity}</span>
                   </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-black">₹{(item.price * item.quantity).toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">Your cart is empty</div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        {/* Price Summary */}
        <div className="mb-4 text-black">
          <div className="flex justify-between font-semibold text-lg text-black">
            <span>Total Amount</span>
            <span>₹{totalPrice.toLocaleString()}</span>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={() => {
            toggleCart();
            router.push("/checkout");
          }}
          className="w-full py-4 bg-newgreensecond text-white rounded-md font-medium hover:bg-newgreen transition-colors"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartSidebar;