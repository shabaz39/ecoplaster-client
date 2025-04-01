"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../../context/CartContext";
import { useMutation, useLazyQuery } from "@apollo/client";
import { 
  CREATE_PAYMENT_ORDER, 
  VERIFY_PAYMENT, 
  HANDLE_PAYMENT_FAILURE,
  GET_ORDER_BY_ID 
} from "../../../constants/queries/paymentQueries";
import { OrderSummary } from "./OrderSummary";
import { PaymentStatusBanner } from "./PaymentStatusBanner";
import { PaymentMethods } from "./PaymentMethods";
import { ArrowLeft, CreditCard, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentPageProps {
  orderId: string;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ orderId }) => {
  const router = useRouter();
  const { clearCart } = useCart();
  const { data: session } = useSession();
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

  console.log("PaymentPage initialized with orderId:", orderId);
  console.log("Session data:", session);

  // Get order details
  const [getOrderDetails, { data: orderData, loading: orderLoading, error: orderError }] = useLazyQuery(
    GET_ORDER_BY_ID, 
    { 
      variables: { id: orderId },  // <-- Use id instead of getOrderId
      fetchPolicy: "network-only",
      onCompleted: (data) => {
        console.log("Order data successfully retrieved:", data);
         // Log the entire response to see the structure
      console.log("Full GraphQL response:", data);
      },
      onError: (error) => {
        console.error("Error fetching order:", error);
        console.error("Error details:", error.graphQLErrors, error.networkError);
        if (error.networkError) {
          console.error("Network error details:", error.networkError);
        }
        // Check server response if available
        if (error.networkError && 'result' in error.networkError) {
          console.error("Server error response:", error.networkError.result);
        }
      }
    }
  );

  // Create payment order mutation
  const [createPaymentOrder, { loading: creatingOrder }] = useMutation(CREATE_PAYMENT_ORDER, {
    onCompleted: (data) => {
      console.log("Payment order created successfully:", data);
    },
    onError: (error) => {
      console.error("Error creating payment order:", error);
      console.error("Error details:", error.graphQLErrors, error.networkError);
    }
  });

  // Verify payment mutation
  const [verifyPayment] = useMutation(VERIFY_PAYMENT);

  // Handle payment failure mutation
  const [handlePaymentFailure] = useMutation(HANDLE_PAYMENT_FAILURE);

  

  useEffect(() => {
    console.log("Loading order details for ID:", orderId);
    
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

    // Get order details when component mounts
    if (orderId) {
      getOrderDetails({ variables: { id: orderId } });
    } else {
      console.error("No orderId provided to payment page");
    }

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
  }, [getOrderDetails, orderId]);

  // Handle order creation and payment initiation
  const handlePayment = async () => {
    if (!orderData?.getOrder) {
      console.error("Order data not available:", orderData);
      toast.error("Order details not available");
      return;
    }

    try {
      setPaymentStatus('processing');
      const order = orderData.getOrder;
      
      console.log("Creating payment order for:", order.id);
    console.log("Order details:", JSON.stringify(order, null, 2));
    console.log("Session user ID:", session?.user?.id);
      
      // Create payment order
      const { data: paymentOrderData } = await createPaymentOrder({
        variables: {
          input: {
            orderId: order.id,
            userId: session?.user?.id || order.userId,
            amount: order.totalAmount,
            currency: "INR",
            notes: {
              orderItems: JSON.stringify(order.products.map((p: any) => ({ 
                id: p.productId, 
                name: p.name,
                quantity: p.quantity 
              }))),
            }
          }
        }
      });

      if (!paymentOrderData?.createPaymentOrder) {
        throw new Error("Failed to create payment order");
      }

      console.log("Payment order created:", paymentOrderData.createPaymentOrder);
      console.log("Razorpay key:", paymentOrderData.createPaymentOrder.key);

      // Init Razorpay payment flow
      const options = {
        key: paymentOrderData.createPaymentOrder.key,
        amount: paymentOrderData.createPaymentOrder.amount * 100, // Amount in paise
        currency: paymentOrderData.createPaymentOrder.currency,
        name: "Ecoplaster",
        description: `Payment for Order #${order.id}`,
        order_id: paymentOrderData.createPaymentOrder.razorpayOrderId,
        prefill: {
          name: order.shippingAddress?.name || "",
          email: session?.user?.email || "",
          contact: order.shippingAddress?.phoneNumber || "",
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
          try {
            console.log("Payment success response:", response);
            
            // Verify payment with backend
            const result = await verifyPayment({
              variables: {
                input: {
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }
              }
            });
            
            console.log("Verification result:", JSON.stringify(result, null, 2));
            
            if (result.data && result.data.verifyPayment) {
              setPaymentStatus('success');
              toast.success("Payment successful!");
              // Clear cart after successful payment
              clearCart();
              // Redirect to success page
              setTimeout(() => {
                router.push(`/payment/success?orderId=${order.id}`);
              }, 2000);
            } else {
              console.error("Verification data is missing:", result);
              throw new Error("Payment verification failed");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            setPaymentStatus('failed');
            setErrorMessage("Payment verification failed");
          }
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

  if (orderLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-newgreensecond"></div>
      </div>
    );
  }

  if (orderError || !orderData?.getOrder) {
     
    
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h1 className="text-xl font-semibold text-gray-800 mb-2">Order Not Found</h1>
        <p className="text-gray-600 mb-6">
          We couldn't find the order details.
          {orderError && (
            <span className="block mt-2 text-red-500 text-sm">
              Error: {orderError.message}
            </span>
          )}
        </p>
        <button
          onClick={() => router.back()}
          className="flex items-center text-white bg-newgreensecond px-6 py-2 rounded-md hover:bg-newgreen transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Go Back
        </button>
      </div>
    );
  }

  const order = orderData.getOrder;
  console.log("Order details ready for rendering:", order);

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
                disabled={!isRazorpayLoaded || creatingOrder || paymentStatus === 'processing' || paymentStatus === 'success'}
                className={`w-full py-4 font-medium rounded-lg flex items-center justify-center gap-2
                  ${!isRazorpayLoaded || creatingOrder || paymentStatus === 'processing' || paymentStatus === 'success'
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-newgreensecond text-white hover:bg-newgreen transition-colors'
                  }`}
              >
                {creatingOrder || paymentStatus === 'processing' ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
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
          <OrderSummary order={order} />
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;