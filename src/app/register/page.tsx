'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Eye, EyeOff } from 'lucide-react';
import api from '@/utils/api';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      router.push('/dashboard');
    }
  }, [router]);

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', confirmPassword: '' },
    validationSchema: Yup.object({
      name: Yup.string()
        .matches(/^[a-zA-Z\s]*$/, 'Name can only contain letters and spaces')
        .min(2, 'Name must be at least 2 characters')
        .required('Name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .matches(/.+@.+\.(com|co\.uk)$/, 'Email must end in .com or .co.uk')
        .required('Email is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[a-z]/, 'Must include lowercase')
        .matches(/[A-Z]/, 'Must include uppercase')
        .matches(/\d/, 'Must include a number')
        .matches(/[@$!%*?&]/, 'Must include a symbol')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Please confirm your password'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      try {
        // Register the user
        await api.post('/auth/register', {
          name: values.name,
          email: values.email,
          password: values.password,
        });

        // Automatically log in the user after successful registration
        try {
          await login(values.email, values.password);
          
          setSuccess('Account created successfully! 🎉 Welcome to SocialEase!');
          setTimeout(() => router.push('/dashboard'), 2000);
          
        } catch (loginErr: any) {
          // If auto-login fails, show message to manually log in
          setSuccess('Account created! Please log in to continue.');
          setTimeout(() => router.push('/login'), 2000);
        }
        
        formik.resetForm();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  const handleGoogleSignUp = () => {
    // Store a flag to indicate this is a new user registration
    sessionStorage.setItem('new-user-registration', 'true');
    
    // Use the same endpoint pattern as the login page
    const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000').replace(/\/+$/, '');
    const url = `${API_BASE}/api/auth/google?mode=register`;
    window.location.assign(url);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 transition-colors">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl px-6 sm:px-8 md:px-10 pt-16 pb-8 w-full max-w-md text-center border border-gray-100 dark:border-gray-700 relative">

        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Image src="/images/actualogo.png" alt="SocialEase Logo" width={140} height={140} priority />
        </div>

        {/* Mascot + Bubble */}
        <div className="relative flex justify-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute -top-4 sm:-top-6 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm sm:text-base font-medium px-4 py-3 rounded-xl shadow-lg max-w-[240px]"
          >
            Hi! 👋 <br /> Let's create your account.
            <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-4 h-4 bg-white dark:bg-gray-700 border-l border-b border-gray-200 dark:border-gray-600 rotate-45"></div>
          </motion.div>
          <motion.div
            initial={{ y: -8 }}
            animate={{ y: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="relative w-28 h-28 md:w-36 md:h-36 mt-6"
          >
            <Image src="/images/shy-blob.png" alt="Shy Blob" width={180} height={180} className="drop-shadow-xl" />
          </motion.div>
        </div>

        <p className="text-gray-500 dark:text-gray-400 text-base mb-6">
          Join SocialEase and start your journey to confident conversations.
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-4 md:space-y-5">

          <input
            name="name"
            type="text"
            placeholder="Name"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/30 transition-colors"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={loading}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 dark:text-red-400 text-xs">{formik.errors.name}</p>
          )}

          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/30 transition-colors"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={loading}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 dark:text-red-400 text-xs">{formik.errors.email}</p>
          )}

          <div className="relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/30 transition-colors"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
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
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 dark:text-red-400 text-xs">{formik.errors.password}</p>
          )}

          <div className="relative">
            <input
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/30 transition-colors"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="text-red-500 dark:text-red-400 text-xs">{formik.errors.confirmPassword}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-3 md:py-4 rounded-xl text-lg font-semibold shadow-md transition-colors ${
              loading ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' : 'bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700'
            }`}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300 dark:border-gray-600" />
          <span className="mx-2 text-gray-500 dark:text-gray-400 text-sm">or</span>
          <hr className="flex-grow border-gray-300 dark:border-gray-600" />
        </div>

        {/* Google Register */}
        <button
          onClick={handleGoogleSignUp}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 dark:border-gray-600 rounded-lg py-3 font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
        >
          <Image src="/images/google-icon.png" alt="Google" width={20} height={20} />
          Sign up with Google
        </button>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">
          Already have an account?{' '}
          <Link href="/login" className="text-purple-500 dark:text-purple-400 font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
