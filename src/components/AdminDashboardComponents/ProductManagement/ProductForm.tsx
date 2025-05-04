// components/AdminDashboard/ProductManagement/ProductForm.tsx
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PRODUCT_ATTRIBUTES } from '@/constants/queries/productQueries';
import { IProduct, ProductInput, ProductAttributes } from '@/types/product.types';

interface ProductFormProps {
  initialData?: IProduct;
  onSubmit: (data: ProductInput) => void;
  onCancel: () => void;
}

// Predefined options
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

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<ProductInput>({
    name: '',
    code: '',
    color: [],
    fabric: [],
    price: {
      mrp: 0,
      offerPrice: 0
    },
    series: [],
    finish: [],
    images: {
      imageMain: '',
      imageArtTable: '',
      imageWall: '',
      imageBedroom: '',
      imageRoom: '',
      imageLivingRoom: '',
      imageSecondLivingRoom: ''

    }
  });
  
  const [newAttribute, setNewAttribute] = useState({
    color: '',
    fabric: '',
    series: '',
    finish: ''
  });

  // Fetch attributes for dropdowns
  const { data: attributesData } = useQuery<{ productAttributes: ProductAttributes }>(GET_PRODUCT_ATTRIBUTES);

  // Helper function to ensure array values
  const ensureArray = (value: any): string[] => {
    if (Array.isArray(value)) {
      return value.filter(Boolean);
    }
    return [];
  };

  // Initialize form with existing data if editing
  useEffect(() => {
    if (initialData) {
      try {
        setFormData({
          name: initialData.name || '',
          code: initialData.code || '',
          color: ensureArray(initialData.color),
          fabric: ensureArray(initialData.fabric),
          price: { 
            mrp: initialData.price?.mrp || 0, 
            offerPrice: initialData.price?.offerPrice || 0 
          },
          series: ensureArray(initialData.series),
          finish: ensureArray(initialData.finish),
          images: { 
            imageMain: initialData.images?.imageMain || '',
            imageArtTable: initialData.images?.imageArtTable || '',
            imageWall: initialData.images?.imageWall || '',
            imageBedroom: initialData.images?.imageBedroom || '',
            imageRoom: initialData.images?.imageRoom || '',
            imageLivingRoom: initialData.images?.imageLivingRoom || '',
            imageSecondLivingRoom: initialData.images?.imageLivingRoom || '',

          }
        });
      } catch (error) {
        console.error("Error setting initial form data:", error);
        // If there's an error, we continue with default empty values
      }
    }
  }, [initialData]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested properties
      const [parent, child] = name.split('.');
      
      if (parent === 'price' || parent === 'images') {
        setFormData({
          ...formData,
          [parent]: {
            ...(formData[parent as keyof typeof formData] as Record<string, any>),
            [child]: value
          }
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle number inputs
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [parent, child] = name.split('.');
    
    if (parent === 'price') {
      setFormData({
        ...formData,
        price: {
          ...formData.price,
          [child]: parseFloat(value) || 0
        }
      });
    }
  };

  // Handle multi-select changes
  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, field: keyof ProductInput) => {
    const values = Array.from(e.target.selectedOptions, option => option.value);
    
    if (field === 'color' || field === 'fabric' || field === 'series' || field === 'finish') {
      setFormData({
        ...formData,
        [field]: values
      });
    }
  };

  // Handle adding a new attribute
  const handleAddAttribute = (type: 'color' | 'fabric' | 'series' | 'finish') => {
    if (newAttribute[type] && !formData[type].includes(newAttribute[type])) {
      setFormData({
        ...formData,
        [type]: [...formData[type], newAttribute[type]]
      });
      setNewAttribute({
        ...newAttribute,
        [type]: ''
      });
    }
  };

  // Handle select attribute
  const handleSelectAttribute = (type: 'color' | 'fabric' | 'series' | 'finish', value: string) => {
    if (value && !formData[type].includes(value)) {
      setFormData({
        ...formData,
        [type]: [...formData[type], value]
      });
    }
  };

  // Handle removing an attribute
  const handleRemoveAttribute = (type: 'color' | 'fabric' | 'series' | 'finish', value: string) => {
    setFormData({
      ...formData,
      [type]: formData[type].filter(item => item !== value)
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Product Name*
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700">
            Product Code*
          </label>
          <input
            type="text"
            name="code"
            id="code"
            value={formData.code}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="price.mrp" className="block text-sm font-medium text-gray-700">
            MRP (₹)*
          </label>
          <input
            type="number"
            name="price.mrp"
            id="price.mrp"
            value={formData.price.mrp}
            onChange={handleNumberChange}
            required
            min="0"
            step="0.01"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div>
          <label htmlFor="price.offerPrice" className="block text-sm font-medium text-gray-700">
            Offer Price (₹)*
          </label>
          <input
            type="number"
            name="price.offerPrice"
            id="price.offerPrice"
            value={formData.price.offerPrice}
            onChange={handleNumberChange}
            required
            min="0"
            step="0.01"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Color Attributes */}
      <div className="border rounded-md p-3">
        <h3 className="text-sm font-medium mb-3 text-gray-700">Colors</h3>
        <div className="flex flex-wrap gap-2 mb-3 min-h-[2rem]">
          {formData.color.map((color, index) => (
            <div 
              key={`${color}-${index}`} 
              className="bg-gray-100 px-2 py-1 rounded-full flex items-center space-x-1 text-xs"
            >
              <span>{color}</span>
              <button
                type="button"
                onClick={() => handleRemoveAttribute('color', color)}
                className="text-red-500 text-xs hover:text-red-700 ml-1"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <select
            className="block w-1/2 border border-gray-300 rounded-md shadow-sm p-1 text-sm"
            value=""
            onChange={(e) => handleSelectAttribute('color', e.target.value)}
          >
            <option value="" disabled>Select color</option>
            {PREDEFINED_COLORS.map((color) => (
              <option key={color} value={color} disabled={formData.color.includes(color)}>
                {color}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Or add new color"
            value={newAttribute.color}
            onChange={(e) => setNewAttribute({ ...newAttribute, color: e.target.value })}
            className="block w-1/2 border border-gray-300 rounded-md shadow-sm p-1 text-sm"
          />
          <button
            type="button"
            onClick={() => handleAddAttribute('color')}
            className="bg-gray-200 px-2 py-1 rounded-md hover:bg-gray-300 text-sm flex-shrink-0"
          >
            Add
          </button>
        </div>
      </div>

      {/* Fabric Attributes */}
      <div className="border rounded-md p-3">
        <h3 className="text-sm font-medium mb-3 text-gray-700">Fabrics</h3>
        <div className="flex flex-wrap gap-2 mb-3 min-h-[2rem]">
          {formData.fabric.map((fabric, index) => (
            <div 
              key={`${fabric}-${index}`} 
              className="bg-gray-100 px-2 py-1 rounded-full flex items-center space-x-1 text-xs"
            >
              <span>{fabric}</span>
              <button
                type="button"
                onClick={() => handleRemoveAttribute('fabric', fabric)}
                className="text-red-500 text-xs hover:text-red-700 ml-1"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <select
            className="block w-1/2 border border-gray-300 rounded-md shadow-sm p-1 text-sm"
            value=""
            onChange={(e) => handleSelectAttribute('fabric', e.target.value)}
          >
            <option value="" disabled>Select fabric</option>
            {PREDEFINED_FABRIC.map((fabric) => (
              <option key={fabric} value={fabric} disabled={formData.fabric.includes(fabric)}>
                {fabric}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Or add new fabric"
            value={newAttribute.fabric}
            onChange={(e) => setNewAttribute({ ...newAttribute, fabric: e.target.value })}
            className="block w-1/2 border border-gray-300 rounded-md shadow-sm p-1 text-sm"
          />
          <button
            type="button"
            onClick={() => handleAddAttribute('fabric')}
            className="bg-gray-200 px-2 py-1 rounded-md hover:bg-gray-300 text-sm flex-shrink-0"
          >
            Add
          </button>
        </div>
      </div>

      {/* Series Attributes */}
      <div className="border rounded-md p-3">
        <h3 className="text-sm font-medium mb-3 text-gray-700">Series</h3>
        <div className="flex flex-wrap gap-2 mb-3 min-h-[2rem]">
          {formData.series.map((series, index) => (
            <div 
              key={`${series}-${index}`} 
              className="bg-gray-100 px-2 py-1 rounded-full flex items-center space-x-1 text-xs"
            >
              <span>{series}</span>
              <button
                type="button"
                onClick={() => handleRemoveAttribute('series', series)}
                className="text-red-500 text-xs hover:text-red-700 ml-1"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <select
            className="block w-1/2 border border-gray-300 rounded-md shadow-sm p-1 text-sm"
            value=""
            onChange={(e) => handleSelectAttribute('series', e.target.value)}
          >
            <option value="" disabled>Select series</option>
            {PREDEFINED_SERIES.map((series) => (
              <option key={series} value={series} disabled={formData.series.includes(series)}>
                {series}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Or add new series"
            value={newAttribute.series}
            onChange={(e) => setNewAttribute({ ...newAttribute, series: e.target.value })}
            className="block w-1/2 border border-gray-300 rounded-md shadow-sm p-1 text-sm"
          />
          <button
            type="button"
            onClick={() => handleAddAttribute('series')}
            className="bg-gray-200 px-2 py-1 rounded-md hover:bg-gray-300 text-sm flex-shrink-0"
          >
            Add
          </button>
        </div>
      </div>

      {/* Finish Attributes */}
      <div className="border rounded-md p-3">
        <h3 className="text-sm font-medium mb-3 text-gray-700">Finish</h3>
        <div className="flex flex-wrap gap-2 mb-3 min-h-[2rem]">
          {formData.finish.map((finish, index) => (
            <div 
              key={`${finish}-${index}`} 
              className="bg-gray-100 px-2 py-1 rounded-full flex items-center space-x-1 text-xs"
            >
              <span>{finish}</span>
              <button
                type="button"
                onClick={() => handleRemoveAttribute('finish', finish)}
                className="text-red-500 text-xs hover:text-red-700 ml-1"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <select
            className="block w-1/2 border border-gray-300 rounded-md shadow-sm p-1 text-sm"
            value=""
            onChange={(e) => handleSelectAttribute('finish', e.target.value)}
          >
            <option value="" disabled>Select finish</option>
            {PREDEFINED_FINISH.map((finish) => (
              <option key={finish} value={finish} disabled={formData.finish.includes(finish)}>
                {finish}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Or add new finish"
            value={newAttribute.finish}
            onChange={(e) => setNewAttribute({ ...newAttribute, finish: e.target.value })}
            className="block w-1/2 border border-gray-300 rounded-md shadow-sm p-1 text-sm"
          />
          <button
            type="button"
            onClick={() => handleAddAttribute('finish')}
            className="bg-gray-200 px-2 py-1 rounded-md hover:bg-gray-300 text-sm flex-shrink-0"
          >
            Add
          </button>
        </div>
      </div>

      {/* Images */}
      <div className="border rounded-md p-3">
        <h3 className="text-sm font-medium mb-3 text-gray-700">Product Images</h3>
        <div className="space-y-3">
          <div>
            <label htmlFor="images.imageMain" className="block text-xs font-medium text-gray-700">
              Main Image URL*
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                name="images.imageMain"
                id="images.imageMain"
                value={formData.images.imageMain}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-1 text-sm"
              />
              {formData.images.imageMain && (
                <div className="mt-1 h-10 w-10 border rounded overflow-hidden flex-shrink-0">
                  <img 
                    src={formData.images.imageMain} 
                    alt="Main preview" 
                    className="h-full w-full object-cover"
                    onError={(e) => (e.target as HTMLImageElement).src = '/placeholder-image.jpg'}
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor="images.imageArtTable" className="block text-xs font-medium text-gray-700">
                Art Table Image URL
              </label>
              <input
                type="text"
                name="images.imageArtTable"
                id="images.imageArtTable"
                value={formData.images.imageArtTable}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-1 text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="images.imageWall" className="block text-xs font-medium text-gray-700">
                Wall Image URL
              </label>
              <input
                type="text"
                name="images.imageWall"
                id="images.imageWall"
                value={formData.images.imageWall}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-1 text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="images.imageBedroom" className="block text-xs font-medium text-gray-700">
                Bedroom Image URL
              </label>
              <input
                type="text"
                name="images.imageBedroom"
                id="images.imageBedroom"
                value={formData.images.imageBedroom}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-1 text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="images.imageRoom" className="block text-xs font-medium text-gray-700">
                Room Image URL
              </label>
              <input
                type="text"
                name="images.imageRoom"
                id="images.imageRoom"
                value={formData.images.imageRoom}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-1 text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="images.imageLivingRoom" className="block text-xs font-medium text-gray-700">
                Living Room Image URL
              </label>
              <input
                type="text"
                name="images.imageLivingRoom"
                id="images.imageLivingRoom"
                value={formData.images.imageLivingRoom}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-1 text-sm"
              />
            </div>

            <div>
              <label htmlFor="images.imageSecondLivingRoom" className="block text-xs font-medium text-gray-700">
                Living Room Image URL
              </label>
              <input
                type="text"
                name="images.imageSecondLivingRoom"
                id="images.imageSecondLivingRoom"
                value={formData.images.imageSecondLivingRoom}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-1 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 sticky bottom-0 bg-white border-t mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3 py-1.5 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-greenComponent hover:bg-newgreensecond"
        >
          {initialData ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;