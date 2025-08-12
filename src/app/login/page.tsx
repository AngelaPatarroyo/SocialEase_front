'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import api from '@/utils/api';

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000').replace(/\/+$/, '');

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (!errorParam) return;

    const showErrorAlert = async () => {
      const alertOptions: SweetAlertOptions =
        errorParam === 'unregistered'
          ? { icon: 'error', title: 'Account not registered', text: 'This Google account is not registered. Please sign up first.' }
          : errorParam === 'server'
          ? { icon: 'error', title: 'Login failed', text: 'There was a problem with Google login. Please try again.' }
          : { icon: 'error', title: 'Login failed', text: decodeURIComponent(errorParam) };

      await Swal.fire(alertOptions);
      const url = new URL(window.location.href);
      url.searchParams.delete('error');
      window.history.replaceState({}, '', url.toString());
    };

    showErrorAlert();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user, error, message } = res.data;

      if (!token || !user || error || message === 'User not found') {
        throw new Error(message || error || 'Login failed');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      await Swal.fire({
        icon: 'success',
        title: 'Welcome back!',
        text: `Glad to see you again, ${user.name.split(' ')[0]}!`,
        timer: 1500,
        showConfirmButton: false,
      });

      // Check if user has completed self-assessment
      try {
        const saRes = await api.get('/self-assessment');
        const hasSelfAssessment = saRes.data?.data && Array.isArray(saRes.data.data) && saRes.data.data.length > 0;
        
        // Always redirect to dashboard - the modal will appear automatically if needed
        setTimeout(() => router.push('/dashboard'), 400);
      } catch (error) {
        // If we can't check self-assessment status, default to dashboard
        console.warn('Could not check self-assessment status, redirecting to dashboard');
        setTimeout(() => router.push('/dashboard'), 400);
      }
    } catch (err: any) {
      console.error('🔥 Login error:', err);
      setLoading(false);
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      await new Promise((r) => setTimeout(r, 100));
      await Swal.fire({
        icon: 'error',
        title: 'Login failed',
        text:
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          'Invalid email or password. Please try again.',
        allowOutsideClick: false,
        allowEscapeKey: true,
      });
    }
  };

  // FRONTEND-ONLY FIX: point to your existing backend route
  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    const url = `${API_BASE}/api/auth/google?mode=login`;
    window.location.assign(url);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-white px-4">
      <div className="bg-white rounded-3xl shadow-xl px-6 sm:px-8 md:px-10 pt-16 pb-8 w-full max-w-md text-center border border-gray-100 relative">
        <div className="flex justify-center mb-6">
          <Image src="/images/actualogo.png" alt="SocialEase Logo" width={140} height={140} priority />
        </div>

        <div className="flex flex-col items-center mb-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white border border-gray-200 text-gray-700 text-sm font-medium px-4 py-3 rounded-xl shadow-lg mb-3 max-w-[220px] text-center relative"
          >
            Hi there! <br /> Ready to start?
            <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-4 h-4 bg-white border-l border-b border-gray-200 rotate-45" />
          </motion.div>
          <motion.div initial={{ y: -8 }} animate={{ y: 0 }} transition={{ duration: 1.2, ease: 'easeOut' }}>
            <Image src="/images/mascot.png" alt="Mascot" width={200} height={200} className="drop-shadow-xl" />
          </motion.div>
        </div>

        <p className="text-gray-500 text-base mb-6">Take a deep breath and sign in at your own pace.</p>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5" noValidate>
          <input
            type="email"
            placeholder="Email address"
            className="w-full p-3 md:p-4 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-100 shadow-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full p-3 md:p-4 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-100 shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-3 md:py-4 rounded-xl text-lg font-semibold shadow-md transition ${
              loading ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500 text-sm">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 font-semibold hover:bg-gray-50 transition disabled:opacity-60"
        >
          <Image src="/images/google-icon.png" alt="Google" width={20} height={20} />
          {googleLoading ? 'Redirecting…' : 'Sign in with Google'}
        </button>

        <p className="text-sm text-gray-500 mt-6">
          Don’t have an account?{' '}
          <Link href="/register" className="text-blue-500 font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
