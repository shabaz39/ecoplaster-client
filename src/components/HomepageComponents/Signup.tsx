"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("User signed in:", result.user);
      onClose(); // Close modal after login
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed lg:text-md text-sm inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>

      {/* Modal Content */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="bg-white rounded-lg shadow-lg w-full lg:max-w-md z-50"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 bg-newgreensecond text-white rounded-t-lg">
          <h2 className="text-lg font-semibold">{user ? "Welcome" : "Login / Signup"}</h2>
          <button onClick={onClose} className="text-white hover:text-newbeige">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex flex-col items-center p-6">
          {user ? (
            <>
              <img src={user.photoURL} alt="Profile" className="w-16 h-16 rounded-full mb-2" />
              <p className="text-lg font-semibold text-gray-800">{user.displayName}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
              <button
                onClick={handleLogout}
                className="w-full mt-4 py-2 font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <h3 className="font-semibold text-lg text-gray-800 mb-4">Sign in with Google</h3>
              <button
                onClick={handleGoogleLogin}
                className="w-full py-2 font-semibold bg-newgreen text-white rounded-lg hover:bg-newgreensecond flex items-center justify-center gap-2"
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
