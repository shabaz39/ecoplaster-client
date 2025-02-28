// components/AdminDashboard/ProductManagement/ProductManagement.tsx
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { 
  GET_PRODUCTS, 
  ADD_PRODUCT, 
  DELETE_PRODUCT, 
  UPDATE_PRODUCT, 
  ADD_MULTIPLE_PRODUCTS,
  FILTER_PRODUCTS 
} from '@/constants/queries/productQueries';
import ProductTable from './ProductTable';
import ProductForm from './ProductForm';
import BulkUploadForm from './BulkUploadForm';
import ProductDetailsModal from './ProductDetailsModal';
import ConfirmationModal from '../Common/ConfirmationModal';
import LoadingSpinner from '../Common/LoadingSpinner';
import { IProduct, ProductInput, ProductFilterInput } from '@/types/product.types';
import { toast } from 'react-toastify';

// Predefined filter options
const PREDEFINED_SERIES = [
    'SILK', 'GOLD', 'DUAL', 'CHIPS',
   'COTTON', 'COTTON & SILK', 'GLITTER', 'MULTI COLOR'
 ];
 
 const PREDEFINED_FABRIC = [
     'SILK & COTTON', 'PURE SILK', 'PURE COTTON'
 ];
 
 const PREDEFINED_COLORS = [
     'WHITE', 'YELLOW', 'PINK', 'RED', 'GREEN', 'BLUE', 'BLACK', 'SILVER',
     'CHESTNUT BROWN', 'DARK BROWN', 'GOLDEN YELLOW', 'GREY', 'IVORY CREAM',
     'KHAKI', 'MAROON', 'NAVY BLUE', 'NEON GREEN', 'ORANGE', 'PURPLE',
     'SKY BLUE', 'SILVER GREY', 'TURQUOISE', 'VIOLET'
 ];
 
 const PREDEFINED_FINISH = [
     'SMOOTH', 'TEXTURED', 'MATTE', 'GLOSSY'
 ];
 

