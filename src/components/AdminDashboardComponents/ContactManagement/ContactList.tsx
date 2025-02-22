// components/AdminDashboard/ContactManagement/ContactList.tsx
import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import LoadingSpinner from '../Common/LoadingSpinner';

// Define ContactStatus enum to match backend expectations
enum ContactStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'inProgress',
  RESOLVED = 'resolved'
}

interface Contact {
  id: string;
  name: string;
  email: string;
  mobile: string;
  category: string;
  description: string;
  status: ContactStatus;
  createdAt: string;
  updatedAt: string;
}

interface ContactListProps {
  contacts: Contact[];
  loading: boolean;
}

const UPDATE_CONTACT_STATUS = gql`
  mutation UpdateContactStatus($updateContactStatusId: ID!, $status: ContactStatus!) {
    updateContactStatus(id: $updateContactStatusId, status: $status) {
      id
      name
      email
      mobile
      category
      description
      status
      createdAt
      updatedAt
    }
  }
`;

// Add getCategoryColor function to resolve the TypeScript error
const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'support':
      return 'text-blue-600';
    case 'sales':
      return 'text-green-600';
    case 'billing':
      return 'text-purple-600';
    case 'feedback':
      return 'text-orange-600';
    default:
      return 'text-gray-600';
  }
};

const ContactList: React.FC<ContactListProps> = ({ contacts, loading }) => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [updateStatus] = useMutation(UPDATE_CONTACT_STATUS, {
    refetchQueries: ['GetContacts']
  });

  const handleStatusUpdate = async (id: string, newStatus: ContactStatus) => {
    try {
      console.log('Updating status with:', {
        id,
        newStatus,
        variables: {
          updateContactStatusId: id,
          status: newStatus
        }
      });

      const result = await updateStatus({
        variables: {
          updateContactStatusId: id,
          status: newStatus
        }
      });

      console.log('Update result:', result);
    } catch (error: any) {
      console.error('Error updating contact status:', {
        error,
        message: error.message,
        graphQLErrors: error.graphQLErrors,
        networkError: error.networkError
      });
      alert('Failed to update contact status: ' + error.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-beige text-searchBeige';
      case 'RESOLVED':
        return 'bg-cream text-greenText';
      case 'IN_PROGRESS':
        return 'bg-lightgreen text-newgreen';
      default:
        return 'bg-newbeige text-searchBeige';
    }
  };

  // Helper function to format dates safely
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.log('Invalid date string:', dateString);
        return 'Invalid date';
      }
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  console.log('Received contacts:', contacts);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-productNameColor">Contact Messages</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contacts.map((contact) => (
          <div 
            key={contact.id}
            className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-productNameColor">{contact.name}</h4>
                <div className="text-sm text-gray-600">
                  <p>{contact.email}</p>
                  <p>{contact.mobile}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(contact.status)}`}>
                  {contact.status}
                </span>
                <span className={`text-xs font-medium ${getCategoryColor(contact.category)}`}>
                  {contact.category}
                </span>
              </div>
            </div>

            <p className="text-gray-700 mb-4 line-clamp-3">{contact.description}</p>

            <div className="flex justify-between items-center text-xs text-gray-500 border-t border-gray-100 pt-3">
              <span>
                {formatDate(contact.createdAt)}
              </span>
              <div className="flex gap-2">
                <select
                  value={contact.status}
                  onChange={(e) => handleStatusUpdate(contact.id, e.target.value as ContactStatus)}
                  className="text-xs p-1 rounded border border-gray-200 bg-white"
                >
                  <option value={ContactStatus.PENDING}>Pending</option>
                  <option value={ContactStatus.IN_PROGRESS}>In Progress</option>
                  <option value={ContactStatus.RESOLVED}>Resolved</option>
                </select>
                <button
                  onClick={() => setSelectedContact(contact)}
                  className="text-greenComponent hover:text-newgreen transition-colors"
                >
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-productNameColor">{selectedContact.name}</h3>
                <p className="text-gray-600">{selectedContact.email}</p>
                <p className="text-gray-600">{selectedContact.mobile}</p>
              </div>
              <button 
                onClick={() => setSelectedContact(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <span className={`inline-block px-3 py-1 text-xs rounded-full ${getStatusColor(selectedContact.status)} mb-2`}>
                {selectedContact.status}
              </span>
              <span className={`ml-2 text-xs font-medium ${getCategoryColor(selectedContact.category)}`}>
                {selectedContact.category}
              </span>
            </div>

            <div className="bg-beige bg-opacity-10 rounded-lg p-4 mb-4">
              <p className="text-gray-700 whitespace-pre-wrap">{selectedContact.description}</p>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-500">
              <div>
                <p>Created: {formatDate(selectedContact.createdAt)}</p>
                <p>Updated: {formatDate(selectedContact.updatedAt)}</p>
              </div>
              <select
                value={selectedContact.status}
                onChange={(e) => handleStatusUpdate(selectedContact.id, e.target.value as ContactStatus)}
                className="p-2 rounded border border-gray-200 bg-white"
              >
                <option value={ContactStatus.PENDING}>Pending</option>
                <option value={ContactStatus.IN_PROGRESS}>In Progress</option>
                <option value={ContactStatus.RESOLVED}>Resolved</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {contacts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No contact messages found.
        </div>
      )}
    </div>
  );
};

export default ContactList;