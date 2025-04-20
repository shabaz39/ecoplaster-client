// components/AdminDashboard/UserManagement/EditUserModal.tsx
import React from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_USER } from '@/constants/mutations/userMutations';

interface EditUserModalProps {
  user: any;
  onClose: () => void;
  onSuccess: () => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose, onSuccess }) => {
  const [editingUser, setEditingUser] = React.useState(user);
  const [updateUser] = useMutation(UPDATE_USER);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser({
        variables: {
          updateUserId: editingUser.id,  // Change id to updateUserId
          name: editingUser.name,
          email: editingUser.email,
          phoneNumber: editingUser.phoneNumber,
          role: editingUser.role,  // Note: role is not in the mutation definition
          preferences: {
            notifications: editingUser.preferences.notifications,
            marketingEmails: editingUser.preferences.marketingEmails
          }
        }
      });
      onSuccess();
      onClose();
      alert('User updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-productNameColor">Edit User</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-productNameColor font-medium mb-1">Name</label>
              <input
                type="text"
                value={editingUser.name}
                onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-productNameColor font-medium mb-1">Email</label>
              <input
                type="email"
                value={editingUser.email}
                onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-productNameColor font-medium mb-1">Phone Number</label>
              <input
                type="tel"
                value={editingUser.phoneNumber}
                onChange={(e) => setEditingUser({...editingUser, phoneNumber: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-productNameColor font-medium mb-1">Role</label>
              <select
                value={editingUser.role}
                onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                className="w-full p-2 border rounded"
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
                <option value="Dealer">Dealer</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-productNameColor">Preferences</h4>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingUser.preferences?.notifications}
                  onChange={(e) => setEditingUser({
                    ...editingUser,
                    preferences: {
                      ...editingUser.preferences,
                      notifications: e.target.checked
                    }
                  })}
                  className="form-checkbox text-greenComponent"
                />
                <span className="text-gray-700">Notifications</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingUser.preferences?.marketingEmails}
                  onChange={(e) => setEditingUser({
                    ...editingUser,
                    preferences: {
                      ...editingUser.preferences,
                      marketingEmails: e.target.checked
                    }
                  })}
                  className="form-checkbox text-greenComponent"
                />
                <span className="text-gray-700">Marketing Emails</span>
              </label>
            </div>
          </div>

          <div className="flex gap-2 justify-end mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-greenComponent text-white rounded hover:bg-newgreen"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;