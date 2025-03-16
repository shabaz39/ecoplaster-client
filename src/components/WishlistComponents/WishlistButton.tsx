// src/components/WishlistComponents/WishlistButton.tsx
"use client";

import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useSession } from 'next-auth/react';

interface WishlistButtonProps {
  productId: string;
  className?: string;
  iconSize?: number;
  filled?: boolean;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ 
  productId, 
  className = "rounded-full p-2 transition-colors", 
  iconSize = 20,
  filled
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { data: session } = useSession();
  
  const isInWishlistState = filled !== undefined ? filled : isInWishlist(productId);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      // Redirect to login if not logged in
      window.location.href = '/auth/signin?callbackUrl=' + encodeURIComponent(window.location.pathname);
      return;
    }

    setIsAnimating(true);

    try {
      if (isInWishlistState) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }
    } catch (error) {
      console.error('Wishlist operation failed:', error);
    } finally {
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const buttonClassName = `${className} ${isAnimating ? 'scale-125' : 'scale-100'} transition-transform duration-300`;

  return (
    <button
      onClick={handleWishlistToggle}
      className={buttonClassName}
      aria-label={isInWishlistState ? "Remove from wishlist" : "Add to wishlist"}
      data-testid="wishlist-button"
    >
      {isInWishlistState ? (
        <Heart size={iconSize} className="text-red-500 fill-red-500" />
      ) : (
        <Heart size={iconSize} className="fill-none" />
      )}
    </button>
  );
};

export default WishlistButton;