'use client';

import UserDashboard from '../../components/UserDashboardComponenets/UserDashboard'
import ProtectedRoute from '@/components/ProtectedRoute';

const UserDashboardPage = () => {
  return (
    <ProtectedRoute allowedRoles={['user', 'admin']}>
      <UserDashboard />
    </ProtectedRoute>
  );
};

export default UserDashboardPage;
