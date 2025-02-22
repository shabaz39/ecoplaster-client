import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_USER } from '@/constants/mutations/userMutations';

interface UserFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ onClose, onSuccess }) => {
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);

  const [createUser, { loading: createUserLoading }] = useMutation(CREATE_USER, {
    onCompleted: () => {
      onSuccess();
      onClose();
    },
    onError: (error) => {
      console.error('Error creating user:', error);
      setError(error.message || 'Failed to create user');
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!newUser.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!newUser.email.trim() || !/\S+@\S+\.\S+/.test(newUser.email)) {
      setError('Valid email is required');
      return;
    }
    if (!newUser.phoneNumber.trim()) {
      setError('Phone number is required');
      return;
    }
    if (newUser.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      await createUser({
        variables: {
          name: newUser.name.trim(),
          email: newUser.email.trim(),
          phoneNumber: newUser.phoneNumber.trim(),
          password: newUser.password
        }
      });
    } catch (err) {
      console.error('Submission error:', err);
    }
  };

  return (
    <div className="bg-cream p-6 rounded-lg shadow-sm mb-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-productNameColor font-medium mb-1">Name</label>
          <input
            type="text"
            value={newUser.name}
            onChange={(e) => setNewUser({...newUser, name: e.target.value})}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-greenComponent"
            required
            placeholder="Enter full name"
          />
        </div>
        <div>
          <label className="block text-productNameColor font-medium mb-1">Email</label>
          <input
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-greenComponent"
            required
            placeholder="Enter email address"
          />
        </div>
        <div>
          <label className="block text-productNameColor font-medium mb-1">Phone Number</label>
          <input
            type="tel"
            value={newUser.phoneNumber}
            onChange={(e) => setNewUser({...newUser, phoneNumber: e.target.value})}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-greenComponent"
            required
            placeholder="Enter phone number"
          />
        </div>
        <div>
          <label className="block text-productNameColor font-medium mb-1">Password</label>
          <input
            type="password"
            value={newUser.password}
            onChange={(e) => setNewUser({...newUser, password: e.target.value})}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-greenComponent"
            required
            placeholder="Create a strong password"
            minLength={6}
          />
        </div>
        <div className="flex justify-between items-center">
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="bg-greenComponent text-white px-4 py-2 rounded hover:bg-newgreen transition-colors"
            disabled={createUserLoading}
          >
            {createUserLoading ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;