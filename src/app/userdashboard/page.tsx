'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import UserDashboard from '@/components/UserDashboardComponenets/UserDashboard';
import Navbar from '@/components/HomepageComponents/Navbar';
import Footer from '@/components/HomepageComponents/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';

const UserDashboardPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Show loading state while session is being fetched
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-newgreensecond border-t-transparent"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['user', 'admin']}>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <UserDashboard />
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default UserDashboardPage;