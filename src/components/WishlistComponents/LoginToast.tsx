// src/components/WishlistComponents/LoginToast.tsx
import React from 'react';
import { toast, Toast } from 'react-hot-toast';

interface LoginToastProps {
  t: Toast;
  message?: string;
}

const LoginToast: React.FC<LoginToastProps> = ({ 
  t, 
  message = "You need to sign in to use the wishlist feature." 
}) => {
  return (
    <div 
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex flex-col`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-newgreensecond"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">
              Please sign in
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {message}
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
  );
};

export default LoginToast;