import React, { useState, useRef } from 'react';
import { BlogFormData } from '@/types/blog.types';

interface BlogFormProps {
  onSubmit: (formData: BlogFormData, files: File[]) => void;
  initialData?: BlogFormData;
  loading?: boolean;
}

export const BlogForm: React.FC<BlogFormProps> = ({ 
  onSubmit, 
  initialData,
  loading = false 
}) => {
  const [formData, setFormData] = useState<BlogFormData>(
    initialData || {
      title: '',
      body: '',
      metaTags: [],
      author: ''
    }
  );
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [metaTagInput, setMetaTagInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle basic form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    
    // Create preview URLs
    const urls = files.map(file => URL.createObjectURL(file));
    
    // Clean up any existing preview URLs to prevent memory leaks
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    
    setPreviewUrls(urls);
  };

  // Handle adding a meta tag
  const handleAddMetaTag = () => {
    if (!metaTagInput.trim()) return;
    
    setFormData(prev => ({ 
      ...prev, 
      metaTags: [...prev.metaTags, metaTagInput.trim()] 
    }));
    setMetaTagInput('');
  };

  // Handle removing a meta tag
  const handleRemoveMetaTag = (tagToRemove: string) => {
    setFormData(prev => ({ 
      ...prev, 
      metaTags: prev.metaTags.filter(tag => tag !== tagToRemove) 
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submission initiated with:", { formData, selectedFiles });
    
    // Validate form
    if (!formData.title.trim()) {
      alert("Please enter a title");
      return;
    }
    
    if (!formData.body.trim()) {
      alert("Please enter content");
      return;
    }
    
    if (selectedFiles.length === 0 && !initialData?.title) {
      alert("Please select at least one image");
      return;
    }
    
    if (!formData.author.trim()) {
      alert("Please enter author name");
      return;
    }
    
    // Call parent's onSubmit
    onSubmit(formData, selectedFiles);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Blog Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
          disabled={loading}
        />
      </div>
      
      <div>
        <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
          Content *
        </label>
        <textarea
          id="body"
          name="body"
          value={formData.body}
          onChange={handleChange}
          required
          rows={8}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
          disabled={loading}
        />
      </div>
      
      <div>
        <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
          Author *
        </label>
        <input
          type="text"
          id="author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
          disabled={loading}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Meta Tags
        </label>
        <div className="flex mb-2">
          <input
            type="text"
            value={metaTagInput}
            onChange={(e) => setMetaTagInput(e.target.value)}
            placeholder="Add meta tag"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            disabled={loading}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddMetaTag();
              }
            }}
          />
          <button
            type="button"
            onClick={handleAddMetaTag}
            className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            disabled={loading}
          >
            Add
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.metaTags.map((tag, index) => (
            <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
              <span className="text-sm text-gray-800">{tag}</span>
              <button
                type="button"
                onClick={() => handleRemoveMetaTag(tag)}
                className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                disabled={loading}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Images {!initialData?.title && '*'}
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
          <input
            type="file"
            id="images"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
            disabled={loading}
          />
          
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              disabled={loading}
            >
              {initialData?.title ? 'Replace Images' : 'Select Images'}
            </button>
            <p className="text-xs text-gray-500">
              {initialData?.title 
                ? 'Leave empty to keep current images'
                : 'First image will be used as main image'}
            </p>
          </div>
          
          {previewUrls.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="h-32 w-full object-cover rounded-md"
                  />
                  {index === 0 && (
                    <div className="absolute bottom-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-tl-md">
                      Main
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="pt-4 flex justify-end space-x-3">
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Saving...' : (initialData?.title ? 'Update Blog' : 'Save Blog')}
        </button>
      </div>
    </form>
  );
};