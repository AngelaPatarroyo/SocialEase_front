'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GoogleSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      window.location.href = '/dashboard'; 
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg text-gray-600">Signing you in with Google...</p>
    </div>
  );
}
