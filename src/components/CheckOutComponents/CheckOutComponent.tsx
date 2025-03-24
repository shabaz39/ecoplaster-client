"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { CreditCard, Truck, CheckCircle, ArrowLeft, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import SignupModal from "../../components/HomepageComponents/Signup";
import { useLazyQuery, useMutation } from "@apollo/client";
import { VALIDATE_PROMO_CODE } from "@/constants/queries/promotionQueries";
import { PLACE_ORDER } from "@/constants/queries/orderQuerues";
import { toast } from "react-toastify";

interface Promotion {
  id: string;
  title: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minimumPurchase: number;
}

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    city: "",
    zip: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/checkout';
  
  // Promotion code state
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<Promotion | null>(null);
  const [shippingFee] = useState(50); // Fixed shipping fee

  // GraphQL query for promotion validation
  const [validatePromoCode, { loading: validatingPromo }] = useLazyQuery(VALIDATE_PROMO_CODE, {
    onCompleted: (data) => {
      console.log('Promotion validation response:', data);
      if (data?.validatePromoCode) {
        const promotion = data.validatePromoCode;
        setAppliedPromo(promotion);
        
        // Check minimum purchase requirement
        if (subtotal < promotion.minimumPurchase) {
          toast.info(`This promotion requires a minimum purchase of ₹${promotion.minimumPurchase}`);
        } else {
          toast.success('Promotion code applied successfully!');
        }
        
        setPromoCode("");
      }
    },
    onError: (error) => {
      console.error('Promo validation error:', error);
      toast.error(error.message || 'Invalid promotion code');
    },
    fetchPolicy: 'network-only'
  });

  // Create order mutation
  const [createOrder, { loading: creatingOrder }] = useMutation(PLACE_ORDER);

  // Calculate discount amount
  const calculateDiscount = () => {
    if (!appliedPromo) return 0;
    
    // Check if subtotal meets minimum purchase requirement
    if (subtotal < appliedPromo.minimumPurchase) {
      return 0;
    }
    
    return appliedPromo.discountType === 'PERCENTAGE'
      ? (subtotal * appliedPromo.discountValue / 100)
      : Math.min(appliedPromo.discountValue, subtotal); // Cap fixed discount at subtotal
  };
  
  const discount = calculateDiscount();
  const totalPrice = subtotal + shippingFee - discount;
  
  const handleApplyPromoCode = () => {
    if (!promoCode.trim()) {
      toast.error('Please enter a promotion code');
      return;
    }
    
    console.log('Validating promo code:', promoCode.trim());
    validatePromoCode({ 
      variables: { code: promoCode.trim() } 
    });
  };
  
  const handleRemovePromo = () => {
    setAppliedPromo(null);
  };

  const handleInputChange = (e: any) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    console.log("Session status:", status);
    console.log("Session data:", session);
    
    if (status !== "authenticated" || !session?.user) {
      console.log("No authenticated session, showing login modal");
      setIsLoginOpen(true);
      return;
    }
    
    // Validate shipping info
    const requiredFields = ["name", "address", "city", "zip", "phone"];
    const missingFields = requiredFields.filter(field => {
      return !shippingInfo[field as keyof typeof shippingInfo];
    });
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required shipping information: ${missingFields.join(", ")}`);
      return;
    }
  
    // Validate cart is not empty
    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Please add items before proceeding.");
      return;
    }
  
    try {
      setIsSubmitting(true);
      
      // Create order input that exactly matches what your server expects
      const orderInput = {
        products: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: totalPrice,
        shippingAddress: {
          type: "Shipping",
          street: shippingInfo.address,
          city: shippingInfo.city,
          state: "", 
          zip: shippingInfo.zip,
          country: "India"
        },
        billingAddress: {
          type: "Billing",
          street: shippingInfo.address,
          city: shippingInfo.city,
          state: "", 
          zip: shippingInfo.zip,
          country: "India"
        },
        paymentMethod: paymentMethod === "card" ? "Card" : "COD",
        paymentStatus: "Pending"
      };
      
      console.log("Submitting order with data:", { 
        userId: session.user.id, 
        orderInput 
      });
      
      // Use fetch without credentials to bypass CORS issues
      try {
        const response = await fetch('http://localhost:4000/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              mutation PlaceOrder($userId: ID!, $orderInput: OrderInput!) {
                placeOrder(userId: $userId, orderInput: $orderInput) {
                  id
                  status
                  totalAmount
                }
              }
            `,
            variables: {
              userId: session.user.id,
              orderInput: orderInput
            }
          })
        });
        
        const responseText = await response.text();
        console.log("Raw GraphQL response:", responseText);
        
        if (!response.ok) {
          throw new Error(`Server returned ${response.status}: ${responseText}`);
        }
        
        const responseJson = JSON.parse(responseText);
        console.log("Parsed response:", responseJson);
        
        if (responseJson.errors) {
          throw new Error(responseJson.errors[0].message);
        }
        
        if (!responseJson.data || !responseJson.data.placeOrder) {
          throw new Error("No order data returned");
        }
        
        const orderId = responseJson.data.placeOrder.id;
        
        // Show success message first
        toast.success("Order placed successfully!");
        
        // Clear the cart
        clearCart();
        
        // Save important data to local storage for recovery if needed
        if (typeof window !== 'undefined') {
          localStorage.setItem('lastOrderId', orderId);
          localStorage.setItem('userRole', session.user.role || "User");
        }
        
        // Use a slight delay then redirect
        setTimeout(() => {
          if (paymentMethod === "card") {
            console.log("Navigating to payment page", `/payment?orderId=${orderId}`);
            // Ensure we're passing the session information properly
            router.push(`/payment?orderId=${orderId}`);
          } else {
            console.log("Navigating to confirmation page", `/order/confirmation?orderId=${orderId}`);
            router.push(`/order/confirmation?orderId=${orderId}`);
          }
        }, 500);
        
      } catch (fetchError: any) {
        console.error("Fetch error:", fetchError);
        throw new Error(`Request failed: ${fetchError.message}`);
      }
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast.error(`Failed to place order: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  
  return (
    <div className="min-h-screen bg-gray-50 text-black">
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

      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Left Section (Shipping Info & Payment Method) */}
        <div className="flex-grow">
          {/* Shipping Info */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 text-black">
            <h2 className="text-lg font-semibold text-black mb-4">Shipping Information</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name*"
                value={shippingInfo.name}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:border-newgreensecond"
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number*"
                value={shippingInfo.phone}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:border-newgreensecond"
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Address*"
                value={shippingInfo.address}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:border-newgreensecond"
                required
              />
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City*"
                  value={shippingInfo.city}
                  onChange={handleInputChange}
                  className="w-full sm:w-1/2 p-3 border border-gray-200 rounded-md focus:outline-none focus:border-newgreensecond"
                  required
                />
                <input
                  type="text"
                  name="zip"
                  placeholder="PIN Code*"
                  value={shippingInfo.zip}
                  onChange={handleInputChange}
                  className="w-full sm:w-1/2 p-3 border border-gray-200 rounded-md focus:outline-none focus:border-newgreensecond"
                  required
                />
              </div>
              <p className="text-xs text-gray-500">* Required fields</p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-black mb-4">Payment Method</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                className={`p-4 rounded-lg border-2 flex items-center justify-center gap-3 ${
                  paymentMethod === "card"
                    ? "border-newgreensecond bg-green-50"
                    : "border-gray-200"
                }`}
                onClick={() => setPaymentMethod("card")}
              >
                <CreditCard className={paymentMethod === "card" ? "text-newgreensecond" : "text-gray-400"} />
                <div className="text-left">
                  <span className={paymentMethod === "card" ? "text-newgreensecond font-medium" : "text-gray-600"}>
                    Card Payment
                  </span>
                  <p className="text-xs text-gray-500">Credit/Debit Card, UPI, NetBanking</p>
                </div>
              </button>
              <button
                className={`p-4 rounded-lg border-2 flex items-center justify-center gap-3 ${
                  paymentMethod === "cod"
                    ? "border-newgreensecond bg-green-50"
                    : "border-gray-200"
                }`}
                onClick={() => setPaymentMethod("cod")}
              >
                <Truck className={paymentMethod === "cod" ? "text-newgreensecond" : "text-gray-400"} />
                <div className="text-left">
                  <span className={paymentMethod === "cod" ? "text-newgreensecond font-medium" : "text-gray-600"}>
                    Cash on Delivery
                  </span>
                  <p className="text-xs text-gray-500">Pay when your order arrives</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Section - Order Summary */}
        <div className="w-full md:w-96">
          <div className="bg-white rounded-lg shadow-sm p-6 md:sticky md:top-4">
            <h2 className="text-lg font-semibold text-black mb-4">Order Summary</h2>

            {/* Items */}
            {cartItems.length > 0 ? (
              <div className="space-y-4 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-gray-600">
                    <span>{item.name} × {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 mb-4">
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            )}

            {/* Promotion Code Section */}
            <div className="border-t pt-4 pb-4">
              <div className="flex items-center mb-2">
                <Tag size={16} className="mr-2 text-newgreensecond" />
                <h3 className="text-sm font-medium text-gray-700">Promotion Code</h3>
              </div>
              
              {appliedPromo ? (
                <div className="flex items-center justify-between bg-green-50 p-3 rounded-md">
                  <div>
                    <span className="font-medium text-green-700">{appliedPromo.code}</span>
                    <p className="text-xs text-green-600">
                      {appliedPromo.title}: {appliedPromo.discountType === 'PERCENTAGE' 
                        ? `${appliedPromo.discountValue}% off` 
                        : `₹${appliedPromo.discountValue} off`}
                    </p>
                  </div>
                  <button 
                    onClick={handleRemovePromo}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Enter promo code"
                    className="flex-1 p-2 text-sm border rounded-l-md focus:outline-none focus:ring-1 focus:ring-newgreensecond"
                  />
                  <button
                    onClick={handleApplyPromoCode}
                    disabled={validatingPromo}
                    className="bg-newgreensecond text-white px-3 py-2 rounded-r-md text-sm hover:bg-newgreen disabled:opacity-50"
                  >
                    {validatingPromo ? 'Applying...' : 'Apply'}
                  </button>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{discount.toLocaleString()}</span>
                </div>
              )}
              
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>₹{shippingFee.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between text-black font-medium pt-2 border-t mt-2">
                <span>Total</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <button 
              onClick={handlePlaceOrder}
              disabled={isSubmitting || cartItems.length === 0 || status === "loading"}
              className={`w-full py-4 text-white rounded-md font-medium mt-6 flex items-center justify-center gap-2
                ${isSubmitting || cartItems.length === 0 || status === "loading"
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-newgreensecond hover:bg-newgreen transition-colors'
                }`}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-1"></span>
                  Processing...
                </>
              ) : status === "loading" ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-1"></span>
                  Checking session...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  {status === "authenticated" ? 'Place Order' : 'Sign in to Order'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <SignupModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)}
        callbackUrl={currentPath}
      />
    </div>
  );
};

export default CheckoutPage;