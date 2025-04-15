"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "../../../context/CartContext";
import { useMutation, useLazyQuery, useQuery, gql } from "@apollo/client";
import { 
  CREATE_PAYMENT_ORDER,
  VERIFY_PAYMENT,
  HANDLE_PAYMENT_FAILURE
} from "../../../constants/queries/paymentQueries";
import {
  VERIFY_PAYMENT_AND_CONFIRM_ORDER
} from "../../../constants/queries/paymentIntentQueries";
import { OrderSummary } from "./OrderSummary";
import { PaymentStatusBanner } from "./PaymentStatusBanner";
import { PaymentMethods } from "./PaymentMethods";
import { ArrowLeft, CreditCard, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { GET_PAYMENT_INTENT } from "../../../constants/queries/paymentIntentQueries";

declare global {
  interface Window {
    Razorpay: any;
  }
}
 

interface PaymentPageProps {
  intentId: string;
}

// Define structure for OrderSummary based on AVAILABLE intent data
interface IntentOrderSummaryData {
  id: string;
  products: Array<{
      productId: string;
      name: string; // Will be a placeholder
      quantity: number;
      price: number;
      image?: string; // Will be undefined
      code?: string; // Will be undefined
  }>;
  shippingAddress: any; // Use 'any' or define Address type from intent schema
  totalAmount: number;
  status: string; // Intent status
}

const PaymentPage: React.FC<PaymentPageProps> = ({ intentId }) => {
   

  const router = useRouter();
  const { clearCart } = useCart();
  const { data: session } = useSession();
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

  console.log("PaymentPage initialized with intentId:", intentId);

  const [orderSummaryData, setOrderSummaryData] = useState<IntentOrderSummaryData | null>(null);

  // Get payment intent data
  const { data: intentData, loading: intentLoading, error: intentError } =  useQuery(GET_PAYMENT_INTENT, {
    variables: { id: intentId },
    fetchPolicy: "network-only",
    skip: !intentId,

    onCompleted: (data) => {
      console.log("Payment intent data loaded:", data?.getPaymentIntent);
      
      // Check if intent has expired
      if (data?.getPaymentIntent?.status === 'expired') {
        toast.error("Payment session has expired. Please return to checkout and try again.");
        setTimeout(() => {
          router.push('/checkout');
        }, 3000);
      }
    },
    onError: (error) => {
      console.error("Error loading payment intent:", error);
      toast.error("Could not load payment details. Please try again.");
    }
  });

  // Create payment order mutation
  const [createPaymentOrder, { loading: creatingOrder }] = useMutation(CREATE_PAYMENT_ORDER, {
    onCompleted: (data) => {
      console.log("Payment order created successfully:", data);
    },
    onError: (error) => {
      console.error("Error creating payment order:", error);
      toast.error("Error creating payment. Please try again.");
    }
  });

  // Verify payment and confirm order mutation (new)
  const [verifyPaymentAndConfirmOrder, { loading: verifyingAndConfirming }] = useMutation(VERIFY_PAYMENT_AND_CONFIRM_ORDER, {
    onCompleted: (data) => {
      console.log("Payment verified and order confirmed:", data);
    },
    onError: (error) => {
      console.error("Error verifying payment:", error);
      setPaymentStatus('failed');
      setErrorMessage("Payment verification failed");
      toast.error("Payment verification failed. Please contact support.");
    }
  });

  // Handle payment failure
  const [handlePaymentFailure] = useMutation(HANDLE_PAYMENT_FAILURE);

  useEffect(() => {
    // Load Razorpay script
    const loadRazorpayScript = () => {
      return new Promise<void>((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => {
          console.log("Razorpay script loaded successfully");
          resolve();
          setIsRazorpayLoaded(true);
        };
        script.onerror = () => {
          console.error("Failed to load Razorpay script");
        };
        document.body.appendChild(script);
      });
    };

    // Load Razorpay script if not already loaded
    if (typeof window !== 'undefined') {
      if (!window.Razorpay) {
        console.log("Loading Razorpay script...");
        loadRazorpayScript();
      } else {
        console.log("Razorpay already loaded");
        setIsRazorpayLoaded(true);
      }
    }
  }, []);

  // Handle payment initiation
  const handlePayment = async () => {
    if (!intentData?.getPaymentIntent) {
      console.error("Payment intent data not available");
      toast.error("Payment details not available");
      return;
    }

    try {
      setPaymentStatus('processing');
      const intent = intentData.getPaymentIntent;
      
      console.log("Creating payment order for intent:", intent.id);

      console.log("Intent data available:", !!intentData?.getPaymentIntent);
console.log("Session user ID:", session?.user?.id);
console.log("Intent user ID:", intent.userId);
console.log("Intent total amount:", intent.totalAmount);
      
      // Create Razorpay order
      const { data: paymentOrderData } = await createPaymentOrder({
        variables: {
          input: {
            intentId: intent.id, // Use a temporary orderId 
            userId: session?.user?.id || intent.userId,
            amount: intent.totalAmount,
            currency: "INR",
            notes: {
              intentId: intent.id,
              // Add any other relevant info
            }
          }
        }
      });

      if (!paymentOrderData?.createPaymentOrder) {
        throw new Error("Failed to create payment order");
      }

      console.log("Payment order created:", paymentOrderData.createPaymentOrder);

      // Init Razorpay payment flow
      const options = {
        key: paymentOrderData.createPaymentOrder.key,
        amount: paymentOrderData.createPaymentOrder.amount * 100, // Amount in paise
        currency: paymentOrderData.createPaymentOrder.currency,
        name: "Ecoplaster",
        description: `Payment for Order`,
        order_id: paymentOrderData.createPaymentOrder.razorpayOrderId,
        prefill: {
          name: session?.user?.name || "",
          email: session?.user?.email || "",
          contact: intent.shippingAddress?.phoneNumber || "",
        },
        theme: {
          color: "#10b981", // Using the newgreensecond color
        },
        modal: {
          ondismiss: function() {
            console.log("Razorpay modal dismissed");
            setPaymentStatus('idle');
          },
        },
        handler: async function(response: any) {
          await handlePaymentSuccess(response);
        },
      };

      console.log("Initializing Razorpay with options:", options);

      if (!window.Razorpay) {
        console.error("Razorpay is not loaded!");
        toast.error("Payment gateway is not available. Please try again later.");
        setPaymentStatus('failed');
        return;
      }

      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', async function(response: any) {
        try {
          console.log("Payment failed response:", response.error);
          
          // Handle payment failure in backend
          await handlePaymentFailure({
            variables: {
              input: {
                razorpayOrderId: response.error.metadata.order_id,
                errorCode: response.error.code,
                errorDescription: response.error.description,
              }
            }
          });
          
          setPaymentStatus('failed');
          setErrorMessage(response.error.description || "Payment failed");
        } catch (error) {
          console.error("Error handling payment failure:", error);
          setPaymentStatus('failed');
          setErrorMessage("Payment failed");
        }
      });

      console.log("Opening Razorpay payment form...");
      razorpay.open();
    } catch (error) {
      console.error("Payment initiation error:", error);
      setPaymentStatus('failed');
      setErrorMessage(error instanceof Error ? error.message : "Failed to process payment");
    }
  };

  // Handle successful payment
  const handlePaymentSuccess = async (response: any) => {
    try {
      console.log("Payment success response:", response);
      
      // Verify payment and confirm order in one step
      const { data } = await verifyPaymentAndConfirmOrder({
        variables: {
          input: {
            intentId: intentId,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          }
        }
      });
      
      console.log("Verification and order confirmation result:", data);
      
      if (data?.verifyPaymentAndConfirmOrder?.success) {
        setPaymentStatus('success');
        toast.success("Payment successful!");
        
        // Clear cart after successful payment
        clearCart();
        
        // Save last order ID for reference
        if (typeof window !== 'undefined') {
          localStorage.setItem('lastOrderId', data.verifyPaymentAndConfirmOrder.orderId);
        }
        
        // Redirect to success page with the newly created order ID
        setTimeout(() => {
          router.push(`/payment/success?orderId=${data.verifyPaymentAndConfirmOrder.orderId}`);
        }, 2000);
      } else {
        throw new Error("Payment verification failed");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      setPaymentStatus('failed');
      setErrorMessage("Payment verification failed");
    }
  };

  if (intentLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-newgreensecond"></div>
      </div>
    );
  }

  if (intentError || !intentData?.getPaymentIntent) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h1 className="text-xl font-semibold text-gray-800 mb-2">Payment Session Not Found</h1>
        <p className="text-gray-600 mb-6">
          Your payment session may have expired or is invalid.
          {intentError && (
            <span className="block mt-2 text-red-500 text-sm">
              Error: {intentError.message}
            </span>
          )}
        </p>
        <button
          onClick={() => router.push('/checkout')}
          className="flex items-center text-white bg-newgreensecond px-6 py-2 rounded-md hover:bg-newgreen transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Return to Checkout
        </button>
      </div>
    );
  }

  const intent = intentData.getPaymentIntent;
  // Create a compatible order object for OrderSummary component
  const orderForSummary = {
    id: intent.id,
    products: intent.products.map((p:any) => ({ // <<< ERROR HAPPENS HERE
      ...p,
      name: p.name || `Product #${p.productId.slice(-6)}`, // Fallback name if missing
    })),
    shippingAddress: intent.shippingAddress,
    totalAmount: intent.totalAmount,
    status: intent.status
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center">
          <button 
            onClick={() => router.push('/checkout')}
            className="flex items-center text-black hover:text-newgreensecond"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Checkout
          </button>
          <h1 className="text-xl font-semibold text-black mx-auto">Payment</h1>
        </div>
      </div>

      {/* Payment Status Banner */}
      {paymentStatus !== 'idle' && (
        <PaymentStatusBanner 
          status={paymentStatus} 
          errorMessage={errorMessage}
          onRetry={() => setPaymentStatus('idle')}
        />
      )}

      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Left Section (Payment Methods) */}
        <div className="flex-grow">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-black mb-4 flex items-center">
              <CreditCard size={20} className="mr-2 text-newgreensecond" />
              Payment Methods
            </h2>
            
            <PaymentMethods 
              selectedMethod={paymentMethod}
              onSelectMethod={setPaymentMethod}
            />

            <div className="mt-8">
              <button
                onClick={handlePayment}
                disabled={!isRazorpayLoaded || creatingOrder || verifyingAndConfirming || paymentStatus === 'processing' || paymentStatus === 'success'}
                className={`w-full py-4 font-medium rounded-lg flex items-center justify-center gap-2
                  ${!isRazorpayLoaded || creatingOrder || verifyingAndConfirming || paymentStatus === 'processing' || paymentStatus === 'success'
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-newgreensecond text-white hover:bg-newgreen transition-colors'
                  }`}
              >
                {creatingOrder || verifyingAndConfirming || paymentStatus === 'processing' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  'Pay Now'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Section - Order Summary */}
        <div className="w-full md:w-96">
          <OrderSummary order={orderForSummary} />
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;