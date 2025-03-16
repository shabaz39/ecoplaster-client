// File: ecoplaster-client/src/app/adminDashboard/orders/page.tsx
'use client';

import OrdersPageComponent from '@/components/AdminDashboardComponents/OrderManagement/OrdersPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useSession } from 'next-auth/react';

const OrdersPage = () => {
  const { data: session, status } = useSession();
  
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen text-black">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-newgreensecond border-t-transparent"></div>
      </div>
    );
  }
  
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <OrdersPageComponent />
    </ProtectedRoute>
  );
};

export default OrdersPage;