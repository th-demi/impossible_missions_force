"use client"; // Mark as Client Component
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import GadgetList from '../components/GadgetList';
import { gadgets } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

function GadgetsContent() {
  const [gadgetList, setGadgetList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAdmin, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get('status'); // Get query parameter

  useEffect(() => {
    const fetchGadgets = async () => {
      try {
        setLoading(true);
        const { data } = await gadgets.getAll(status); // Get response data

        // Ensure that data exists and is correctly structured
        if (data?.data) {
          setGadgetList(data.data); // Access the nested data property
        } else {
          setError('No gadgets found');
        }
        setError('');
      } catch (err) {
        setError('Failed to fetch gadgets');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGadgets();
  }, [status]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Show loading state while checking authentication or fetching gadgets
  if (authLoading || loading || !isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading gadgets...</p>
      </div>
    );
  }

  return (
    <div>
      {error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <GadgetList gadgets={gadgetList} isAdmin={isAdmin()} />
      )}
    </div>
  );
}

export default function GadgetsIndex() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-64">Loading gadgets...</div>}>
      <GadgetsContent />
    </Suspense>
  );
}