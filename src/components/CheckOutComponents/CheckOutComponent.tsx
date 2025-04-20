"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { CreditCard, Truck, CheckCircle, ArrowLeft, Tag, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import SignupModal from "../../components/HomepageComponents/Signup";
import { useLazyQuery, useMutation } from "@apollo/client";
import { VALIDATE_PROMO_CODE } from "@/constants/queries/promotionQueries";
// Import the new mutations instead of PLACE_ORDER
import { 
  CREATE_PAYMENT_INTENT,
  CONFIRM_ORDER, 
  PaymentIntentInput 
} from "@/constants/queries/paymentIntentQueries";
import { toast } from "react-toastify";
import { SessionUser } from "../UserDashboardComponenets/types";

interface Promotion {
  id: string;
  title: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minimumPurchase: number;
}

// Define the type for shipping info state
interface ShippingInfoState {
    name: string;
    address: string; // Corresponds to 'street'
    city: string;
    state: string;
    zip: string;
    phone: string;
    country: string;
}

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- State for Shipping Info ---
  const [shippingInfo, setShippingInfo] = useState<ShippingInfoState>({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    country: "India" // Default country
  });

  const [paymentMethod, setPaymentMethod] = useState("card");
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/checkout';

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<Promotion | null>(null);
  const [shippingFee] = useState(50);

  // GraphQL Queries and Mutations
  const [validatePromoCode, { loading: validatingPromo }] = useLazyQuery(VALIDATE_PROMO_CODE, {
    onCompleted: (data) => {
      console.log('Promotion validation response:', data);
      if (data?.validatePromoCode) {
        const promotion = data.validatePromoCode;
        // Check minimum purchase before applying
        if (subtotal < promotion.minimumPurchase) {
          toast.info(`Minimum purchase of ₹${promotion.minimumPurchase} required for code ${promotion.code}.`);
          setAppliedPromo(null); // Don't apply if minimum not met
        } else {
          setAppliedPromo(promotion);
          toast.success('Promotion code applied successfully!');
        }
        setPromoCode(""); // Clear input regardless
      } else {
         // Handle case where validatePromoCode returns null or is missing
         toast.error('Invalid or expired promotion code.');
         setAppliedPromo(null);
      }
    },
    onError: (error) => {
      console.error('Error validating promo code:', error);
      toast.error('Error validating promotion code. Please try again.');
      setAppliedPromo(null);
    },
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    // Check if we have saved checkout data in localStorage
    const savedCheckoutData = localStorage.getItem('tempCheckoutData');
    if (savedCheckoutData) {
      try {
        const parsedData = JSON.parse(savedCheckoutData);
        setShippingInfo(parsedData.shippingInfo);
        // Optionally restore other state like selected payment method
        if (parsedData.paymentMethod) {
          setPaymentMethod(parsedData.paymentMethod);
        }
        if (parsedData.promoCode) {
          setPromoCode(parsedData.promoCode);
        }
        // Clear saved data after restoring
        localStorage.removeItem('tempCheckoutData');
      } catch (e) {
        console.error("Error parsing saved checkout data", e);
        localStorage.removeItem('tempCheckoutData');
      }
    }
  }, []);
  

  // New mutations for two-step order creation
  const [createPaymentIntent, { loading: creatingIntent }] = useMutation(CREATE_PAYMENT_INTENT, {
    onError: (error) => {
      console.error('Error creating payment intent:', error);
      let errorMessage = "Failed to process order. Please try again.";
      if (error.graphQLErrors?.length > 0) {
        errorMessage = error.graphQLErrors[0].message;
      } else if (error.networkError) {
        errorMessage = "Network error. Please check your connection.";
      }
      toast.error(errorMessage);
    }
  });

  const [confirmOrder, { loading: confirmingOrder }] = useMutation(CONFIRM_ORDER, {
    onError: (error) => {
      console.error('Error confirming order:', error);
      let errorMessage = "Failed to place order. Please try again.";
      if (error.graphQLErrors?.length > 0) {
        errorMessage = error.graphQLErrors[0].message;
      } else if (error.networkError) {
        errorMessage = "Network error. Please check your connection.";
      }
      toast.error(errorMessage);
    }
  });

  // Calculate discount amount
  const calculateDiscount = () => {
    if (!appliedPromo || subtotal < appliedPromo.minimumPurchase) return 0;

    return appliedPromo.discountType === 'PERCENTAGE'
      ? (subtotal * appliedPromo.discountValue / 100)
      : Math.min(appliedPromo.discountValue, subtotal);
  };

  const discount = calculateDiscount();
  const totalPrice = subtotal  - discount;

  const handleApplyPromoCode = () => {
    if (!promoCode.trim()) {
      toast.warning('Please enter a promotion code');
      return;
    }
    
    validatePromoCode({
      variables: { code: promoCode.trim() }
    });
  };
  
  const handleRemovePromo = () => { 
    setAppliedPromo(null); 
  };

  // Input Handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    console.log("Session status:", status);

    if (status !== "authenticated" || !session?.user) {
      console.log("User not authenticated. Showing login modal.");
      // Save checkout data before redirecting
      localStorage.setItem('tempCheckoutData', JSON.stringify({
        shippingInfo,
        paymentMethod,
        promoCode: promoCode,
        appliedPromo: appliedPromo
      }));
      setIsLoginOpen(true);
      return;
    }
    // --- Validation ---
    const requiredFields: (keyof ShippingInfoState)[] = ["name", "address", "city", "state", "zip", "phone"];
    const missingFields = requiredFields.filter(field => !shippingInfo[field]?.trim());

    if (missingFields.length > 0) {
      toast.error(`Please fill in required fields: ${missingFields.join(", ")}`);
      return;
    }
    
    if (shippingInfo.zip.length !== 6 || !/^\d+$/.test(shippingInfo.zip)) {
      toast.error('Please enter a valid 6-digit PIN code.');
      return;
    }
    
    if (shippingInfo.phone.length !== 10 || !/^\d+$/.test(shippingInfo.phone)) {
      toast.error('Please enter a valid 10-digit phone number.');
      return;
    }
    
    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    // --- End Validation ---

    setIsSubmitting(true);
    
    try {
      // --- Construct AddressInput ---
      const addressInput = {
        type: "Shipping",
        street: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        zip: shippingInfo.zip,
        country: shippingInfo.country,
        phoneNumber: shippingInfo.phone,
        isDefault: false
      };

      // Create payment intent input
      const userId = (session.user as SessionUser)?.id;
if (!userId) {
  throw new Error("User ID is required");
}
      const paymentIntentInput: PaymentIntentInput = {
        userId: userId,
        products: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: totalPrice,
        shippingAddress: addressInput,
        billingAddress: addressInput, // Using same address for billing
        paymentMethod: paymentMethod === "card" ? "Card" : "COD"
      };

      console.log("Creating payment intent with:", paymentIntentInput);

      // Create payment intent
      const { data } = await createPaymentIntent({
        variables: {
          input: paymentIntentInput
        }
      });

 
      if (!data?.createPaymentIntent?.id) {
        throw new Error("Failed to create payment intent");
      }

      const paymentIntentId = data.createPaymentIntent.id;
      console.log("Payment intent created with ID:", paymentIntentId);

      router.push(`/payment?intentId=${paymentIntentId}`);


      // For COD orders, confirm immediately
      if (paymentMethod === "cod") {
        console.log("Processing COD order...");
        
        const { data: orderData } = await confirmOrder({
          variables: {
            paymentIntentId,
            paymentStatus: "Pending" // COD payment is pending until delivery
          }
        });

        if (!orderData?.confirmOrder?.id) {
          throw new Error("Failed to confirm order");
        }

        toast.success("Order placed successfully!");
        clearCart();

        // Save last order ID for reference
        if (typeof window !== 'undefined') {
          localStorage.setItem('lastOrderId', orderData.confirmOrder.id);
          localStorage.setItem('userRole', (session.user as SessionUser).role || "User");
        }

        // Redirect to confirmation page
        router.push(`/payment/success?orderId=${orderData.confirmOrder.id}`);
      } else {
        // For card payments, redirect to payment page with intent ID
        console.log("Redirecting to payment page with intent ID:", paymentIntentId);
        router.push(`/payment?intentId=${paymentIntentId}`);
      }
    } catch (error: any) {
      console.error("Error processing order:", error);
      let errorMessage = "Failed to process order. Please try again.";
      
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
          errorMessage = error.graphQLErrors[0].message;
      } else if (error.networkError) {
          errorMessage = `Network error: ${error.networkError.message}`;
      } else if (error.message) {
          errorMessage = error.message;
      }
      
      toast.error(errorMessage);
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
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-gray-600 mb-1">Full Name *</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={shippingInfo.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-newgreensecond focus:border-newgreensecond"
                  required
                />
              </div>
              {/* Phone Input */}
               <div>
                <label htmlFor="phone" className="block text-xs font-medium text-gray-600 mb-1">10-Digit Phone Number *</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={shippingInfo.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-newgreensecond focus:border-newgreensecond"
                  required
                  maxLength={10}
                  pattern="[0-9]{10}"
                />
               </div>
              {/* Address (Street) Input */}
              <div>
                 <label htmlFor="address" className="block text-xs font-medium text-gray-600 mb-1">Street Address *</label>
                 <input
                    id="address"
                    type="text"
                    name="address"
                    placeholder="House No, Building, Street, Area"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-newgreensecond focus:border-newgreensecond"
                    required
                 />
              </div>
              {/* City, State, Zip Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="city" className="block text-xs font-medium text-gray-600 mb-1">City *</label>
                    <input
                      id="city"
                      type="text"
                      name="city"
                      placeholder="City"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-newgreensecond focus:border-newgreensecond"
                      required
                    />
                </div>
                <div>
                    <label htmlFor="state" className="block text-xs font-medium text-gray-600 mb-1">State *</label>
                    <input
                      id="state"
                      type="text"
                      name="state"
                      placeholder="State"
                      value={shippingInfo.state}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-newgreensecond focus:border-newgreensecond"
                      required
                    />
                </div>
                 <div>
                    <label htmlFor="zip" className="block text-xs font-medium text-gray-600 mb-1">PIN Code *</label>
                    <input
                        id="zip"
                        type="text" // Use text to allow leading zeros if needed, pattern enforces digits
                        name="zip"
                        placeholder="6-Digit PIN Code"
                        value={shippingInfo.zip}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-newgreensecond focus:border-newgreensecond"
                        required
                        maxLength={6}
                        pattern="[0-9]{6}"
                    />
                 </div>
              </div>
              <p className="text-xs text-gray-500">* Required fields</p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-sm p-6">
             <h2 className="text-lg font-semibold text-black mb-4">Payment Method</h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                className={`p-4 rounded-lg border-2 flex items-center justify-start text-left gap-3 ${
                  paymentMethod === "card"
                    ? "border-newgreensecond bg-green-50 ring-1 ring-newgreensecond"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setPaymentMethod("card")}
              >
                <CreditCard className={`h-6 w-6 flex-shrink-0 ${paymentMethod === "card" ? "text-newgreensecond" : "text-gray-400"}`} />
                <div>
                  <span className={`text-sm font-medium ${paymentMethod === "card" ? "text-newgreensecond" : "text-gray-700"}`}>
                    Online Payment
                  </span>
                  <p className="text-xs text-gray-500">Card / UPI / NetBanking</p>
                </div>
              </button>
 
            </div>
          </div>
        </div>

        {/* Right Section - Order Summary */}
        <div className="w-full md:w-96 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-6 md:sticky md:top-4">
            <h2 className="text-lg font-semibold text-black mb-4">Order Summary</h2>

             {/* Items */}
            {cartItems.length > 0 ? (
              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-2 border-b pb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm text-gray-700">
                    <span className="flex-1 truncate pr-2">{item.name} (×{item.quantity})</span>
                    <span className="flex-shrink-0">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 mb-4 border-b">
                <p className="text-gray-500 text-sm">Your cart is empty</p>
              </div>
            )}

            {/* Promotion Code Section */}
            <div className="pt-4 pb-4">
                <div className="flex items-center mb-2">
                    <Tag size={16} className="mr-2 text-newgreensecond" />
                    <h3 className="text-sm font-medium text-gray-700">Have a Promotion Code?</h3>
                </div>
                {appliedPromo ? (
                     <div className="flex items-center justify-between bg-green-50 p-2 rounded-md">
                        <div>
                            <span className="font-medium text-green-700 text-sm">{appliedPromo.code} Applied!</span>
                            <p className="text-xs text-green-600">
                            {appliedPromo.discountType === 'PERCENTAGE'
                                ? `${appliedPromo.discountValue}% Discount`
                                : `₹${appliedPromo.discountValue} Discount`}
                            </p>
                        </div>
                        <button onClick={handleRemovePromo} className="text-xs text-red-600 hover:text-red-800 font-medium">Remove</button>
                    </div>
                ) : (
                    <div className="flex">
                    <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        placeholder="Enter code"
                        className="flex-1 p-2 text-sm border rounded-l-md focus:outline-none focus:ring-1 focus:ring-newgreensecond"
                    />
                    <button
                        onClick={handleApplyPromoCode}
                        disabled={validatingPromo}
                        className="bg-gray-600 text-white px-3 py-2 rounded-r-md text-sm hover:bg-gray-700 disabled:opacity-50"
                    >
                        {validatingPromo ? <Loader2 className="h-4 w-4 animate-spin"/> : 'Apply'}
                    </button>
                    </div>
                )}
            </div>

            {/* Price Breakdown */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount ({appliedPromo?.code})</span>
                  <span>- ₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-black font-semibold pt-2 border-t mt-2 text-base">
                <span>Total</span>
                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={isSubmitting || cartItems.length === 0 || status === "loading"}
              className={`w-full py-3 px-4 text-white rounded-md font-medium mt-6 flex items-center justify-center gap-2 transition-colors duration-200
                ${isSubmitting || cartItems.length === 0 || status === "loading"
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-newgreensecond hover:bg-newgreen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-newgreen'
                }`}
            >
              {isSubmitting || creatingIntent || confirmingOrder ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
              ) : status === "loading" ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Loading...</>
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
        callbackUrl={currentPath} // Redirect back to checkout after login
      />
    </div>
  );
};

export default CheckoutPage;