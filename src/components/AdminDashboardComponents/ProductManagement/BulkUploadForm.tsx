// components/AdminDashboard/ProductManagement/BulkUploadForm.tsx
import React, { useState } from 'react';
import Papa from 'papaparse';
import { ProductInput } from '@/types/product.types';

interface BulkUploadFormProps {
  onSubmit: (products: ProductInput[]) => void;
  onCancel: () => void;
}

const BulkUploadForm: React.FC<BulkUploadFormProps> = ({ onSubmit, onCancel }) => {
  const [file, setFile] = useState<File | null>(null);
  const [products, setProducts] = useState<ProductInput[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1); // 1: Upload, 2: Review, 3: Confirm

  // Parse CSV file
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsProcessing(true);
    setErrors([]);

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results:any) => {
        processResults(results);
        setIsProcessing(false);
      },
      error: (error:any) => {
        setErrors([`Error parsing file: ${error.message}`]);
        setIsProcessing(false);
      }
    });
  };

  // Process parsed CSV results
  const processResults = (results: Papa.ParseResult<any>) => {
    const validationErrors: string[] = [];
    const processedProducts: ProductInput[] = [];

    // Process each row
    results.data.forEach((row:any, index:any) => {
      const rowNumber = index + 2; // +2 because index is 0-based and we skip header row
      
      // Check required fields
      if (!row.name || !row.code || !row.imageMain) {
        validationErrors.push(`Row ${rowNumber}: Missing required fields (name, code, or imageMain)`);
        return;
      }

      try {
        // Parse comma-separated values into arrays
        const product: ProductInput = {
          name: row.name.trim(),
          code: row.code.trim(),
          color: parseArrayField(row.color || ''),
          fabric: parseArrayField(row.fabric || ''),
          price: {
            mrp: parseFloat(row.mrp) || 0,
            offerPrice: parseFloat(row.offerPrice) || 0
          },
          series: parseArrayField(row.series || ''),
          finish: parseArrayField(row.finish || ''),
          images: {
            imageMain: row.imageMain.trim(),
            imageArtTable: (row.imageArtTable || '').trim(),
            imageWall: (row.imageWall || '').trim(),
            imageBedroom: (row.imageBedroom || '').trim(),
            imageRoom: (row.imageRoom || '').trim(),
            imageLivingRoom: (row.imageLivingRoom || '').trim(),
            imageSecondLivingRoom: (row.imageLivingRoom || '').trim()


          }
        };

        // Validate price
        if (product.price.mrp <= 0 || product.price.offerPrice <= 0) {
          validationErrors.push(`Row ${rowNumber}: Invalid price values`);
          return;
        }

        processedProducts.push(product);
      } catch (e) {
        validationErrors.push(`Row ${rowNumber}: Error processing data - ${(e as Error).message}`);
      }
    });

    setProducts(processedProducts);
    setErrors(validationErrors);
    
    if (processedProducts.length > 0 && validationErrors.length === 0) {
      setStep(2); // Move to review step
    }
  };

  // Helper to parse comma-separated values into arrays
  const parseArrayField = (value: string): string[] => {
    if (!value) return [];
    return value.split(',').map(item => item.trim()).filter(item => item !== '');
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (products.length > 0) {
      onSubmit(products);
    }
  };

  // Download template CSV
  const downloadTemplate = () => {
    const fields = [
      'name', 'code', 'color', 'fabric', 'mrp', 'offerPrice', 
      'series', 'finish', 'imageMain', 'imageArtTable', 'imageWall', 
      'imageBedroom', 'imageRoom', 'imageLivingRoom', 'imageSecondLivingRoom'
    ];
    
    const sample = {
      name: 'Sample Product',
      code: 'PRD001',
      color: 'Blue,Green',
      fabric: 'Cotton,Silk',
      mrp: '1299',
      offerPrice: '999',
      series: 'Silk,Premium',
      finish: 'Matte,Glossy',
      imageMain: 'https://example.com/image1.jpg',
      imageArtTable: 'https://example.com/image2.jpg',
      imageWall: '',
      imageBedroom: '',
      imageRoom: '',
      imageLivingRoom: ''
    };
    
    // Create CSV content
    const header = fields.join(',');
    const row = fields.map(field => sample[field as keyof typeof sample] || '').join(',');
    const csv = `${header}\n${row}`;
    
    // Create and download the file
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'product_template.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div>
      {step === 1 && (
        <div className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-upload"
            />
            <div className="space-y-2">
              <div className="text-gray-500">
                Upload a CSV file with product information
              </div>
              <label
                htmlFor="csv-upload"
                className="inline-block px-4 py-2 bg-greenComponent text-white rounded cursor-pointer hover:bg-newgreensecond"
              >
                Select CSV File
              </label>
              {file && <div className="mt-2 text-sm">{file.name}</div>}
            </div>
          </div>
          
          <div className="flex justify-between items-center border-t pt-4">
            <button
              type="button"
              onClick={downloadTemplate}
              className="text-blue-600 hover:text-blue-800"
            >
              Download Template
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => products.length > 0 && setStep(2)}
                disabled={!file || isProcessing || errors.length > 0 || products.length === 0}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  !file || isProcessing || errors.length > 0 || products.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-greenComponent hover:bg-newgreensecond'
                }`}
              >
                {isProcessing ? 'Processing...' : 'Next'}
              </button>
            </div>
          </div>

          {/* Display validation errors */}
          {errors.length > 0 && (
            <div className="mt-4 bg-red-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-red-800">Validation Errors</h3>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Review Products</h3>
            <p className="text-sm text-gray-500">
              {products.length} products ready to be uploaded
            </p>
          </div>

          <div className="max-h-96 overflow-y-auto border rounded-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Series
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{product.price.offerPrice} <span className="text-xs line-through">₹{product.price.mrp}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.series.join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between border-t pt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-greenComponent hover:bg-newgreensecond"
              >
                Upload Products
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default BulkUploadForm;