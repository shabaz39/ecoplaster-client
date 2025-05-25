// src/components/WishlistComponents/WishlistComponent.tsx
"use client";

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import Link from 'next/link';
import { GET_USER_WISHLIST, REMOVE_FROM_WISHLIST } from '../../constants/queries/wishlistQueries';
import { HeartOff, ShoppingCart, Trash2 } from 'lucide-react';

interface WishlistComponentProps {
  userId: string;
}

interface Product {
  id: string;
  name: string;
  code: string;
  price: {
    mrp: number;
    offerPrice: number;
  };
  images: {
    imageMain: string;
  };
  color: string[];
  fabric: string[];
  series: string[];
  finish: string[];
}

const WishlistComponent: React.FC<WishlistComponentProps> = ({ userId }) => {
  const [removedItems, setRemovedItems] = useState<string[]>([]);

  const { loading, error, data, refetch } = useQuery(GET_USER_WISHLIST, {
    variables: { userId },
    skip: !userId,
  });

  const [removeFromWishlist] = useMutation(REMOVE_FROM_WISHLIST, {
    onCompleted: () => {
      refetch();
    },
  });

  const handleRemoveFromWishlist = async (productId: string) => {
    setRemovedItems([...removedItems, productId]);
    
    try {
      await removeFromWishlist({
        variables: {
          userId,
          productId,
        },
      });
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      // Remove from the animation list if the operation fails
      setRemovedItems(removedItems.filter(id => id !== productId));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-newgreensecond border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        <p>Error loading wishlist: {error.message}</p>
      </div>
    );
  }

  const wishlistItems = data?.getUserWishlist || [];

  if (wishlistItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex justify-center mb-4">
          <HeartOff size={64} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-semibold mb-4">Your wishlist is empty</h2>
        <p className="mb-6">Browse our products and add items to your wishlist to keep track of products you're interested in.</p>
        <Link
          href="/allproducts"
          className="bg-newgreensecond text-white px-6 py-3 rounded-md hover:bg-newgreen transition-colors"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((product: Product) => (
          <div
            key={product.id}
            className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-500 ${
              removedItems.includes(product.id) ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
            }`}
          >
            <div className="relative">
              <Link href={`/productDescription/${product.id}`}>
                <img
  src={product.images?.imageMain || '/product1 (1).webp'} 
  alt={product.name || 'Product'} 
                  className="w-full h-64 object-cover"
                />
              </Link>
              <button
                onClick={() => handleRemoveFromWishlist(product.id)}
                className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-red-100 transition-colors"
                aria-label="Remove from wishlist"
              >
                <Trash2 size={20} className="text-red-500" />
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
                <Link
                  href={`/productDescription/${product.id}`}
                  className="flex items-center justify-center bg-newgreensecond text-white p-2 rounded hover:bg-newgreen transition-colors"
                >
                  <ShoppingCart size={18} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistComponent;