'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { BlogFormData } from '@/types/blog.types';

interface BlogFormProps {
  onSubmit: (formData: BlogFormData, files: File[]) => Promise<void>;
  initialData?: BlogFormData;
  loading?: boolean;
}

export const BlogForm: React.FC<BlogFormProps> = ({ 
  onSubmit, 
  initialData,
  loading = false 
}) => {
  const [formData, setFormData] = useState<BlogFormData>(initialData || {
    title: '',
    body: '',
    metaTags: [], // Initialize as an empty array
    author: ''
  });
  const [tagInput, setTagInput] = useState(
    initialData && initialData.metaTags ? 
    initialData.metaTags.join(', ') : 
    ''
  );
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  
    const previewUrls = acceptedFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => {
      // Clean up old previews
      prev.forEach((url) => URL.revokeObjectURL(url));
      return previewUrls;
    });
  }, []);

  
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    onDrop: handleDrop,
  });

  // When handling input for metaTags, convert the comma-separated string to an array
  const handleMetaTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsString = e.target.value;
    setTagInput(tagsString); // Update the input field state
    
    // Convert to array for the formData
    const tagsArray = tagsString.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag !== '');
    setFormData({ ...formData, metaTags: tagsArray });
  };
  
 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  console.log("Files before submitting:", files);

  if (!files.length) {
    alert('Please select at least one image');
    return;
  }
  try {
    // No need to modify metaTags, they're already in the correct format
    await onSubmit(formData, files);
  } catch (error) {
    console.error('Form submission error:', error);
  }
};


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border text-black border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      {/* Dropzone for images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
            ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-500'}
          `}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-indigo-500">Drop the files here ...</p>
          ) : (
            <p className="text-gray-500">
              Drag & drop images here, or click to select files
            </p>
          )}
        </div>

        {/* Image Previews */}
        {previews.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-4">
            {previews.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="h-24 w-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const newFiles = [...files];
                    newFiles.splice(index, 1);
                    setFiles(newFiles);
                    
                    const newPreviews = [...previews];
                    URL.revokeObjectURL(newPreviews[index]);
                    newPreviews.splice(index, 1);
                    setPreviews(newPreviews);
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-black text-sm font-medium">Content</label>
        <textarea
          value={formData.body}
          onChange={(e) => setFormData({ ...formData, body: e.target.value })}
          rows={6}
          className="mt-1 block w-full text-black rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Meta Tags</label>
        <input
          type="text"
          value={tagInput}
    onChange={handleMetaTagsChange}
          placeholder="tag1, tag2, tag3"
          className="mt-1 block w-full rounded-md border text-black border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Author</label>
        <input
          type="text"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          className="mt-1 block w-full rounded-md border text-black border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Blog'}
      </button>
    </form>
  );
};