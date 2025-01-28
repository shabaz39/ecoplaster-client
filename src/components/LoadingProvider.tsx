"use client";

import React, { createContext, useContext, useState } from "react";
import LoadingOverlay from "./LoadingOverlay";

const LoadingContext = createContext({
  isLoading: false,
  setLoading: (loading: boolean) => {},
});

// ✅ Global Provider for Loading State
export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {isLoading && <LoadingOverlay />} {/* ✅ Display overlay when loading */}
      {children}
    </LoadingContext.Provider>
  );
};

// ✅ Custom Hook to Control Loading
export const useLoading = () => useContext(LoadingContext);
