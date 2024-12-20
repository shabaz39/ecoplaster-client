"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Loader,
  ShieldCheck,
  Truck,
  Wrench,
  PackageCheck,
  Smile,
} from "lucide-react"; // Example icons

const icons = [
  <ShieldCheck size={80} className="text-newgreen" />,
  <Truck size={80} className="text-newgreen" />,
  <Wrench size={80} className="text-newgreen" />,
  <PackageCheck size={80} className="text-newgreen" />,
  <Smile size={80} className="text-newgreen" />,
];

const LoadingOverlay: React.FC = () => {
  const [activeIcon, setActiveIcon] = useState(0);

  // Randomize icons every 500ms
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIcon(Math.floor(Math.random() * icons.length));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 flex items-center justify-center bg-white z-50"
    >
      <motion.div
        key={activeIcon}
        initial={{ scale: 0, rotate: 0 }}
        animate={{ scale: 1, rotate: 360 }}
        exit={{ scale: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center"
      >
        {icons[activeIcon]}
        <span className="mt-2 text-newgreen font-medium text-sm">Loading...</span>
      </motion.div>
    </motion.div>
  );
};

export default LoadingOverlay;
