"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // For detecting route changes
import LoadingOverlay from "@/components/LoadingOverlay";

const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [prevPath, setPrevPath] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (prevPath && prevPath !== pathname) {
      // Route change detected
      setIsLoading(true);

      // Simulate a loading time (adjust as needed)
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 1000);

      return () => clearTimeout(timeout); // Cleanup on unmount
    }

    setPrevPath(pathname); // Update previous path
  }, [pathname, prevPath]);

  return (
    <>
      {isLoading && <LoadingOverlay />} {/* Show overlay during loading */}
      {children}
    </>
  );
};

export default LoadingProvider;
