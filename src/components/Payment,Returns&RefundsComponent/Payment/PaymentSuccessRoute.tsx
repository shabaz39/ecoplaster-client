"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import PaymentSuccessPage from "@/components/Payment,Returns&RefundsComponent/Payment/PaymentSuccessPage";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

// LoadingSpinner (can be imported if needed)
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-newgreensecond"></div>
  </div>
);

const PaymentSuccessContent = () => {
  const searchParams = useSearchParams();
  const { status } = useSession();
  const router = useRouter();

  // Get orderId from URL parameters
  const orderId = searchParams.get("orderId");

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (!orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h1 className="text-xl font-semibold text-gray-800 mb-2">Order Information Missing</h1>
        <p className="text-gray-600 mb-6">
          No order information was found. Please check your orders in your dashboard.
        </p>
        <Link
          href="/userdashboard"
          className="flex items-center text-white bg-newgreensecond px-6 py-2 rounded-md hover:bg-newgreen transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return <PaymentSuccessPage orderId={orderId} />;
};

const PaymentSuccessRoute = () => {
  return <PaymentSuccessContent />;
};

export default PaymentSuccessRoute;
