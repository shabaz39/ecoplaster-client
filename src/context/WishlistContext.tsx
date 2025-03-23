// src/context/WishlistContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { GET_USER_WISHLIST, ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST } from '../constants/queries/wishlistQueries';

interface WishlistContextType {
  wishlistCount: number;
  wishlistItems: any[];
  isWishlistLoading: boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  showLoginPrompt: () => void;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlistCount: 0,
  wishlistItems: [],
  isWishlistLoading: false,
  addToWishlist: async () => {},
  removeFromWishlist: async () => {},
  isInWishlist: () => false,
  showLoginPrompt: () => {},
});

export const useWishlist = () => useContext(WishlistContext);

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [isUserVerified, setIsUserVerified] = useState(false);
  const { data: session, status } = useSession();
  
  // Use email as identifier instead of id - crucial for this backend
  const userEmail = session?.user?.email || '';
  
  // Fetch user wishlist data
  const { 
    data: userWishlistData, 
    loading: userWishlistLoading, 
    error: userWishlistError, 
    refetch: refetchUserWishlist 
  } = useQuery(GET_USER_WISHLIST, {
    variables: { userEmail },
    skip: !userEmail || status !== 'authenticated',
    onError: (error) => {
      console.error('Error fetching user wishlist:', error);
      setWishlistItems([]);
    },
    onCompleted: (data) => {
      if (data && data.getUserWishlist) {
        setWishlistItems(data.getUserWishlist);
        setIsUserVerified(true);
      } else {
        setWishlistItems([]);
      }
    }
  });

  // Add to wishlist mutation
  const [addToWishlistMutation] = useMutation(ADD_TO_WISHLIST, {
    onCompleted: (data) => {
      if (data?.addToWishlist?.wishlist) {
        setWishlistItems(data.addToWishlist.wishlist);
        setIsUserVerified(true);
      } else {
        refetchUserWishlist();
      }
    }
  });

  // Remove from wishlist mutation
  const [removeFromWishlistMutation] = useMutation(REMOVE_FROM_WISHLIST, {
    onCompleted: (data) => {
      if (data?.removeFromWishlist?.wishlist) {
        setWishlistItems(data.removeFromWishlist.wishlist);
      } else {
        refetchUserWishlist();
      }
    }
  });
  
  // Reset state when session changes
  useEffect(() => {
    if (status === 'unauthenticated') {
      setWishlistItems([]);
      setIsUserVerified(false);
    } else if (status === 'authenticated' && userEmail) {
      refetchUserWishlist();
    }
  }, [status, userEmail, refetchUserWishlist]);

  // Show login prompt for unauthenticated users
  const showLoginPrompt = () => {
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex flex-col`}>
        <div className="p-4">
          <div className="flex items-start">
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                Please sign in
              </p>
              <p className="mt-1 text-sm text-gray-500">
                You need to sign in to use the wishlist feature.
              </p>
              <div className="mt-4 flex">
                <a
                  href="/auth/signin"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-newgreensecond hover:bg-newgreen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-newgreen"
                >
                  Sign in
                </a>
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="ml-3 inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-newgreen"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.some(item => item.id === productId);
  };

  const addToWishlist = async (productId: string): Promise<void> => {
    if (!userEmail || status !== 'authenticated') {
      showLoginPrompt();
      return;
    }

    // Validate productId
    if (!productId) {
      console.error("Product ID is missing");
      return;
    }

    console.log('Attempting to add to wishlist:', { userEmail, productId });

    if (!isInWishlist(productId)) {
      try {
        // Optimistically update UI
        const tempItem = { id: productId, name: "Loading..." };
        setWishlistItems(prev => [...prev, tempItem]);
        
        // IMPORTANT: Note the reversed parameter order to match server expectations
        // The server expects (productId, userEmail) but our function receives (productId)
        await addToWishlistMutation({ 
          variables: { productId, userEmail },
          onCompleted: () => {
            toast.success('Added to wishlist');
          },
          onError: (error) => {
            console.error('Failed to add to wishlist:', error);
            
            // Revert optimistic update on error
            setWishlistItems(prev => prev.filter(item => item.id !== productId));
            toast.error('Failed to add item to wishlist');
            
            // Attempt to refetch current wishlist state
            refetchUserWishlist().catch(e => 
              console.error('Error refetching wishlist after failed add:', e)
            );
          }
        });
      } catch (error) {
        console.error('Failed to add to wishlist:', error);
        // Revert optimistic update on error
        setWishlistItems(prev => prev.filter(item => item.id !== productId));
        toast.error('Error adding to wishlist');
        
        // Attempt to refetch current wishlist state
        refetchUserWishlist().catch(e => 
          console.error('Error refetching wishlist after exception:', e)
        );
      }
    }
  };

  const removeFromWishlist = async (productId: string): Promise<void> => {
    if (!userEmail || status !== 'authenticated') {
      showLoginPrompt();
      return;
    }

    if (isInWishlist(productId)) {
      try {
        // Optimistically update UI
        setWishlistItems(prev => prev.filter(item => item.id !== productId));
        
        // IMPORTANT: Note the reversed parameter order to match server expectations
        // The server expects (productId, userEmail) but our function receives (productId)
        await removeFromWishlistMutation({ 
          variables: { productId, userEmail },
          onCompleted: () => {
            toast.success('Removed from wishlist');
          },
          onError: (error) => {
            console.error('Failed to remove from wishlist:', error);
            
            // Revert optimistic update and refetch correct data
            refetchUserWishlist().catch(e => 
              console.error('Error refetching wishlist after failed remove:', e)
            );
            toast.error('Failed to remove item from wishlist');
          }
        });
      } catch (error) {
        console.error('Failed to remove from wishlist:', error);
        
        // Revert optimistic update and refetch correct data
        refetchUserWishlist().catch(e => 
          console.error('Error refetching wishlist after exception:', e)
        );
        toast.error('Error removing from wishlist');
      }
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistCount: wishlistItems.length,
        wishlistItems,
        isWishlistLoading: userWishlistLoading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        showLoginPrompt
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};