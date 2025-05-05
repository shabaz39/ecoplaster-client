// ecoplaster-client/src/components/AdminDashboardComponents/StoreManagement/StoreList.tsx
import React from 'react';
import { MapPin, Phone, Star } from 'lucide-react';
import { Store } from './stores.types'; // Import shared type
 
  
  interface StoreListProps {
    stores: Store[];
    onEdit: (store: Store) => void;
    onDelete: (store: Store) => void;
    onToggleActive: (store: Store) => Promise<void> | void; // Changed to accept both Promise<void> and void
  }
  
const StoreList: React.FC<StoreListProps> = ({ stores, onEdit, onDelete, onToggleActive }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stores.length === 0 ? (
        <div className="col-span-full text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No stores found. Add a store to get started.</p>
        </div>
      ) : (
        stores.map((store) => (
          <div 
            key={store.id} 
            className={`bg-white rounded-lg shadow-md overflow-hidden border ${
              store.active ? 'border-green-200' : 'border-gray-200 opacity-70'
            }`}
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-productNameColor">
                  {store.city}, {store.state}
                </h3>
                <div className="flex items-center">
                  {[...Array(Math.floor(store.rating))].map((_, i) => (
                    <Star key={i} className="text-newgreen" size={16} fill="#FFD700" />
                  ))}
                  {store.rating % 1 > 0 && (
                    <Star className="text-newgreen" size={16} fill="#FFD700" 
                         style={{ clipPath: `inset(0 ${100 - (store.rating % 1) * 100}% 0 0)` }} />
                  )}
                  <span className="ml-1 text-sm text-gray-600">({store.reviews})</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 mb-3">
                <div className="flex items-start mb-1">
                  <MapPin size={16} className="flex-shrink-0 mt-1 mr-1 text-newgreen" />
                  <p>{store.address}</p>
                </div>
                
                <div className="flex items-center">
                  <Phone size={16} className="flex-shrink-0 mr-1 text-newgreen" />
                  <a href={`tel:${store.phone}`} className="hover:text-newgreen">{store.phone}</a>
                </div>
                
                <p className="mt-1 font-medium">Timing: {store.timing}</p>
              </div>
              
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    store.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {store.active ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => onToggleActive(store)}
                    className="ml-2 px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                  >
                    Toggle
                  </button>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(store)}
                    className="px-2 py-1 text-xs bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(store)}
                    className="px-2 py-1 text-xs bg-red-50 text-red-700 rounded hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default StoreList;