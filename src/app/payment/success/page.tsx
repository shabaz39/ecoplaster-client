"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import PaymentSuccessPage from "../../../components/Payment,Returns&RefundsComponent/Payment/PaymentSuccessPage";
import ProtectedRoute from "../../../components/ProtectedRoute";

const PaymentSuccessRoute = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full text-center">
          <h1 className="text-xl font-semibold text-gray-800 mb-2">Payment Completed</h1>
          <p className="text-gray-600 mb-4">
            Your payment has been processed, but order details are not available.
          </p>
          <a
            href="/userdashboard"
            className="inline-block px-6 py-2 bg-newgreensecond text-white rounded-md hover:bg-newgreen transition-colors"
          >
            View My Orders
          </a>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["user", "admin"]}>
    <PaymentSuccessPage orderId={orderId} />
  </ProtectedRoute>
  );
};

export default PaymentSuccessRoute;