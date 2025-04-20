// components/AdminDashboard/UserManagement/UserList.tsx
import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_USERS_SIMPLE, UPDATE_USER, UPDATE_WALLET } from '@/constants/mutations/userMutations';
import LoadingSpinner from '../Common/LoadingSpinner';
import UserForm from './UserForm';
import EditUserModal from './EditUserModal';

const UserList = () => {
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

 
  const { data: usersData, loading: usersLoading, error: usersError, refetch } = useQuery(GET_ALL_USERS_SIMPLE, {
    onCompleted: (data) => {
      console.log('Users data received:', data);
    },
    onError: (error) => {
      console.error('Error fetching users:', error);
    },
    fetchPolicy: 'network-only' // Ensure fresh data
  });
  const [updateUser] = useMutation(UPDATE_USER);
  const [updateWallet] = useMutation(UPDATE_WALLET);

  const handleToggleUserStatus = async (id: string, newStatus: boolean) => {
    try {
      await updateUser({
        variables: {
          updateUserId: id,
          isActive: newStatus  // Direct property, not wrapped in 'updates'
        }
      });
      refetch();
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Failed to update user status');
    }
  };

  const handleUpdateWallet = async (id: string) => {
    const amount = prompt('Enter amount to add/subtract from wallet:');
    if (amount === null) return;
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) {
      alert('Please enter a valid number');
      return;
    }

    try {
      await updateWallet({
        variables: {
          updateWalletId: id,  // Changed from id to updateWalletId
          amount: numAmount
        }
      });
      refetch();
    } catch (error) {
      console.error('Error updating wallet:', error);
      alert('Failed to update wallet');
    }
  };
  console.log('Current users data:', usersData);
  if (usersLoading) return <LoadingSpinner />;
  if (usersError) return <div className="p-4 text-red-600">Error loading users: {usersError.message}</div>;
  if (!usersData?.getAllUsers?.length) return <div className="p-4">No users found. Add a new user to get started.</div>;
  if (usersLoading) return <LoadingSpinner />;

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-productNameColor">User Management</h3>
        <button 
          onClick={() => setShowNewUserForm(!showNewUserForm)}
          className="bg-greenComponent text-white px-4 py-2 rounded hover:bg-newgreen transition-colors"
        >
          {showNewUserForm ? "Close Form" : "Add New User"}
        </button>
      </div>

      {showNewUserForm && (
        <UserForm 
          onClose={() => setShowNewUserForm(false)}
          onSuccess={refetch}
        />
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-beige">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-productNameColor uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-productNameColor uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-productNameColor uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-productNameColor uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-productNameColor uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-productNameColor uppercase">Wallet</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-productNameColor uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usersData?.getAllUsers?.map((user: any) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-gray-900">{user.email}</span>
                    {user.emailVerified && (
                      <span className="ml-2 text-greenText">✓</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-gray-900">{user.phoneNumber}</span>
                    {user.phoneVerified && (
                      <span className="ml-2 text-greenText">✓</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.role === 'Admin' ? 'bg-newbeige text-searchBeige' : 'bg-cream text-greenText'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.isActive ? 'bg-cream text-greenText' : 'bg-newbeige text-searchBeige'
                  }`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                  {user.accountLocked && (
                    <span className="ml-2 px-2 py-1 text-xs rounded-full bg-beige text-searchBeige">
                      Locked
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-gray-900">{user.walletCoins || 0}</span>
                    <button
                      onClick={() => handleUpdateWallet(user.id)}
                      className="ml-2 text-greenComponent hover:text-newgreen"
                    >
                      <span>💰</span>
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setShowEditModal(true);
                    }}
                    className="text-greenComponent hover:text-newgreen mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleUserStatus(user.id, !user.isActive)}
                    className={`${
                      user.isActive ? 'text-searchBeige' : 'text-greenText'
                    } hover:text-newgreen`}
                  >
                    {user.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onSuccess={refetch}
        />
      )}
    </section>
  );
};

export default UserList;