const ProductManagement: React.FC = () => {
  // UI state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterOptions, setFilterOptions] = useState<ProductFilterInput>({
    series: [],
    fabric: [],
    color: [],
    finish: []
  });

  // Fetch products
  const { loading, error, data, refetch } = useQuery<{ getProducts: IProduct[] }>(GET_PRODUCTS);
  
  // Filter products
  const { loading: filterLoading, data: filteredData } = useQuery<{ filterProducts: IProduct[] }>(FILTER_PRODUCTS, {
    variables: filterOptions,
    skip: !Object.values(filterOptions).some(arr => arr && arr.length > 0)
  });
  
  // Define mutations
  const [addProduct, { loading: addLoading }] = useMutation(ADD_PRODUCT);
  const [updateProduct, { loading: updateLoading }] = useMutation(UPDATE_PRODUCT);
  const [deleteProduct, { loading: deleteLoading }] = useMutation(DELETE_PRODUCT);
  const [addMultipleProducts, { loading: bulkLoading }] = useMutation(ADD_MULTIPLE_PRODUCTS);

  // Determine which products to display (all or filtered)
  const displayProducts: IProduct[] = filteredData?.filterProducts || data?.getProducts || [];

  // Filter products by search term
  const searchFilteredProducts = displayProducts.filter((product: IProduct) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) || 
      product.code.toLowerCase().includes(searchLower)
    );
  });

  // Remove a single filter value
  const removeFilterValue = (type: keyof ProductFilterInput, valueToRemove: string) => {
    if (filterOptions[type]) {
      setFilterOptions({
        ...filterOptions,
        [type]: filterOptions[type].filter(value => value !== valueToRemove)
      });
    }
  };

  // Handler functions
  const handleAddProduct = async (productData: ProductInput) => {
    try {
      await addProduct({ 
        variables: { input: productData },
        onCompleted: () => {
          refetch();
          toast.success('Product added successfully');
          setIsAddModalOpen(false);
        }
      });
    } catch (err) {
      toast.error(`Error adding product: ${(err as Error).message}`);
    }
  };

  const handleUpdateProduct = async (productData: ProductInput) => {
    if (!selectedProduct?.id) return;
    
    try {
      await updateProduct({ 
        variables: { id: selectedProduct.id, input: productData },
        onCompleted: () => {
          refetch();
          toast.success('Product updated successfully');
          setIsEditModalOpen(false);
        }
      });
    } catch (err) {
      toast.error(`Error updating product: ${(err as Error).message}`);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct?.id) return;
    
    try {
      await deleteProduct({ 
        variables: { id: selectedProduct.id },
        onCompleted: () => {
          refetch();
          toast.success('Product deleted successfully');
          setIsDeleteModalOpen(false);
        }
      });
    } catch (err) {
      toast.error(`Error deleting product: ${(err as Error).message}`);
    }
  };

  const handleBulkUpload = async (products: ProductInput[]) => {
    try {
      await addMultipleProducts({ 
        variables: { inputs: products },
        onCompleted: (data) => {
          refetch();
          toast.success(`${data.addMultipleProducts.length} products added successfully`);
          setIsBulkUploadModalOpen(false);
        }
      });
    } catch (err) {
      toast.error(`Error uploading products: ${(err as Error).message}`);
    }
  };

  // Edit product
  const handleEditClick = (product: IProduct) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  // View product details
  const handleViewDetails = (product: IProduct) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  // Delete product
  const handleDeleteClick = (product: IProduct) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  // Handle filter changes
  const handleFilterChange = (type: keyof ProductFilterInput, values: string[]) => {
    setFilterOptions({
      ...filterOptions,
      [type]: values
    });
  };

  // Handle outside click for modals
  const handleModalOutsideClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-8 text-center text-red-500">Error loading products: {error.message}</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow text-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-productNameColor">Product Management</h1>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-greenComponent text-white px-4 py-2 rounded hover:bg-newgreensecond transition-colors"
          >
            Add Product
          </button>
          <button 
            onClick={() => setIsBulkUploadModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Bulk Upload
          </button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-1 md:col-span-2">
          <input
            type="text"
            placeholder="Search by name or code..."
            className="w-full p-2 border border-gray-300 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-span-1">
          <select 
            className="w-full p-2 border border-gray-300 rounded"
            onChange={(e) => handleFilterChange(
              'series', 
              Array.from(e.target.selectedOptions, option => option.value)
            )}
            multiple
          >
            <option value="" disabled>Filter by Series</option>
            {PREDEFINED_SERIES.map(series => (
              <option key={series} value={series}>{series}</option>
            ))}
          </select>
        </div>
        <div className="col-span-1">
          <select 
            className="w-full p-2 border border-gray-300 rounded"
            onChange={(e) => handleFilterChange(
              'fabric', 
              Array.from(e.target.selectedOptions, option => option.value)
            )}
            multiple
          >
            <option value="" disabled>Filter by Fabric</option>
            {PREDEFINED_FABRIC.map(fabric => (
              <option key={fabric} value={fabric}>{fabric}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Additional filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1">
          <select 
            className="w-full p-2 border border-gray-300 rounded"
            onChange={(e) => handleFilterChange(
              'color', 
              Array.from(e.target.selectedOptions, option => option.value)
            )}
            multiple
          >
            <option value="" disabled>Filter by Color</option>
            {PREDEFINED_COLORS.map(color => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>
        </div>
        <div className="col-span-1">
          <select 
            className="w-full p-2 border border-gray-300 rounded"
            onChange={(e) => handleFilterChange(
              'finish', 
              Array.from(e.target.selectedOptions, option => option.value)
            )}
            multiple
          >
            <option value="" disabled>Filter by Finish</option>
            {PREDEFINED_FINISH.map(finish => (
              <option key={finish} value={finish}>{finish}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected filters display */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(Object.entries(filterOptions) as [keyof ProductFilterInput, string[]][]).map(([type, values]) => 
          values.map((value: string) => (
            <div 
              key={`${type}-${value}`}
              className="bg-gray-100 px-2 py-1 rounded-full flex items-center text-xs"
            >
              <span className="font-medium mr-1">{type}:</span> {value}
              <button
                onClick={() => removeFilterValue(type, value)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                &times;
              </button>
            </div>
          ))
        )}
        {Object.values(filterOptions).some(arr => arr.length > 0) && (
          <button
            onClick={() => setFilterOptions({
              series: [],
              fabric: [],
              color: [],
              finish: []
            })}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* Products table */}
      {(filterLoading) ? <LoadingSpinner /> : (
        <ProductTable 
          products={searchFilteredProducts} 
          onEdit={handleEditClick} 
          onDelete={handleDeleteClick}
          onView={handleViewDetails}
        />
      )}

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setIsAddModalOpen(false)}>
          <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={handleModalOutsideClick}>
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-2 border-b">
              <h2 className="text-xl font-bold text-productNameColor">Add New Product</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <ProductForm 
              onSubmit={handleAddProduct} 
              onCancel={() => setIsAddModalOpen(false)} 
            />
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {isEditModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setIsEditModalOpen(false)}>
          <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={handleModalOutsideClick}>
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-2 border-b">
              <h2 className="text-xl font-bold text-productNameColor">Edit Product</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <ProductForm 
              initialData={selectedProduct}
              onSubmit={handleUpdateProduct} 
              onCancel={() => setIsEditModalOpen(false)} 
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedProduct && (
        <ConfirmationModal
          title="Confirm Delete"
          message={`Are you sure you want to delete product "${selectedProduct.name}" (${selectedProduct.code})?`}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
          onConfirm={handleDeleteProduct}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}

      {/* Bulk Upload Modal */}
      {isBulkUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setIsBulkUploadModalOpen(false)}>
          <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={handleModalOutsideClick}>
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-2 border-b">
              <h2 className="text-xl font-bold text-productNameColor">Bulk Upload Products</h2>
              <button
                onClick={() => setIsBulkUploadModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <BulkUploadForm 
              onSubmit={handleBulkUpload} 
              onCancel={() => setIsBulkUploadModalOpen(false)} 
            />
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {isDetailModalOpen && selectedProduct && (
        <ProductDetailsModal 
          product={selectedProduct} 
          onClose={() => setIsDetailModalOpen(false)}
          onEdit={() => {
            setIsDetailModalOpen(false);
            setIsEditModalOpen(true);
          }}
        />
      )}
    </div>
  );
};

export default ProductManagement;