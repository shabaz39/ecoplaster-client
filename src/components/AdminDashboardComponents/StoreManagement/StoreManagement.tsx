// ecoplaster-client/src/components/AdminDashboardComponents/StoreManagement/StoreManagement.tsx
import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { 
  GET_STORES, 
  CREATE_STORE, 
  UPDATE_STORE, 
  DELETE_STORE, 
  TOGGLE_STORE_ACTIVE 
} from '@/constants/queries/storeQueries';
import LoadingSpinner from '../Common/LoadingSpinner';
import StoreForm from './StoreForm';
import StoreList from './StoreList';
import ConfirmationModal from '../Common/ConfirmationModal';
import { Store } from './stores.types'; // Import shared type
 

const StoreManagement: React.FC = () => {
  const [showStoreForm, setShowStoreForm] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  // GraphQL queries and mutations
  const { data, loading, error, refetch } = useQuery(GET_STORES);
  
  const [createStore, { loading: createLoading }] = useMutation(CREATE_STORE, {
    onCompleted: () => {
      refetch();
      setShowStoreForm(false);
    }
  });
  
  const [updateStore, { loading: updateLoading }] = useMutation(UPDATE_STORE, {
    onCompleted: () => {
      refetch();
      setEditingStore(null);
      setShowStoreForm(false);
    }
  });
  
  const [deleteStore, { loading: deleteLoading }] = useMutation(DELETE_STORE, {
    onCompleted: () => {
      refetch();
      setIsDeleteModalOpen(false);
    }
  });
  
  const [toggleStoreActive] = useMutation(TOGGLE_STORE_ACTIVE, {
    onCompleted: refetch
  });

  const handleCreateStore = async (formData: any) => {
    try {
      await createStore({
        variables: { input: formData }
      });
    } catch (error) {
      console.error('Error creating store:', error);
    }
  };

  const handleUpdateStore = async (formData: any) => {
    if (!editingStore) return;
    
    try {
      await updateStore({
        variables: {
          id: editingStore.id,
          input: formData
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

  const handleToggleActive = async (store: Store) => {
    try {
      await toggleStoreActive({
        variables: { id: store.id }
      });
    } catch (error) {
      console.error('Error toggling store status:', error);
    }
  };
  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error loading stores: {error.message}</div>;

  const stores = data?.getStores || [];

  return (
    <div className="space-y-6 text-black">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-productNameColor">Store Management</h3>
        <button
          onClick={() => {
            setEditingStore(null);
            setShowStoreForm(!showStoreForm);
          }}
          className="bg-greenComponent text-white px-4 py-2 rounded hover:bg-newgreen transition-colors"
        >
          {showStoreForm ? "Cancel" : "Add New Store"}
        </button>
      </div>

      {showStoreForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-medium text-productNameColor mb-4">
            {editingStore ? 'Edit Store' : 'Create New Store'}
          </h4>
          <StoreForm
            onSubmit={editingStore ? handleUpdateStore : handleCreateStore}
            initialData={editingStore}
            isLoading={createLoading || updateLoading}
          />
        </div>
      )}

<StoreList 
  stores={stores} 
  onEdit={(store:any) => {
    setEditingStore(store);
    setShowStoreForm(true);
  }} 
  onDelete={(store:any) => {
    setSelectedStore(store);
    setIsDeleteModalOpen(true);
  }}
  onToggleActive={handleToggleActive}
/>
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedStore && (
        <ConfirmationModal
          title="Confirm Delete"
          message={`Are you sure you want to delete the store in ${selectedStore.city}? This action cannot be undone.`}
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