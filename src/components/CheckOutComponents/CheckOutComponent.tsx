"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { CreditCard, CheckCircle, ArrowLeft, Tag, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import SignupModal from "../../components/HomepageComponents/Signup";
import { useLazyQuery, useMutation, gql } from "@apollo/client";
import { 
  CREATE_PAYMENT_INTENT,
  CONFIRM_ORDER, 
  PaymentIntentInput 
} from "@/constants/queries/paymentIntentQueries";
import { toast } from "react-toastify";
import { SessionUser } from "../UserDashboardComponenets/types";

const CALCULATE_PROMOTION_DISCOUNT = gql`
  query CalculatePromotionDiscount($code: String!, $cartItems: [CartItemInput!]!, $userId: ID) {
    calculatePromotionDiscount(code: $code, cartItems: $cartItems, userId: $userId) {
      totalDiscount
      itemDiscounts {
        productId
        originalPrice
        discountAmount
        finalPrice
        quantity
      }
      promotionApplied {
        id
        code
        title
        discountType
        scope
      }
    }
  }
`;

const RECORD_PROMOTION_USAGE = gql`
  mutation RecordPromotionUsage(
    $promotionId: ID!
    $userId: ID!
    $orderId: ID!
    $discountApplied: Float!
    $orderTotal: Float!
  ) {
    recordPromotionUsage(
      promotionId: $promotionId
      userId: $userId
      orderId: $orderId
      discountApplied: $discountApplied
      orderTotal: $orderTotal
    ) {
      id
      usesCount
    }
  }
`;

interface ShippingInfoState {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    country: string;
}

