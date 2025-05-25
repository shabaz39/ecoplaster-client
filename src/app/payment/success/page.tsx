// /app/payment/success/page.tsx

"use client";
import React, { Suspense } from "react";
import PaymentSuccessRoute from "@/components/Payment,Returns&RefundsComponent/Payment/PaymentSuccessRoute";

// Optionally extract LoadingSpinner to its own file/component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-newgreensecond"></div>
  </div>
);

export default function PaymentSuccessPageRoute() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PaymentSuccessRoute />
    </Suspense>
  );
}
