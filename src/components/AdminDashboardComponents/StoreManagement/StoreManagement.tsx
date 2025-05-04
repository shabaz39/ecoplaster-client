// ecoplaster-client/src/components/AdminDashboardComponents/StoreManagement/StoreManagement.tsx
'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { 
  GET_ALL_STORES, 
  CREATE_STORE, 
  UPDATE_STORE, 
  DELETE_STORE, 
  TOGGLE_STORE_STATUS 
} from '@/constants/queries/storeQueries';
import LoadingSpinner from '../Common/LoadingSpinner';
import StoreList from './StoreList';
import StoreForm from './StoreForm';
import ConfirmationModal from '../Common/ConfirmationModal';
import { toast } from 'react-toastify';

interface Store {
  id: string;
  city: string;
  storeCount: number;
  address: string;
  phoneNumber: string;
  email?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  iconUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const StoreManagement: React.FC = () => {
  // State management
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all stores
  const { data, loading, error, refetch } = useQuery(GET_ALL_STORES);

  // Define mutations
  const [createStore, { loading: createLoading }] = useMutation(CREATE_STORE, {
    onCompleted: () => {
      toast.success('Store created successfully');
      setIsFormOpen(false);
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to create store: ${error.message}`);
    }
  });

  const [updateStore, { loading: updateLoading }] = useMutation(UPDATE_STORE, {
    onCompleted: () => {
      toast.success('Store updated successfully');
      setIsFormOpen(false);
      setSelectedStore(null);
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to update store: ${error.message}`);
    }
  });

  const [deleteStore, { loading: deleteLoading }] = useMutation(DELETE_STORE, {
    onCompleted: () => {
      toast.success('Store deleted successfully');
      setIsDeleteModalOpen(false);
      setSelectedStore(null);
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to delete store: ${error.message}`);
    }
  });

  const [toggleStoreStatus] = useMutation(TOGGLE_STORE_STATUS, {
    onCompleted: (data) => {
      const status = data.toggleStoreStatus.isActive ? 'activated' : 'deactivated';
      toast.success(`Store ${status} successfully`);
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to update store status: ${error.message}`);
    }
  });

  // Handler functions
  const handleCreateStore = async (storeData: any) => {
    try {
      await createStore({
        variables: { input: storeData }
      });
    } catch (error) {
      console.error('Error creating store:', error);
    }
  };

  const handleUpdateStore = async (storeData: any) => {
    if (!selectedStore) return;
    
    try {
      await updateStore({
        variables: {
          id: selectedStore.id,
          input: storeData
        }
      });
    } catch (error) {
      console.error('Error updating store:', error);
    }
  };

  const handleDeleteStore = async () => {
    if (!selectedStore) return;
    
    try {
      await deleteStore({
        variables: { id: selectedStore.id }
      });
    } catch (error) {
      console.error('Error deleting store:', error);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleStoreStatus({
        variables: { id }
      });
    } catch (error) {
      console.error('Error toggling store status:', error);
    }
  };

  // Filter stores based on search term
  const filteredStores = data?.getAllStores?.filter((store: Store) => {
    if (!searchTerm) return true;
    
    const term = searchTerm.toLowerCase();
    return (
      store.city.toLowerCase().includes(term) ||
      store.address.toLowerCase().includes(term) ||
      store.phoneNumber.includes(term) ||
      (store.email && store.email.toLowerCase().includes(term))
    );
  }) || [];

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-600">Error loading stores: {error.message}</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-productNameColor">Store Locations Management</h2>
        <button
          onClick={() => {
            setSelectedStore(null);
            setIsFormOpen(!isFormOpen);
          }}
          className="bg-greenComponent text-white px-4 py-2 rounded hover:bg-newgreen transition-colors"
        >
          {isFormOpen ? "Cancel" : "Add New Store"}
        </button>
      </div>

      {isFormOpen && (
        <div className="mb-6 bg-cream p-4 rounded-lg">
          <StoreForm
            initialData={selectedStore}
            onSubmit={selectedStore ? handleUpdateStore : handleCreateStore}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedStore(null);
            }}
            isLoading={createLoading || updateLoading}
          />
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by city, address, or contact..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-greenComponent"
        />
      </div>

      <StoreList
        stores={filteredStores}
        onEdit={(store:any) => {
          setSelectedStore(store);
          setIsFormOpen(true);
        }}
        onDelete={(store:any) => {
          setSelectedStore(store);
          setIsDeleteModalOpen(true);
        }}
        onToggleStatus={handleToggleStatus}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedStore && (
        <ConfirmationModal
          title="Confirm Delete"
          message={`Are you sure you want to delete the store in ${selectedStore.city}?`}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
          onConfirm={handleDeleteStore}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </div>
  );
};

export default StoreManagement;