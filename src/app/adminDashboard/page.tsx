'use client';

import AdminDashboard from '@/components/AdminDashboardComponents/AdminDashboard';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useSession } from 'next-auth/react';

const AdminDashboardPage = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-newgreensecond border-t-transparent"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminDashboard />
    </ProtectedRoute>
  );
};

export default AdminDashboardPage;