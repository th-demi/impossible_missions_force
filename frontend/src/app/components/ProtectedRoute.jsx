import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (adminOnly && !isAdmin()) {
        router.push('/gadgets');
      }
    }
  }, [isAuthenticated, isAdmin, loading, router, adminOnly]);

  if (loading || !isAuthenticated || (adminOnly && !isAdmin())) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return children;
};

export default ProtectedRoute;