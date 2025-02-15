'use client';

import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  callbackUrl?: string;
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose, callbackUrl = '/' }) => {
  const { data: session, status } = useSession();

  const handleGoogleLogin = async () => {
    try {
      await signIn('google', { callbackUrl });
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="bg-beige rounded-lg shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg z-50 p-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b">
          <h2 className="text-lg font-semibold  text-gray-800">
            {session ? `Welcome ${session.user.role}` : "Login / Signup"}
          </h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center text-center mt-4">
          {status === 'loading' ? (
            <div className="text-gray-600">Loading...</div>
          ) : session ? (
            <>
              <img
                src={session.user.image || "/default-avatar.png"}
                alt="Profile"
                className="w-16 h-16 rounded-full mb-3"
              />
              <p className="text-lg font-semibold text-gray-800">{session.user.name}</p>
              <p className="text-sm text-gray-500">{session.user.email}</p>
              <p className="text-sm text-gray-500">Role: {session.user.role}</p>
              <button
                onClick={() => signOut()}
                className="w-full mt-4 py-2 font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <h3 className="font-semibold text-lg text-gray-800 mb-3">
                Sign in with Google
              </h3>
              <button
                onClick={handleGoogleLogin}
                className="w-full py-3 font-semibold bg-newgreen text-white rounded-lg hover:bg-newgreensecond flex items-center justify-center gap-2"
              >
                <img src="/google-logo.svg" alt="Google" className="w-5 h-5" />
                Continue with Google
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SignupModal;
