'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns'; // Import the format function from date-fns
import { IBlog } from '@/types/blog.types';

interface BlogListProps {
  blogs: IBlog[];
  onPublish: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (blog: IBlog) => void;
}

export const BlogList: React.FC<BlogListProps> = ({
  blogs,
  onPublish,
  onDelete,
  onEdit,
}) => {
  const formatDate = (dateValue: string | number | Date | undefined): string => {
    if (!dateValue) return 'N/A';

    let date: Date;

    if (typeof dateValue === 'string') {
      if (!isNaN(Number(dateValue))) {
        date = new Date(Number(dateValue));
      } else if (!isNaN(Date.parse(dateValue))) {
        date = new Date(dateValue);
      } else {
        return 'N/A';
      }
    } else if (typeof dateValue === 'number') {
      date = new Date(dateValue);
    } else if (dateValue instanceof Date) {
      date = dateValue;
    } else {
      return 'N/A';
    }

    if (isNaN(date.getTime())) return 'N/A';

    return format(date, 'MMMM dd, yyyy');
  };

  return (
    <div className="space-y-6">
      {blogs.map((blog) => {
        const formattedDate = formatDate(blog.createdAt);

        return (
          <div key={blog.id} className="bg-white text-black rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {blog.title}
                  </h3>
                  <div className="mt-1 flex items-center text-sm text-black">
                    <span>{blog.author}</span>
                    <span className="mx-2">•</span>
                    <span>
                      {formattedDate} {/* Use the formatted date here */}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {blog.metaTags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                {blog.mainImage && (
                  <div className="ml-4">
                    <Image
                      src={blog.mainImage.imageUrl}
                      alt={blog.title}
                      width={120}
                      height={120}
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      blog.published
                        ? 'bg-newgreensecond text-white'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {blog.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  {!blog.published && (
                    <button
                      onClick={() => onPublish(blog.id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-newgreensecond hover:bg-green-700"
                    >
                      Publish
                    </button>
                  )}
                  
                  <button
                    onClick={() => onEdit(blog)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  
                  {blog.url && (
                    <Link
                      href={blog.url}
                      target="_blank"
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                    >
                      View
                    </Link>
                  )}
                  
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this blog?')) {
                        onDelete(blog.id);
                      }
                    }}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};