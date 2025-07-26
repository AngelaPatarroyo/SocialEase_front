'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      window.location.href = '/dashboard';
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-white px-4">
      <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 w-full max-w-md text-center border border-gray-100 relative">
        {/* Mascot + Big Speech Bubble */}
        <div className="relative flex justify-center mb-8">
          {/* Larger Speech Bubble */}
          <div className="absolute -top-12 sm:-top-14 md:-top-16 right-2 sm:right-8 bg-white border border-gray-200 text-gray-700 text-base sm:text-lg font-medium px-4 py-3 rounded-xl shadow-lg max-w-[220px] leading-snug">
            Hi there! <br /> Ready to start?
            {/* Bubble Tail */}
            <div className="absolute left-6 top-full w-4 h-4 bg-white border-l border-b border-gray-200 transform rotate-45"></div>
          </div>
          {/* Mascot */}
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48">
            <Image
              src="/images/mascot.png"
              alt="Mascot"
              width={220}
              height={220}
              className="drop-shadow-xl"
              style={{ filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.15))' }}
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2">Welcome Back</h1>
        <p className="text-gray-500 text-base mb-6">
          Take a deep breath and sign in at your own pace.
        </p>

        {/* Error */}
        {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
          <input
            type="email"
            placeholder="Email address"
            className="w-full p-3 md:p-4 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-100 shadow-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 md:p-4 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-100 shadow-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 md:py-4 rounded-xl text-lg font-semibold hover:bg-blue-600 transition disabled:bg-gray-300 shadow-md"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-gray-500 mt-8">
          Don’t have an account?{' '}
          <Link href="/register" className="text-blue-500 font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
