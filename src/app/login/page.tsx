'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '@/utils/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const showAlert = (options: any) => {
    Swal.fire(options);
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      router.push('/dashboard');
    }

    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get('error');

    if (errorParam === 'unregistered') {
      showAlert({
        icon: 'error',
        title: 'Account not registered',
        text: 'This Google account is not registered. Please sign up first.',
      });
    } else if (errorParam === 'server') {
      showAlert({
        icon: 'error',
        title: 'Login failed',
        text: 'There was a problem with Google login. Please try again.',
      });
    } else if (errorParam === 'No account found') {
      showAlert({
        icon: 'warning',
        title: 'No account found',
        text: 'Please sign up first or try a different email address.',
      });
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      showAlert({
        icon: 'success',
        title: 'Welcome back!',
        text: `Glad to see you again, ${user.name.split(' ')[0]}!`,
        timer: 1800,
        showConfirmButton: false,
      });

      setTimeout(() => {
        router.push('/dashboard');
      }, 1800);
    } catch {
      showAlert({
        icon: 'error',
        title: 'Invalid credentials',
        text: 'Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE}/auth/google?mode=login`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-white px-4">
      <div className="bg-white rounded-3xl shadow-xl px-6 sm:px-8 md:px-10 pt-16 pb-8 w-full max-w-md text-center border border-gray-100 relative">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/images/actualogo.png"
            alt="SocialEase Logo"
            width={140}
            height={140}
            priority
          />
        </div>

        {/* Mascot + Bubble */}
        <div className="flex flex-col items-center mb-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white border border-gray-200 text-gray-700 text-sm font-medium px-4 py-3 rounded-xl shadow-lg mb-3 max-w-[220px] text-center relative"
          >
            Hi there! <br /> Ready to start?
            <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-4 h-4 bg-white border-l border-b border-gray-200 rotate-45"></div>
          </motion.div>
          <motion.div
            initial={{ y: -8 }}
            animate={{ y: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            <Image
              src="/images/mascot.png"
              alt="Mascot"
              width={200}
              height={200}
              className="drop-shadow-xl"
            />
          </motion.div>
        </div>

        <p className="text-gray-500 text-base mb-6">Take a deep breath and sign in at your own pace.</p>

        {/* Email & Password Login */}
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
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
            className={`w-full text-white py-3 md:py-4 rounded-xl text-lg font-semibold shadow-md transition ${loading ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500 text-sm">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 font-semibold hover:bg-gray-50 transition"
        >
          <Image src="/images/google-icon.png" alt="Google" width={20} height={20} />
          Sign in with Google
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
