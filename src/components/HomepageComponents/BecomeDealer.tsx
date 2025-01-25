"use client";

import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DealerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DealerModal: React.FC<DealerModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-xl mx-4"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-500 hover:text-newgreensecond transition-colors"
            >
              <X size={24} />
            </button>

            {/* Content */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-newgreensecond mb-1">Become Dealer</h2>
                <div className="w-16 h-1 bg-newgreen rounded"></div>
              </div>

              <form className="space-y-4">
                {/* Full Name */}
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-newgreen"
                  />
                </div>

                {/* Email */}
                <div>
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-newgreen"
                  />
                </div>

                {/* Mobile Number */}
                <div>
                  <input
                    type="tel"
                    placeholder="Mobile number"
                    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-newgreen"
                  />
                </div>

                {/* City */}
                <div>
                  <input
                    type="text"
                    placeholder="City"
                    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-newgreen"
                  />
                </div>

                {/* I am a */}
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">I am a</p>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="type"
                        className="w-4 h-4 text-newgreen focus:ring-newgreen"
                      />
                      <span className="text-sm text-black">Landlord</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="type"
                        className="w-4 h-4 text-newgreen focus:ring-newgreen"
                      />
                      <span className="text-sm text-black">Dealer</span>
                    </label>
                  </div>
                </div>

                {/* Notifications Checkbox */}
                <label className="flex items-start gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4 text-newgreen focus:ring-newgreen rounded"
                  />
                  <span>Send me notifications</span>
                </label>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-newgreensecond text-white rounded-md 
                    hover:bg-newgreen transition-colors duration-300 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-newgreen"
                >
                  Submit
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DealerModal;