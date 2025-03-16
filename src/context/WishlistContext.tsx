// src/context/WishlistContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useSession } from 'next-auth/react';
import { GET_USER_WISHLIST, GET_ADMIN_WISHLIST, ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST } from '../constants/queries/wishlistQueries';
import { toast } from 'react-hot-toast';

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
  
  // Use email as the identifier instead of id
  const userEmail = session?.user?.email;
  
  // Check if the user is the admin
  const isAdmin = userEmail === 'ecoplaster1@gmail.com';
  
  // Use the appropriate query based on user type
  const { 
    data: userWishlistData, 
    loading: userWishlistLoading, 
    error: userWishlistError, 
    refetch: refetchUserWishlist 
  } = useQuery(GET_USER_WISHLIST, {
    variables: { userEmail },
    skip: !userEmail || status !== 'authenticated' || isAdmin,
    onError: (error) => {
      console.error('Error fetching user wishlist:', error);
      setIsUserVerified(false);
    },
    onCompleted: (data) => {
      if (data && data.getUserWishlist) {
        setIsUserVerified(true);
      }
    }
  });
  
  // Admin-specific query
  const { 
    data: adminWishlistData, 
    loading: adminWishlistLoading, 
    error: adminWishlistError, 
    refetch: refetchAdminWishlist 
  } = useQuery(GET_ADMIN_WISHLIST, {
    variables: { adminEmail: userEmail },
    skip: !userEmail || status !== 'authenticated' || !isAdmin,
    onError: (error) => {
      console.error('Error fetching admin wishlist:', error);
    },
    onCompleted: (data) => {
      if (data && data.getAdminWishlist) {
        setIsUserVerified(true);
      }
    }
  });

  const [addToWishlistMutation] = useMutation(ADD_TO_WISHLIST);
  const [removeFromWishlistMutation] = useMutation(REMOVE_FROM_WISHLIST);
  
  // Combined data and loading states
  const wishlistData = isAdmin ? adminWishlistData?.getAdminWishlist : userWishlistData?.getUserWishlist;
  const isWishlistLoading = isAdmin ? adminWishlistLoading : userWishlistLoading;
  const wishlistError = isAdmin ? adminWishlistError : userWishlistError;
  const refetchWishlist = isAdmin ? refetchAdminWishlist : refetchUserWishlist;

  useEffect(() => {
    if (wishlistData) {
      setWishlistItems(wishlistData);
    }
  }, [wishlistData]);

  // Reset state when session changes
  useEffect(() => {
    if (status === 'unauthenticated') {
      setWishlistItems([]);
      setIsUserVerified(false);
    } else if (status === 'authenticated' && isAdmin) {
      // For admin, we always consider them verified
      setIsUserVerified(true);
    }
  }, [status, isAdmin]);

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

    // For regular users, we check verification. For admin, we bypass this check.
    if (!isAdmin && !isUserVerified) {
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
        setWishlistItems(prev => [...prev, { id: productId }]);
        
        // Make the mutation call to the backend
        await addToWishlistMutation({ 
          variables: { userEmail, productId },
          onError: (error) => {
            console.error('Failed to add to wishlist:', error);
            console.error('Error details:', error.message, error.graphQLErrors, error.networkError);

            // Revert optimistic update on error
            setWishlistItems(prev => prev.filter(item => item.id !== productId));
            
            if (error.message.includes('User not found')) {
              showLoginPrompt();
            } else {
              toast.error('Failed to add item to wishlist');
            }
          }
        });
        console.log('Successfully added to wishlist');

        toast.success('Added to wishlist');
        // Then refetch to ensure data consistency
        await refetchWishlist();
      } catch (error) {
        console.error('Failed to add to wishlist:', error);
        // Revert optimistic update on error
        setWishlistItems(prev => prev.filter(item => item.id !== productId));
      }
    }
  };

  const removeFromWishlist = async (productId: string): Promise<void> => {
    if (!userEmail || (!isAdmin && !isUserVerified)) return;

    if (isInWishlist(productId)) {
      try {
        // Optimistically update UI
        setWishlistItems(prev => prev.filter(item => item.id !== productId));
        
        // Make the mutation call to the backend
        await removeFromWishlistMutation({ 
          variables: { userEmail, productId },
          onError: (error) => {
            console.error('Failed to remove from wishlist:', error);
            // Will refetch to revert changes on error
            refetchWishlist();
            
            toast.error('Failed to remove item from wishlist');
          }
        });
        
        toast.success('Removed from wishlist');
        // Then refetch to ensure data consistency
        await refetchWishlist();
      } catch (error) {
        console.error('Failed to remove from wishlist:', error);
        // Revert optimistic update on error
        await refetchWishlist();
      }
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistCount: wishlistItems.length,
        wishlistItems,
        isWishlistLoading,
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