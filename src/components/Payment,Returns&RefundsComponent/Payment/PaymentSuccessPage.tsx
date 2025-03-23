"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Home, Package, ArrowRight } from "lucide-react";
import { useLazyQuery } from "@apollo/client";
import { GET_PAYMENT_BY_ORDER_ID } from "../../../constants/queries/paymentQueries";

interface PaymentSuccessPageProps {
  orderId: string;
}

const PaymentSuccessPage: React.FC<PaymentSuccessPageProps> = ({ orderId }) => {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [countdown, setCountdown] = useState(5);

  // Fetch payment details
  const [getPaymentDetails, { data, loading, error }] = useLazyQuery(
    GET_PAYMENT_BY_ORDER_ID,
    {
      variables: { orderId },
      fetchPolicy: "network-only",
    }
  );

  useEffect(() => {
    if (orderId) {
      getPaymentDetails();
    }
  }, [orderId, getPaymentDetails]);

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
    if (data?.getPaymentByOrderId) {
      setOrderDetails(data.getPaymentByOrderId);
    }
  }, [data]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-newgreensecond"></div>
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

        {orderDetails && (
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
                    {formatDate(orderDetails.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-medium text-gray-800">
                    ₹{orderDetails.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium text-gray-800 capitalize">
                    {orderDetails.paymentMethod || "Online"}
                  </p>
                </div>
                {orderDetails.razorpayPaymentId && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Transaction ID</p>
                    <p className="font-medium text-gray-800">
                      {orderDetails.razorpayPaymentId}
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