'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { showNotification } from '@/components/Notification';

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000').replace(/\/+$/, '');

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (!errorParam) return;

    const errorMessage = 
      errorParam === 'unregistered'
        ? 'This Google account is not registered. Please sign up first.'
        : errorParam === 'server'
        ? 'There was a problem with Google login. Please try again.'
        : decodeURIComponent(errorParam);

    setError(errorMessage);
    
    // Clean up URL
    const url = new URL(window.location.href);
    url.searchParams.delete('error');
    window.history.replaceState({}, '', url.toString());
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;

      if (user) {
        // Show beautiful success notification
        showNotification('success', 'Welcome Back! 🎉', `Great to see you again, ${user.name.split(' ')[0]}!`);
        setTimeout(() => router.push('/dashboard'), 2000);
      }
    } catch (err: any) {
      console.error('🔥 Login error:', err);
      const errorMessage = err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Invalid email or password. Please try again.';
      
      setError(errorMessage);
      // Also show error notification
      showNotification('error', 'Login Failed! ❌', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    const url = `${API_BASE}/api/auth/google?mode=login`;
    window.location.assign(url);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 transition-colors">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl px-6 sm:px-8 md:px-10 pt-16 pb-8 w-full max-w-md text-center border border-gray-100 dark:border-gray-700 relative">
        <div className="flex justify-center mb-6">
          <Image src="/images/actualogo.png" alt="SocialEase Logo" width={140} height={140} priority />
        </div>

        <div className="flex flex-col items-center mb-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium px-4 py-3 rounded-xl shadow-lg mb-3 max-w-[220px] text-center relative"
          >
            Hi there! <br /> Ready to start?
            <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-4 h-4 bg-white dark:bg-gray-700 border-l border-b border-gray-200 dark:border-gray-600 rotate-45" />
          </motion.div>
          <motion.div initial={{ y: -8 }} animate={{ y: 0 }} transition={{ duration: 1.2, ease: 'easeOut' }}>
            <Image src="/images/mascot.png" alt="Mascot" width={200} height={200} className="drop-shadow-xl" />
          </motion.div>
        </div>

        <p className="text-gray-500 dark:text-gray-400 text-base mb-6">Take a deep breath and sign in at your own pace.</p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}



        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5" noValidate>
          <input
            type="email"
            placeholder="Email address"
            className="w-full p-3 md:p-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 shadow-sm transition-colors"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full p-3 md:p-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 shadow-sm transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-3 md:py-4 rounded-xl text-lg font-semibold shadow-md transition-colors ${
              loading ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
            }`}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300 dark:border-gray-600" />
          <span className="mx-2 text-gray-500 dark:text-gray-400 text-sm">or</span>
          <hr className="flex-grow border-gray-300 dark:border-gray-600" />
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 dark:border-gray-600 rounded-lg py-3 font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-60"
        >
          <Image src="/images/google-icon.png" alt="Google" width={20} height={20} />
          {googleLoading ? 'Redirecting…' : 'Sign in with Google'}
        </button>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-500 dark:text-blue-400 font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
