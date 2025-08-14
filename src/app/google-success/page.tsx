'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GoogleSuccessPage() {
  const router = useRouter();
  const [message, setMessage] = useState('Signing you in with Google...');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    
    if (token) {
      try {
        localStorage.setItem('token', token);
        
        // Check if this is a new user (only after component is mounted)
        const isNewUser = sessionStorage.getItem('new-user-registration') === 'true';
        setMessage(isNewUser ? 'Setting up your new account...' : 'Signing you in with Google...');
        
        // Clear the new user flag
        sessionStorage.removeItem('new-user-registration');
        
        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
        
      } catch (error) {
        console.error('Error processing Google login:', error);
        setMessage('Error processing login. Redirecting to login page...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } else {
      setMessage('No token found. Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
  }, [router]);

  // Don't render anything until component is mounted (client-side)
  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-xl text-gray-600">{message}</p>
      </div>
    </div>
  );
}
