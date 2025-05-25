"use client";

import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import { X, ChevronLeft, MapPin, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const CartSidebar = () => {
  const {
    cartItems,
    isCartOpen,
    toggleCart,
    addToCart,
    removeFromCart,
    shippingAddress,
    updateShippingAddress,
    appliedPromotion // <-- Get from context!
  } = useCart();

  const router = useRouter();

  // For address update UI
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [tempZip, setTempZip] = useState(shippingAddress?.zip || "");
  const [tempCity, setTempCity] = useState(shippingAddress?.city || "");

  // Handle saving the new address
  const handleSaveAddress = () => {
    updateShippingAddress({
      zip: tempZip,
      city: tempCity,
    });
    setShowAddressForm(false);
  };

  // Promotion-aware price helpers
  const getDiscountedPrice = (item:any) => {
    if (!appliedPromotion) return item.price;
    const discount = appliedPromotion.itemDiscounts.find(
      (d) => d.productId === item.id
    );
    return discount ? discount.finalPrice : item.price;
  };
  const getOriginalPrice = (item:any) =>
    item.originalPrice > 0 ? item.originalPrice : item.price;

  // Calculate discounted subtotal
  const subtotal = cartItems.reduce(
    (total, item) => total + getDiscountedPrice(item) * item.quantity,
    0
  );

  // Calculate pre-discount subtotal for display
  const originalSubtotal = cartItems.reduce(
    (total, item) => total + getOriginalPrice(item) * item.quantity,
    0
  );

  // Calculate total discount for cart
  const totalDiscount = originalSubtotal - subtotal;

  return (
    <div
      className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-lg z-50 transform ${
        isCartOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300`}
    >
      {/* Overlay */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleCart}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[600px] bg-white shadow-2xl z-50 transform ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-newgreensecond" />
              <h2 className="text-2xl font-semibold text-black">Your Cart</h2>
              <span className="ml-2 text-sm text-gray-500">
                ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
              </span>
            </div>
            <button
              onClick={toggleCart}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-500 hover:text-red-500" />
            </button>
          </div>

          {/* Delivery Location */}
          <div className="flex items-center gap-3 text-sm bg-gray-50 p-4 rounded-lg">
            <MapPin size={18} className="text-newgreensecond" />

            {showAddressForm ? (
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tempZip}
                    onChange={(e) => setTempZip(e.target.value)}
                    placeholder="ZIP/Postal Code"
                    className="flex-1 p-2 text-sm border rounded"
                  />
                  <input
                    type="text"
                    value={tempCity}
                    onChange={(e) => setTempCity(e.target.value)}
                    placeholder="City"
                    className="flex-1 p-2 text-sm border rounded"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowAddressForm(false)}
                    className="text-gray-500 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveAddress}
                    className="text-newgreensecond font-medium text-sm"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1">
                  <span className="text-gray-600">Delivering to:</span>
                  {shippingAddress && shippingAddress.zip && shippingAddress.city ? (
                    <span className="ml-2 font-medium text-black">
                      {shippingAddress.zip}, {shippingAddress.city}
                    </span>
                  ) : (
                    <span className="ml-2 text-gray-400 italic">
                      Set your delivery location
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="text-newgreensecond font-medium hover:text-newgreen"
                >
                  {shippingAddress && shippingAddress.zip ? "CHANGE" : "ADD"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Cart Items */}
        <div className="overflow-y-auto h-[calc(100vh-300px)] p-6">
          {cartItems.length > 0 ? (
            cartItems.map((item) => {
              const discountedPrice = getDiscountedPrice(item);
              const originalPrice = getOriginalPrice(item);
              const originalLineTotal = originalPrice * item.quantity;
              const discountedLineTotal = discountedPrice * item.quantity;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-lg mb-4 p-4 border border-gray-100 hover:border-gray-200 transition-all"
                >
                  <div className="flex gap-4">
                    {/* Product Image (replace src if you have images) */}
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover w-20 h-20"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium text-black">{item.name}</h3>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <X
                            size={16}
                            className="text-gray-400 hover:text-red-500"
                          />
                        </button>
                      </div>

                      <div className="flex justify-between items-end mt-2">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center border rounded-md bg-gray-50">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="px-3 py-1 hover:bg-gray-100 text-gray-500"
                            >
                              -
                            </button>
                            <span className="px-4 py-1 font-medium text-black border-x bg-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => {
                                const updatedItem = { ...item, quantity: 1 };
                                addToCart(updatedItem, false);
                              }}
                              className="px-3 py-1 hover:bg-gray-100 text-gray-500"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-semibold text-black">
                            ₹{discountedLineTotal.toLocaleString()}
                          </div>
                          {discountedPrice < originalPrice && (
                            <div className="text-sm text-gray-500 line-through">
                              ₹{originalLineTotal.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-6">
          {/* Price Summary */}
          <div className="mb-4 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{originalSubtotal.toLocaleString()}</span>
            </div>
            {totalDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>- ₹{totalDiscount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span className="text-green-600">FREE</span>
            </div>
            <div className="flex justify-between text-lg font-semibold text-black pt-2 border-t">
              <span>Total Amount</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={() => {
              toggleCart();
              router.push("/checkout");
            }}
            className="w-full py-4 bg-newgreensecond text-white rounded-lg font-medium hover:bg-newgreen transition-colors flex items-center justify-center gap-2"
          >
            Proceed to Checkout
            <ChevronLeft size={20} className="rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
