'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GoogleSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const isNewUser = sessionStorage.getItem('new-user-registration') === 'true';

    if (token) {
      localStorage.setItem('token', token);
      
      // Clear the new user flag
      sessionStorage.removeItem('new-user-registration');
      
      if (isNewUser) {
        // New user: redirect to dashboard (self-assessment modal will appear automatically)
        window.location.href = '/dashboard';
      } else {
        // Existing user: redirect to dashboard
        window.location.href = '/dashboard';
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg text-gray-600">
        {sessionStorage.getItem('new-user-registration') === 'true' 
          ? 'Setting up your new account...' 
          : 'Signing you in with Google...'
        }
      </p>
    </div>
  );
}
