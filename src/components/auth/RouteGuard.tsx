"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';
import { getAuthToken } from '@/utils/auth';

interface RouteGuardProps {
  children: React.ReactNode;
}

const protectedRoutes = ['/dashboard', '/projects', '/settings', '/teams', '/chat', '/meetings', '/files'];

export default function RouteGuard({ children }: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading } = useAuthContext();

  useEffect(() => {
    console.log('🛡️ RouteGuard checking:', pathname);
    console.log('🛡️ Is authenticated:', isAuthenticated);
    console.log('🛡️ Loading:', loading);
    
    // Check if current route is protected
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    
    if (isProtectedRoute && !loading) {
      const token = getAuthToken();
      console.log('🛡️ Token exists:', !!token);
      
      if (!isAuthenticated && !token) {
        console.log('🛡️ Redirecting to sign-in');
        router.replace(`/sign-in?redirect=${pathname}`);
        return;
      }
    }
  }, [pathname, isAuthenticated, loading, router]);

  // Show loading or redirect for protected routes
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute && !loading && !isAuthenticated && !getAuthToken()) {
    return null; // Don't render anything while redirecting
  }

  return <>{children}</>;
}
