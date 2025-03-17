"use client"; // Mark as Client Component
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use `next/navigation` instead of `next/router`
import { useAuth } from './contexts/AuthContext';

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push('/gadgets');
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, loading, router]);

  return (
    <div className="flex justify-center items-center h-64">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">IMF Gadget Management System</h1>
        <p>Redirecting...</p>
      </div>
    </div>
  );
}