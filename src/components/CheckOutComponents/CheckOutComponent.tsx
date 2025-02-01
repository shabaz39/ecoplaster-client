"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { CreditCard, Truck, CheckCircle, ArrowLeft, Gift } from "lucide-react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import SignupModal from "../../components/HomepageComponents/Signup"; // Google Login Modal

const CheckoutPage = () => {
  const { cartItems } = useCart();
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    city: "",
    zip: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e: any) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = () => {
    if (!user) {
      setIsLoginOpen(true); // Show login modal if not logged in
    } else {
      router.push("/payment"); // Redirect to payment page if logged in
    }
  };

  return (
    <div className="max-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-black hover:text-newgreensecond"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </button>
          <h1 className="text-xl font-semibold text-black mx-auto">Checkout</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 flex gap-8">
        {/* Left Section */}
        <div className="flex-grow max-w-2xl">
          {/* Shipping Info */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 text-black">
            <h2 className="text-lg font-semibold text-black mb-4">Shipping Information</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={shippingInfo.name}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:border-newgreensecond"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={shippingInfo.phone}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:border-newgreensecond"
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={shippingInfo.address}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:border-newgreensecond"
              />
              <div className="flex gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={shippingInfo.city}
                  onChange={handleInputChange}
                  className="w-1/2 p-3 border border-gray-200 rounded-md focus:outline-none focus:border-newgreensecond"
                />
                <input
                  type="text"
                  name="zip"
                  placeholder="PIN Code"
                  value={shippingInfo.zip}
                  onChange={handleInputChange}
                  className="w-1/2 p-3 border border-gray-200 rounded-md focus:outline-none focus:border-newgreensecond"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-black mb-4">Payment Method</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                className={`p-4 rounded-lg border-2 flex items-center gap-3 ${
                  paymentMethod === "card"
                    ? "border-newgreensecond bg-green-50"
                    : "border-gray-200"
                }`}
                onClick={() => setPaymentMethod("card")}
              >
                <CreditCard className={paymentMethod === "card" ? "text-newgreensecond" : "text-gray-400"} />
                <span className={paymentMethod === "card" ? "text-newgreensecond font-medium" : "text-gray-600"}>
                  Card Payment
                </span>
              </button>
              <button
                className={`p-4 rounded-lg border-2 flex items-center gap-3 ${
                  paymentMethod === "cod"
                    ? "border-newgreensecond bg-green-50"
                    : "border-gray-200"
                }`}
                onClick={() => setPaymentMethod("cod")}
              >
                <Truck className={paymentMethod === "cod" ? "text-newgreensecond" : "text-gray-400"} />
                <span className={paymentMethod === "cod" ? "text-newgreensecond font-medium" : "text-gray-600"}>
                  Cash on Delivery
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Section - Order Summary */}
        <div className="w-96">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <h2 className="text-lg font-semibold text-black mb-4">Order Summary</h2>
            
            {/* Items */}
            <div className="space-y-4 mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-gray-600">
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>- ₹{(totalPrice * 0.4).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="flex justify-between font-semibold text-lg text-black pt-2 border-t">
                <span>Total</span>
                <span>₹{(totalPrice * 0.6).toLocaleString()}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <button 
              onClick={handlePlaceOrder} 
              className="w-full py-4 bg-newgreensecond text-white rounded-md font-medium mt-6 hover:bg-newgreen transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle size={20} />
              Place Order
            </button>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <SignupModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
};

export default CheckoutPage;
