"use client";

import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PaymentPage from "../../components/Payment,Returns&RefundsComponent/Payment/PaymentPageComponents";
import ProtectedRoute from "../../components/ProtectedRoute";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useQuery } from "@apollo/client";
import { 
  GET_PAYMENT_INTENT
} from "@/constants/queries/paymentIntentQueries";

const PaymentRoute = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { status } = useSession();
  
  // Support both intentId (new) and orderId (legacy)
  const intentId = searchParams.get("intentId");
  const orderId = searchParams.get("orderId");

  const { data: intentData } = useQuery(GET_PAYMENT_INTENT, {
    variables: { id: intentId }
  });
  
  useEffect(() => {
    // If loading is complete and user is not authenticated, redirect to login
    if (status === 'unauthenticated') {
      const returnUrl = intentId 
        ? `/payment?intentId=${intentId}` 
        : `/payment?orderId=${orderId || ''}`;
      
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(returnUrl)}`);
      return;
    }
    
    // If there's no intentId or orderId in the URL, check localStorage
    if (!intentId && !orderId && typeof window !== 'undefined' && status === 'authenticated') {
      const storedOrderId = localStorage.getItem('lastOrderId');
      if (storedOrderId) {
        console.log("Using stored orderId:", storedOrderId);
        router.replace(`/payment?orderId=${storedOrderId}`);
      }
    }
  }, [intentId, orderId, router, status]);
  
  // Show loading state while checking session
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-newgreensecond"></div>
      </div>
    );
  }
  
  // Show "missing payment info" UI if no intentId/orderId is found
  if (!intentId && !orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full text-center">
          <h1 className="text-xl font-semibold text-red-600 mb-2">Missing Payment Information</h1>
          <p className="text-gray-600 mb-4">
            No payment session was found. Please return to checkout and try again.
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
  
  // If we have payment info and the user is authenticated, show the protected payment page
  return (
    <ProtectedRoute allowedRoles={["user", "admin"]}>
      {intentId ? (
        <PaymentPage intentId={intentId} />
      ) : (
        // For backward compatibility - pass the orderId but use type assertion
        // This is a temporary solution until you fully migrate to intentId
        <PaymentPage intentId={orderId as string} />
      )}
    </ProtectedRoute>
  );
};

export default PaymentRoute;