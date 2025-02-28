// components/AdminDashboard/ProductManagement/ProductDetailsModal.tsx
import React, { useState, useEffect } from 'react';
import { IProduct } from '@/types/product.types';

interface ProductDetailsModalProps {
  product: IProduct;
  onClose: () => void;
  onEdit: () => void;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ product, onClose, onEdit }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'images'>('details');
  const [activeImage, setActiveImage] = useState<string>('imageMain');
  
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Get all available images
  const availableImages = Object.entries(product.images || {})
    .filter(([_, url]) => url && url !== '')
    .map(([key, url]) => ({ key, url: url.toString() }));

  // Format attributes
  const formatArray = (arr: string[] | undefined): string => {
    if (!arr || !Array.isArray(arr)) return 'N/A';
    return arr.join(', ');
  };

  // Prevent click in modal from closing the modal
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    // Backdrop - clickable to close
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 md:p-6"
      onClick={onClose}
    >
      {/* Modal container */}
      <div 
        className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={handleModalClick}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b px-4 sm:px-6 py-3 sm:py-4 sticky top-0 bg-white z-10">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{product.name}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={`px-3 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-medium flex-1 ${
              activeTab === 'details'
                ? 'border-b-2 border-greenComponent text-greenComponent'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button
            className={`px-3 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-medium flex-1 ${
              activeTab === 'images'
                ? 'border-b-2 border-greenComponent text-greenComponent'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('images')}
          >
            Images
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-grow">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900">Basic Information</h3>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500">Product Name</p>
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{product.name}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500">Product Code</p>
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{product.code}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500">MRP</p>
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">₹{product.price?.mrp || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500">Offer Price</p>
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">₹{product.price?.offerPrice || 'N/A'}</p>
                  </div>
                  {product.price?.mrp && product.price?.offerPrice && (
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-500">Discount</p>
                      <p className="mt-1 text-xs sm:text-sm text-gray-900">
                        {Math.round(((product.price.mrp - product.price.offerPrice) / product.price.mrp) * 100)}%
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Attributes */}
              <div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900">Product Attributes</h3>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500">Series</p>
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{formatArray(product.series)}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500">Colors</p>
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{formatArray(product.color)}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500">Fabrics</p>
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{formatArray(product.fabric)}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500">Finish</p>
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">{formatArray(product.finish)}</p>
                  </div>
                </div>
              </div>

              {/* Meta Information */}
              <div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900">Meta Information</h3>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500">Created At</p>
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">
                      {product.createdAt ? new Date(product.createdAt).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500">Last Updated</p>
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">
                      {product.updatedAt ? new Date(product.updatedAt).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                  {product.searchScore !== undefined && (
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-500">Search Score</p>
                      <p className="mt-1 text-xs sm:text-sm text-gray-900">{product.searchScore}</p>
                    </div>
                  )}
                  {product.slug && (
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-500">Slug</p>
                      <p className="mt-1 text-xs sm:text-sm text-gray-900">{product.slug}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'images' && (
            <div className="space-y-6">
              <h3 className="text-base sm:text-lg font-medium text-gray-900">Product Images</h3>
              
              {availableImages.length > 0 ? (
                <div>
                  {/* Main image display */}
                  <div className="mb-4 border rounded-md overflow-hidden bg-gray-100">
                    {product.images && activeImage in product.images ? (
                      <img 
                        src={product.images[activeImage as keyof typeof product.images] as string} 
                        alt={`${product.name} - ${activeImage}`}
                        className="max-h-64 sm:max-h-96 mx-auto object-contain p-2"
                      />
                    ) : (
                      <div className="h-48 sm:h-64 flex items-center justify-center">
                        <p className="text-gray-500">Image not available</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Image thumbnails */}
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {availableImages.map(({ key, url }) => (
                      <div 
                        key={key}
                        onClick={() => setActiveImage(key)}
                        className={`cursor-pointer border rounded-md overflow-hidden h-12 sm:h-16 ${
                          activeImage === key ? 'ring-2 ring-greenComponent' : ''
                        }`}
                      >
                        <img 
                          src={url} 
                          alt={key} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center p-6 text-gray-500 bg-gray-50 rounded-md">
                  No images available for this product.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-4 sm:px-6 py-3 sm:py-4 flex justify-end space-x-2 sticky bottom-0 bg-white">
          <button
            onClick={onEdit}
            className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Edit Product
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;