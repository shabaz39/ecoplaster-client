// ecoplaster-client/src/components/AdminDashboardComponents/StoreManagement/StoreList.tsx
import React, { useState } from 'react';
import { MapPin, Phone, Mail, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

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

interface StoreListProps {
  stores: Store[];
  onEdit: (store: Store) => void;
  onDelete: (store: Store) => void;
  onToggleStatus: (id: string) => void;
}

const StoreList: React.FC<StoreListProps> = ({ stores, onEdit, onDelete, onToggleStatus }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStores = stores.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(stores.length / itemsPerPage);

  // Handle page navigation
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div>
      {stores.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No stores found.</p>
          <p className="text-sm text-gray-400 mt-1">Add your first store location by clicking the "Add New Store" button.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentStores.map((store) => (
              <div 
                key={store.id} 
                className={`bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow transition-shadow ${
                  !store.isActive ? 'opacity-75 border-gray-200' : 'border-gray-300'
                }`}
              >
                {/* Store Header */}
                <div className="flex items-center p-4 border-b">
                  <div className="h-12 w-12 flex-shrink-0 mr-3">
                    <img src={store.iconUrl} alt={store.city} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{store.city}</h3>
                    <p className="text-sm text-gray-500">
                      {store.storeCount > 1 ? `${store.storeCount} Stores` : '1 Store'}
                      {!store.isActive && <span className="ml-2 text-orange-500">(Inactive)</span>}
                    </p>
                  </div>
                </div>
                
                {/* Store Details */}
                <div className="p-4 space-y-2">
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1 mr-2 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{store.address}</p>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{store.phoneNumber}</p>
                  </div>
                  
                  {store.email && (
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                      <p className="text-sm text-gray-700 truncate">{store.email}</p>
                    </div>
                  )}
                </div>
                
                {/* Last Updated */}
                <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500">
                  Last Updated: {formatDate(store.updatedAt)}
                </div>
                
                {/* Store Actions */}
                <div className="border-t px-4 py-3 bg-gray-50 flex justify-between">
                  <button
                    onClick={() => onToggleStatus(store.id)}
                    className={`flex items-center text-sm ${
                      store.isActive ? 'text-green-600 hover:text-green-800' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {store.isActive ? (
                      <>
                        <ToggleRight className="w-4 h-4 mr-1" />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-4 h-4 mr-1" />
                        <span>Inactive</span>
                      </>
                    )}
                  </button>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(store)}
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      <span className="text-sm">Edit</span>
                    </button>
                    
                    <button
                      onClick={() => onDelete(store)}
                      className="text-red-600 hover:text-red-800 flex items-center"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      <span className="text-sm">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => goToPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  &laquo; Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === page
                        ? 'z-10 bg-greenComponent text-white border-greenComponent'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === totalPages 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Next &raquo;
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StoreList;