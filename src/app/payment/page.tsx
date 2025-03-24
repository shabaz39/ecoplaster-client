"use client";

import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PaymentPage from "../../components/Payment,Returns&RefundsComponent/Payment/PaymentPageComponents";
import ProtectedRoute from "../../components/ProtectedRoute";
import Link from "next/link";
import { useSession } from "next-auth/react";

const PaymentRoute = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { status } = useSession();
  const orderId = searchParams.get("orderId");
  
  useEffect(() => {
    // If loading is complete and user is not authenticated, redirect to login
    if (status === 'unauthenticated') {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(`/payment?orderId=${orderId || ''}`)}`);
      return;
    }
    
    // If there's no orderId in the URL but one in localStorage, use that
    if (!orderId && typeof window !== 'undefined' && status === 'authenticated') {
      const storedOrderId = localStorage.getItem('lastOrderId');
      if (storedOrderId) {
        console.log("Using stored orderId:", storedOrderId);
        router.replace(`/payment?orderId=${storedOrderId}`);
      }
    }
  }, [orderId, router, status]);
  
  // Show loading state while checking session
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-newgreensecond"></div>
      </div>
    );
  }
  
  // Show "missing order" UI if no orderId is found
  if (!orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full text-center">
          <h1 className="text-xl font-semibold text-red-600 mb-2">Missing Order Information</h1>
          <p className="text-gray-600 mb-4">
            No order ID was provided. Please return to checkout and try again.
          </p>
          <Link
            href="/checkout"
            className="inline-block px-6 py-2 bg-newgreensecond text-white rounded-md hover:bg-newgreen transition-colors"
          >
            Return to Checkout
          </Link>
        </div>
      </div>
    );
  }
  
  // If we have an orderId and the user is authenticated, show the protected payment page
  return (
    <ProtectedRoute allowedRoles={["user", "admin"]}>
      <PaymentPage orderId={orderId} />
    </ProtectedRoute>
  );
};

export default PaymentRoute;