"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import PaymentPage from "../../components/Payment,Returns&RefundsComponent/Payment/PaymentPageComponents";
import ProtectedRoute from "../../components/ProtectedRoute";

const PaymentRoute = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full text-center">
          <h1 className="text-xl font-semibold text-red-600 mb-2">Missing Order Information</h1>
          <p className="text-gray-600 mb-4">
            No order ID was provided. Please return to checkout and try again.
          </p>
          <a
            href="/checkout"
            className="inline-block px-6 py-2 bg-newgreensecond text-white rounded-md hover:bg-newgreen transition-colors"
          >
            Return to Checkout
          </a>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["User", "Admin"]}>
    <PaymentPage orderId={orderId} />
  </ProtectedRoute>
  );
};

export default PaymentRoute;