"use client"
import { useQuery, gql } from '@apollo/client';
import Image from 'next/image';
import { format } from 'date-fns';
import { Share } from 'lucide-react';
import { useState, useEffect } from 'react';

const GET_BLOG_BY_SLUG = gql`
  query GetBlogBySlug($slug: String!) {
    getBlogBySlug(slug: $slug) {
      id
      title
      mainImage {
        imageUrl
        imageId
      }
      body
      images {
        imageUrl
        imageId
      }
      metaTags
      author
      published
      createdAt
      url
    }
  }
`;

// Toast Notification Component
const Toast = ({ message, onClose }: { message: string; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in">
      <span>{message}</span>
      <button 
        onClick={onClose}
        className="ml-2 text-white hover:text-gray-200"
      >
        ×
      </button>
    </div>
  );
};

// Loading Skeleton Component
const BlogSkeleton = () => (
  <div className="max-w-4xl mx-auto px-4 py-8">
    <div className="animate-pulse">
      <div className="h-[600px] bg-gray-200 rounded-lg mb-8" />
      <div className="h-10 bg-gray-200 rounded w-3/4 mb-4" />
      <div className="h-6 bg-gray-200 rounded w-1/4 mb-8" />
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
      </div>
    </div>
  </div>
);

// Error Component
const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center p-8 bg-red-50 rounded-lg">
      <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
      <p className="text-gray-600">{message}</p>
    </div>
  </div>
);

export default function BlogPost({ slug }: { slug: string }) {
  const [showToast, setShowToast] = useState(false);
  const { loading, error, data } = useQuery(GET_BLOG_BY_SLUG, {
    variables: { slug },
  });

  if (loading) return <BlogSkeleton />;
  if (error) return <ErrorDisplay message="Error loading blog post" />;
  if (!data?.getBlogBySlug) return <ErrorDisplay message="Blog post not found" />;

  const blog = data.getBlogBySlug;
  console.log('date', blog.createdAt)
  const formattedDate = format(new Date(parseInt(blog.createdAt)), 'MMMM dd, yyyy');
  
  // Get the current URL for sharing
  const shareUrl = typeof window !== 'undefined' ? window.location.href : blog.url;
  
  const handleShare = async (platform?: 'twitter' | 'facebook') => {
    const title = blog.title;
    const text = `Check out this article: ${title}`;
    const url = shareUrl;

    // If Web Share API is available and no specific platform is selected
    if (!platform && navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
        setShowToast(true);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
      return;
    }

    // Platform-specific sharing
    let shareLink = '';
    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
    }

    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400,noopener,noreferrer');
      setShowToast(true);
    }
  };

  return (
    <article className="min-h-screen bg-white">
      {/* Toast Notification */}
      {showToast && (
        <Toast 
          message="Article shared successfully!"
          onClose={() => setShowToast(false)}
        />
      )}

      {/* Hero Section */}
      {blog.mainImage && (
        <div className="relative w-full h-[70vh] mb-8">
          <Image
            src={blog.mainImage.imageUrl}
            alt={blog.title}
            fill
            priority
            className="object-cover brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-4 font-serif">{blog.title}</h1>
            <div className="flex items-center space-x-4 text-lg">
              <span>By {blog.author}</span>
              <span>•</span>
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Meta Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {blog.metaTags.map((tag: string, index: number) => (
            <span
              key={index}
              className="bg-green text-white px-4 py-1 rounded-full text-sm font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Blog Content */}
        <div className="prose prose-lg max-w-none mb-12 font-sans">
          {blog.body.split('\n').map((paragraph: string, index: number) => (
            <p key={index} className="mb-6 leading-relaxed text-gray-700">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Image Gallery */}
        {blog.images?.length > 0 && (
          <div className="my-12">
            <h2 className="text-2xl text-black font-bold mb-6 font-serif">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {blog.images.map((image: any, index: number) => (
                <div key={index} className="relative aspect-square">
                  <Image
                    src={image.imageUrl}
                    alt={`Image ${index + 1} for ${blog.title}`}
                    fill
                    className="object-cover rounded-lg hover:brightness-90 transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Share Section */}
        <div className="border-t pt-8 mt-12">
          <h3 className="text-xl text-black font-semibold mb-4 flex items-center gap-2">
            <Share className="w-5 h-5" />
            Share this article
          </h3>
          <div className="flex flex-wrap gap-4">
            {/* Native Share Button (Mobile) */}
            {typeof window !== 'undefined' && 'share' in navigator && (
              <button
                onClick={() => handleShare()}
                className="px-4 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition flex items-center gap-2"
              >
                <Share className="w-4 h-4" />
                Share
              </button>
            )}
            
            {/* Social Media Buttons */}
            <button
              onClick={() => handleShare('twitter')}
              className="px-4 py-2 bg-[#1DA1F2] text-white rounded-full hover:opacity-90 transition"
            >
              Share on Twitter
            </button>
            <button
              onClick={() => handleShare('facebook')}
              className="px-4 py-2 bg-[#4267B2] text-white rounded-full hover:opacity-90 transition"
            >
              Share on Facebook
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}