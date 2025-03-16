// src/app/wishlist/page.tsx
"use client";

import React from 'react';
import { useSession } from 'next-auth/react';
import { useWishlist } from '../../context/WishlistContext';
import Navbar from '../../components/HomepageComponents/Navbar';
import AnnouncementBanner from '../../components/HomepageComponents/AnnouncementBanner';
import Hero from '../../components/HomepageComponents/Hero';
import Footer from '../../components/HomepageComponents/Footer';
import Link from 'next/link';
import { Heart, ShoppingCart, LogIn } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { useCart } from '@/context/CartContext';

const WishlistPage: React.FC = () => {
  const { data: session, status } = useSession();
  const { wishlistItems, isWishlistLoading, wishlistCount, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart(); // Import from your cart context

  const handleAddToCart = (product:any) => {
    if (!product) return;
    
    addToCart({
        id: product.id,
        name: product.name || 'Unknown Product',
        price: product.price.offerPrice,
        originalPrice: product.price.mrp,  
        image: product.images?.imageMain || '/placeholder-image.jpg',
        quantity: 1
    });
    
    // Optional: Show success message
    toast.success('Added to cart');
  };

  return (
    <div>
      <AnnouncementBanner />
      <Navbar />
      <Hero />
      <Toaster position="top-center" />
      
      <div className="container mx-auto px-4 py-8 text-black">
        <h1 className="text-3xl font-bold mb-6 text-center">My Wishlist</h1>
        
        {/* Loading state */}
        {isWishlistLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-newgreensecond border-t-transparent"></div>
          </div>
        )}
        
        {/* Unauthenticated state */}
        {status === 'unauthenticated' && !isWishlistLoading && (
          <div className="text-center py-12 max-w-lg mx-auto bg-white shadow-lg rounded-lg p-8">
            <div className="flex justify-center mb-6">
              <LogIn size={64} className="text-newgreensecond" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Please sign in to view your wishlist</h2>
            <p className="mb-6 text-gray-600">Your wishlist is tied to your account. Sign in to keep track of your favorite products across devices.</p>
            <Link
              href="/auth/signin"
              className="bg-newgreensecond text-white px-6 py-3 rounded-md hover:bg-newgreen transition-colors inline-block"
            >
              Sign In
            </Link>
          </div>
        )}
        
        {/* Empty wishlist */}
        {status === 'authenticated' && !isWishlistLoading && wishlistCount === 0 && (
          <div className="text-center py-12 max-w-lg mx-auto bg-white shadow-lg rounded-lg p-8">
            <div className="flex justify-center mb-4">
              <Heart size={64} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Your wishlist is empty</h2>
            <p className="mb-6 text-gray-600">Browse our products and click the heart icon to add items to your wishlist.</p>
            <Link
              href="/allproducts"
              className="bg-newgreensecond text-white px-6 py-3 rounded-md hover:bg-newgreen transition-colors inline-block"
            >
              Explore Products
            </Link>
          </div>
        )}
        
        {/* Wishlist items */}
        {status === 'authenticated' && !isWishlistLoading && wishlistCount > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
                <div className="relative">
                  <Link href={`/productDescription/${product.id}`}>
                  <img
  src={product.images?.imageMain || '/placeholder-image.jpg'} // Add fallback image path
  alt={product.name || 'Product'}
  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
/>
                  </Link>
                  
                  {/* Remove from wishlist button */}
                  <button
                    onClick={() => {
                      toast.promise(
                        removeFromWishlist(product.id), 
                        {
                          loading: 'Removing...',
                          success: 'Removed from wishlist',
                          error: 'Failed to remove'
                        }
                      );
                    }}
                    className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-red-100 transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <Heart size={20} className="text-red-500 fill-red-500" />
                  </button>
                </div>
                
                <div className="p-4">
                  <Link href={`/productDescription/${product.id}`}>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-newgreensecond transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 mb-2">Code: {product.code}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-newgreensecond font-bold">
                        ₹{product.price.offerPrice}
                        {product.price.mrp > product.price.offerPrice && (
                          <span className="text-gray-500 text-sm ml-2 line-through">₹{product.price.mrp}</span>
                        )}
                      </p>
                      {product.price.mrp > product.price.offerPrice && (
                        <p className="text-green-600 text-sm">
                          {Math.round(((product.price.mrp - product.price.offerPrice) / product.price.mrp) * 100)}% off
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        // Add to cart logic here
                         handleAddToCart(product)
                       }}
                      className="flex items-center justify-center bg-newgreensecond text-white p-2 rounded hover:bg-newgreen transition-colors"
                      aria-label="Add to cart"
                    >
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default WishlistPage;