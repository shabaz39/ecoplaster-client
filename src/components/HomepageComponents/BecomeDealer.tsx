"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@apollo/client';
import { ADD_DEALER } from '../../constants/mutations/dealerResolvers';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface DealerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DealerModal: React.FC<DealerModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    city: '',
    type: 'Dealer',
    notifications: false,
  });

  const [addDealer, { loading, error }] = useMutation(ADD_DEALER, {
    onCompleted: () => {
      toast.success('Dealer added successfully!');
      onClose();
    },
    onError: () => {
      toast.error('Error adding dealer. Please try again.');
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDealer({ variables: formData });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-xl mx-4"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-500 hover:text-newgreensecond transition-colors"
            >
              <X size={24} />
            </button>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-newgreensecond mb-1">Become Dealer</h2>
              <div className="w-16 h-1 bg-newgreen rounded"></div>
              <form onSubmit={handleSubmit} className="space-y-4 text-black">
                <input name="fullName" type="text" placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-newgreen" />
                <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-newgreen" />
                <input name="mobileNumber" type="tel" placeholder="Mobile Number" value={formData.mobileNumber} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-newgreen" />
                <input name="city" type="text" placeholder="City" value={formData.city} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-newgreen" />
                <label className="flex items-center gap-2">
                  <input name="notifications" type="checkbox" checked={formData.notifications} onChange={handleChange} className="w-4 h-4 text-newgreen focus:ring-newgreen rounded" />
                  <span>Send me notifications</span>
                </label>
                <button type="submit" className="w-full py-3 px-4 bg-newgreensecond text-white rounded-md hover:bg-newgreen transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-newgreen">
                  {loading ? 'Submitting...' : 'Submit'}
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