const CheckoutPage = () => {
  const { cartItems, clearCart, appliedPromotion, setAppliedPromotion } = useCart();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [shippingInfo, setShippingInfo] = useState<ShippingInfoState>({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    country: "India"
  });

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [promoCode, setPromoCode] = useState("");
  const [promotionLoading, setPromotionLoading] = useState(false);

  // Subtotal before discounts
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // Calculate totals after discounts (order-level or product-level)
  const calculateTotals = () => {
    let finalTotalPrice = 0;
    if (appliedPromotion && appliedPromotion.itemDiscounts?.length > 0) {
      finalTotalPrice = cartItems.reduce((acc, cartItem) => {
        const itemDiscountInfo = appliedPromotion.itemDiscounts.find(d => d.productId === cartItem.id);
        const priceToUse = itemDiscountInfo ? itemDiscountInfo.finalPrice : cartItem.price;
        return acc + priceToUse * cartItem.quantity;
      }, 0);
    } else {
      finalTotalPrice = subtotal;
    }
    const finalDiscount = subtotal - finalTotalPrice;
    return { totalPrice: finalTotalPrice, discount: finalDiscount };
  };
  const { totalPrice, discount } = calculateTotals();

  useEffect(() => {
    const savedCheckoutData = localStorage.getItem('tempCheckoutData');
    if (savedCheckoutData) {
      try {
        const parsedData = JSON.parse(savedCheckoutData);
        setShippingInfo(parsedData.shippingInfo);
        if (parsedData.paymentMethod) setPaymentMethod(parsedData.paymentMethod);
        if (parsedData.appliedPromotion) setAppliedPromotion(parsedData.appliedPromotion);
        localStorage.removeItem('tempCheckoutData');
      } catch (e) {
        console.error("Error parsing saved checkout data", e);
        localStorage.removeItem('tempCheckoutData');
      }
    }
  }, []);

  // Promotion logic
  const [calculateDiscount] = useLazyQuery(CALCULATE_PROMOTION_DISCOUNT, {
    onCompleted: (data) => {
      if (data?.calculatePromotionDiscount) {
        setAppliedPromotion(data.calculatePromotionDiscount); // context
        toast.success(`Promotion "${data.calculatePromotionDiscount.promotionApplied.code}" applied successfully!`);
        setPromoCode("");
      }
    },
    onError: (error) => {
      console.error('Error calculating discount:', error);
      toast.error(error.message || 'Error applying promotion code');
      setAppliedPromotion(null);
    }
  });

  const [recordPromotionUsage] = useMutation(RECORD_PROMOTION_USAGE);

  const [createPaymentIntent, { loading: creatingIntent }] = useMutation(CREATE_PAYMENT_INTENT, {
    onError: (error) => {
      console.error('Error creating payment intent:', error);
      let errorMessage = "Failed to process order. Please try again.";
      if (error.graphQLErrors?.length > 0) errorMessage = error.graphQLErrors[0].message;
      else if (error.networkError) errorMessage = "Network error. Please check your connection.";
      toast.error(errorMessage);
    }
  });

  const [confirmOrder, { loading: confirmingOrder }] = useMutation(CONFIRM_ORDER, {
    onError: (error) => {
      console.error('Error confirming order:', error);
      let errorMessage = "Failed to place order. Please try again.";
      if (error.graphQLErrors?.length > 0) errorMessage = error.graphQLErrors[0].message;
      else if (error.networkError) errorMessage = "Network error. Please check your connection.";
      toast.error(errorMessage);
    }
  });

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) {
      toast.warning('Please enter a promotion code');
      return;
    }
    setPromotionLoading(true);
    try {
      const cartItemsInput = cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
        name: item.name
      }));
      const userId = (session?.user as SessionUser)?.id;
      await calculateDiscount({
        variables: {
          code: promoCode.trim(),
          cartItems: cartItemsInput,
          userId: userId
        }
      });
    } catch (error) {
      console.error('Error applying promo code:', error);
    } finally {
      setPromotionLoading(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromotion(null);
    toast.info('Promotion code removed');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (status !== "authenticated" || !session?.user) {
      localStorage.setItem('tempCheckoutData', JSON.stringify({
        shippingInfo,
        paymentMethod,
        appliedPromotion
      }));
      setIsLoginOpen(true);
      return;
    }
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
    setIsSubmitting(true);

    try {
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

      const userId = (session.user as SessionUser)?.id;
      if (!userId) throw new Error("User ID is required");

      const paymentIntentInput: PaymentIntentInput = {
        userId: userId,
        products: cartItems.map(item => {
          const itemDiscountInfo = appliedPromotion?.itemDiscounts.find(
            discount => discount.productId === item.id
          );
          const priceForPayload = itemDiscountInfo ? itemDiscountInfo.finalPrice : item.price;
          return {
            productId: item.id,
            quantity: item.quantity,
            price: priceForPayload
          };
        }),
        totalAmount: totalPrice,
        shippingAddress: addressInput,
        billingAddress: addressInput,
        paymentMethod: paymentMethod === "card" ? "Card" : "COD"
      };

      const sumOfProductPrices = paymentIntentInput.products.reduce(
        (sum, p) => sum + p.price * p.quantity, 0
      );
      if (Math.abs(sumOfProductPrices - paymentIntentInput.totalAmount) > 0.01) {
        toast.error("Order total calculation error. Please try again or contact support.");
        setIsSubmitting(false);
        return;
      }

      const { data } = await createPaymentIntent({
        variables: { input: paymentIntentInput }
      });

      if (!data?.createPaymentIntent?.id) throw new Error("Failed to create payment intent");
      const paymentIntentId = data.createPaymentIntent.id;

      if (paymentMethod === "cod") {
        const { data: orderData } = await confirmOrder({
          variables: {
            paymentIntentId,
            paymentStatus: "Pending"
          }
        });
        if (!orderData?.confirmOrder?.id) throw new Error("Failed to confirm order");

        if (appliedPromotion && discount > 0) {
          try {
            await recordPromotionUsage({
              variables: {
                promotionId: appliedPromotion.promotionApplied.id,
                userId: userId,
                orderId: orderData.confirmOrder.id,
                discountApplied: discount,
                orderTotal: subtotal
              }
            });
          } catch (error) {
            console.error("Error recording promotion usage:", error);
          }
        }

        toast.success("Order placed successfully!");
        clearCart();

        if (typeof window !== 'undefined') {
          localStorage.setItem('lastOrderId', orderData.confirmOrder.id);
          localStorage.setItem('userRole', (session.user as SessionUser).role || "User");
        }
        router.push(`/payment/success?orderId=${orderData.confirmOrder.id}`);
      } else {
        // Online payment
        if (appliedPromotion && discount > 0) {
          localStorage.setItem('pendingPromotionUsage', JSON.stringify({
            promotionId: appliedPromotion.promotionApplied.id,
            userId: userId,
            discountApplied: discount,
            orderTotal: subtotal
          }));
        }
        router.push(`/payment?intentId=${paymentIntentId}`);
      }
    } catch (error: any) {
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

  // UI
  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center">
          <button onClick={() => router.back()} className="flex items-center text-black hover:text-newgreensecond">
            <ArrowLeft size={20} className="mr-2" /> Back
          </button>
          <h1 className="text-xl font-semibold text-black mx-auto">Checkout</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        <div className="flex-grow">
          {/* Shipping Info */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 text-black">
            <h2 className="text-lg font-semibold text-black mb-4">Shipping Information</h2>
            <div className="space-y-4">
              {/* ...fields for name, phone, address, city, state, zip... */}
              {/* Use handleInputChange for all */}
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-gray-600 mb-1">Full Name *</label>
                <input id="name" type="text" name="name" placeholder="Enter your full name"
                  value={shippingInfo.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-newgreensecond focus:border-newgreensecond"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-xs font-medium text-gray-600 mb-1">10-Digit Phone Number *</label>
                <input id="phone" type="tel" name="phone" placeholder="Enter your phone number"
                  value={shippingInfo.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-newgreensecond focus:border-newgreensecond"
                  required maxLength={10} pattern="[0-9]{10}"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-xs font-medium text-gray-600 mb-1">Street Address *</label>
                <input id="address" type="text" name="address" placeholder="House No, Building, Street, Area"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-newgreensecond focus:border-newgreensecond"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="city" className="block text-xs font-medium text-gray-600 mb-1">City *</label>
                  <input id="city" type="text" name="city" placeholder="City"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-newgreensecond focus:border-newgreensecond"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-xs font-medium text-gray-600 mb-1">State *</label>
                  <input id="state" type="text" name="state" placeholder="State"
                    value={shippingInfo.state}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-newgreensecond focus:border-newgreensecond"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="zip" className="block text-xs font-medium text-gray-600 mb-1">PIN Code *</label>
                  <input id="zip" type="text" name="zip" placeholder="6-Digit PIN Code"
                    value={shippingInfo.zip}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-newgreensecond focus:border-newgreensecond"
                    required maxLength={6} pattern="[0-9]{6}"
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

        {/* Right side: Order Summary */}
        <div className="w-full md:w-96 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-6 md:sticky md:top-4">
            <h2 className="text-lg font-semibold text-black mb-4">Order Summary</h2>

            {cartItems.length > 0 ? (
              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-2 border-b pb-4">
                {cartItems.map((item) => {
                  const itemDiscount = appliedPromotion?.itemDiscounts.find(
                    d => d.productId === item.id
                  );
                  const displayPricePerUnit = itemDiscount ? itemDiscount.finalPrice : item.price;
                  const lineItemTotal = displayPricePerUnit * item.quantity;
                  const perItemDiscountAmount = itemDiscount ? (item.price - itemDiscount.finalPrice) : 0;
                  const hasDiscountOnItem = perItemDiscountAmount > 0;

                  return (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div className="flex-1 truncate pr-2">
                        <span className="text-gray-700">{item.name} (×{item.quantity})</span>
                        {hasDiscountOnItem && (
                          <div className="text-xs text-green-600">
                            Save ₹{(perItemDiscountAmount * item.quantity).toLocaleString('en-IN')}
                          </div>
                        )}
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <span className="text-gray-700">₹{lineItemTotal.toLocaleString('en-IN')}</span>
                        {hasDiscountOnItem && (
                          <div className="text-xs text-gray-500 line-through">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4 mb-4 border-b">
                <p className="text-gray-500 text-sm">Your cart is empty</p>
              </div>
            )}

            <div className="pt-4 pb-4">
              <div className="flex items-center mb-2">
                <Tag size={16} className="mr-2 text-newgreensecond" />
                <h3 className="text-sm font-medium text-gray-700">Have a Promotion Code?</h3>
              </div>
              {appliedPromotion ? (
                <div className="flex items-center justify-between bg-green-50 p-3 rounded-md mb-2">
                  <div className="flex-1">
                    <span className="font-medium text-green-700 text-sm">{appliedPromotion.promotionApplied.code} Applied!</span>
                    <p className="text-xs text-green-600">{appliedPromotion.promotionApplied.title}</p>
                    <p className="text-xs text-green-600">
                      Scope: {appliedPromotion.promotionApplied.scope === 'PRODUCT' ? 'Individual Products' : 'Entire Order'}
                    </p>
                  </div>
                  <button onClick={handleRemovePromo} className="text-xs text-red-600 hover:text-red-800 font-medium">Remove</button>
                </div>
              ) : (
                <div className="flex mb-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="flex-1 p-2 text-sm border rounded-l-md focus:outline-none focus:ring-1 focus:ring-newgreensecond"
                  />
                  <button
                    onClick={handleApplyPromoCode}
                    disabled={promotionLoading}
                    className="bg-gray-600 text-white px-3 py-2 rounded-r-md text-sm hover:bg-gray-700 disabled:opacity-50"
                  >
                    {promotionLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : 'Apply'}
                  </button>
                </div>
              )}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && appliedPromotion && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount ({appliedPromotion.promotionApplied.code})</span>
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

            <button
              onClick={handlePlaceOrder}
              disabled={isSubmitting || cartItems.length === 0 || status === "loading" || creatingIntent || confirmingOrder}
              className={`w-full py-3 px-4 text-white rounded-md font-medium mt-6 flex items-center justify-center gap-2 transition-colors duration-200
                ${isSubmitting || cartItems.length === 0 || status === "loading" || creatingIntent || confirmingOrder
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

      <SignupModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        callbackUrl="/checkout"
      />
    </div>
  );
};

export default CheckoutPage;
