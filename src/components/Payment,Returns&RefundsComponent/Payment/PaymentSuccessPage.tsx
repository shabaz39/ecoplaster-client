// Updated PaymentSuccessPage with promotion usage recording
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Home, Package, ArrowRight } from "lucide-react";
import { useLazyQuery, useMutation, gql } from "@apollo/client";
import { GET_PAYMENT_BY_ORDER_ID, GET_ORDER_BY_ID } from "../../../constants/queries/paymentQueries";
import { useSession } from 'next-auth/react';

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

interface PaymentSuccessPageProps {
  orderId: string;
}

const PaymentSuccessPage: React.FC<PaymentSuccessPageProps> = ({ orderId }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [countdown, setCountdown] = useState(5);

  // Promotion usage recording mutation
  const [recordPromotionUsage] = useMutation(RECORD_PROMOTION_USAGE, {
    onCompleted: () => {
      console.log('Promotion usage recorded successfully');
    },
    onError: (error) => {
      console.error('Error recording promotion usage:', error);
    }
  });

  // Record promotion usage if pending
  useEffect(() => {
    if (orderId && status === 'authenticated') {
      // Check if there's pending promotion usage to record
      const pendingPromotion = localStorage.getItem('pendingPromotionUsage');
      
      if (pendingPromotion) {
        try {
          const promotionData = JSON.parse(pendingPromotion);
          
          // Record the promotion usage
          recordPromotionUsage({
            variables: {
              promotionId: promotionData.promotionId,
              userId: promotionData.userId,
              orderId: orderId,
              discountApplied: promotionData.discountApplied,
              orderTotal: promotionData.orderTotal
            }
          }).then(() => {
            // Clear the pending promotion data after successful recording
            localStorage.removeItem('pendingPromotionUsage');
          }).catch((error) => {
            console.error('Failed to record promotion usage:', error);
            // Keep the data for potential retry later
          });
        } catch (error) {
          console.error('Error parsing pending promotion data:', error);
          localStorage.removeItem('pendingPromotionUsage');
        }
      }
    }
  }, [orderId, status, recordPromotionUsage]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-newgreensecond"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-4">
            Please log in to view your payment details.
          </p>
          <button
            onClick={() => router.push("/auth/signin?callbackUrl=" + encodeURIComponent(`/payment/success?orderId=${orderId}`))}
            className="w-full bg-newgreensecond text-white py-2 rounded-md hover:bg-newgreen"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const getStatusDisplay = (status:string) => {
    // Normalize the status to handle both uppercase and lowercase
    const normalizedStatus = status?.toLowerCase();
    
    if (normalizedStatus === 'captured' || normalizedStatus === 'created' || 
        normalizedStatus === 'authorized' || normalizedStatus === 'refunded' || 
        normalizedStatus === 'failed') {
      return normalizedStatus;
    }
    
    return 'Unknown';
  };

  // Fetch payment details
  const [getPaymentDetails, { data: paymentData, loading: paymentLoading, error: paymentError }] = useLazyQuery(
    GET_PAYMENT_BY_ORDER_ID,
    {
      variables: { orderId },
      fetchPolicy: "network-only",
    }
  );

  // Fetch order details
  const [getOrderDetails, { data: orderData, loading: orderLoading, error: orderError }] = useLazyQuery(
    GET_ORDER_BY_ID,
    {
      variables: { id: orderId },
      fetchPolicy: "network-only",
    }
  );

  useEffect(() => {
    if (orderId) {
      getPaymentDetails();
      getOrderDetails();
    }
  }, [orderId, getPaymentDetails, getOrderDetails]);

  useEffect(() => {
    // Auto redirect to orders page after countdown
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      router.push("/userdashboard");
    }
  }, [countdown, router]);

  useEffect(() => {
    if (paymentData?.getPaymentByOrderId) {
      setPaymentDetails(paymentData.getPaymentByOrderId);
    }
    
    if (orderData?.getOrder) {
      setOrderDetails(orderData.getOrder);
    }
  }, [paymentData, orderData]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (paymentLoading || orderLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-newgreensecond"></div>
      </div>
    );
  }

  if (paymentError || orderError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error Loading Details</h2>
          <p className="text-gray-600 mb-4">
            {paymentError?.message || orderError?.message || "Failed to load payment or order details."}
          </p>
          <button
            onClick={() => router.push("/userdashboard")}
            className="w-full bg-newgreensecond text-white py-2 rounded-md hover:bg-newgreen"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Payment Successful!</h1>
          <p className="text-gray-600 mt-2">
            Thank you for your order. Your payment has been processed successfully.
          </p>
        </div>

        {(paymentDetails || orderDetails) && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-sm font-medium text-gray-500 mb-2">Order Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-medium text-gray-800">{orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium text-gray-800">
                    {paymentDetails?.createdAt ? formatDate(paymentDetails.createdAt) : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-medium text-gray-800">
                    ₹{orderDetails?.totalAmount?.toLocaleString() || paymentDetails?.amount?.toLocaleString() || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium text-gray-800 capitalize">
                  {paymentDetails?.status ? getStatusDisplay(paymentDetails.status) : 'Unknown'}
                  </p>
                </div>
                {paymentDetails?.razorpayPaymentId && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Transaction ID</p>
                    <p className="font-medium text-gray-800 break-words">
                      {paymentDetails.razorpayPaymentId}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t pt-6 space-y-4">
              <p className="text-center text-gray-600">
                Redirecting to your dashboard in {countdown} seconds...
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push("/")}
                  className="flex items-center justify-center gap-2 px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  <Home size={16} />
                  Back to Home
                </button>
                <button
                  onClick={() => router.push("/userdashboard")}
                  className="flex items-center justify-center gap-2 px-6 py-2 bg-newgreensecond text-white rounded-md hover:bg-newgreen"
                >
                  <Package size={16} />
                  View My Orders
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccessPage;