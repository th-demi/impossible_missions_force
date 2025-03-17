"use client"; // Mark as Client Component
import { useRouter } from 'next/navigation'; // Use `next/navigation`
import GadgetForm from '../../components/GadgetForm';
import { gadgets } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect } from 'react';

export default function NewGadget() {
  const router = useRouter();
  const { isAdmin, isAuthenticated, loading: authLoading } = useAuth();

  // Handle gadget creation
  const handleCreate = async (formData) => {
    try {
      const { data } = await gadgets.create(formData);
      console.log('Gadget creation response:', data); // Debugging

      // Redirect to the new gadget's detail page
      if (data.data && data.data.id) {
        router.push(`/gadgets/${data.data.id}`);
      } else {
        throw new Error('Gadget ID not found in response');
      }
    } catch (err) {
      console.error(err);
      throw err; // Propagate the error to the form for handling
    }
  };

  // Redirect to login if not authenticated or not admin
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin())) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Show loading state while checking authentication
  if (authLoading || !isAuthenticated || !isAdmin()) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Gadget</h1>
      <GadgetForm onSubmit={handleCreate} />
    </div>
  );
}