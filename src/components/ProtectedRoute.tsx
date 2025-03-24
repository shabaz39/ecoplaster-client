'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Function to check authorization
    const checkAuth = () => {
      // If still loading session, wait
      if (status === 'loading') {
        return;
      }
      
      setIsLoading(false);

      
      
      // Check if session exists
      if (!session) {
        // No session, check if we have a role in localStorage as fallback
        const storedRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
        
        if (storedRole && allowedRoles.includes(storedRole)) {
          console.log("Using stored role for authorization:", storedRole);
          setIsAuthorized(true);
        } else {
          console.log("Redirecting to signin - no valid session or stored role");
          router.push('/auth/signin');
        }
        return;
      }
      
      // Check if user role is allowed
      const userRole = session.user?.role || "user";
      if (allowedRoles.includes(userRole)) {
        console.log("User authorized with role:", userRole);
        setIsAuthorized(true);
        
        // Update localStorage with current role
        if (typeof window !== 'undefined') {
          localStorage.setItem('userRole', userRole);
        }
      } else {
        console.log("User role not allowed:", userRole);
        router.push('/unauthorized');
      }
    };
    
    checkAuth();
  }, [session, status, router, allowedRoles]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-newgreensecond"></div>
      </div>
    );
  }

  // Only render children if authorized
  return isAuthorized ? <>{children}</> : null;
};

export default ProtectedRoute;