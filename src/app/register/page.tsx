'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Eye, EyeOff } from 'lucide-react';
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, 'Name must be at least 2 characters')
        .required('Name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Please confirm your password'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setMessage(null);
      try {
        await register(values.name, values.email, values.password);
        setMessage('✅ Account created successfully! You can log in now.');
      } catch {
        setMessage('❌ Something went wrong. Try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-white px-4">
      <div className="bg-white rounded-3xl shadow-xl px-6 sm:px-8 md:px-10 pt-16 pb-8 w-full max-w-md text-center border border-gray-100 relative">

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
            className="absolute -top-4 sm:-top-6 bg-white border border-gray-200 text-gray-700 text-sm sm:text-base font-medium px-4 py-3 rounded-xl shadow-lg max-w-[240px]"
          >
            Hi! 👋 <br /> Let’s create your account.
            <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-4 h-4 bg-white border-l border-b border-gray-200 rotate-45"></div>
          </motion.div>
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [-8, 0] }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="relative w-28 h-28 md:w-36 md:h-36 mt-6"
          >
            <Image src="/images/shy-blob.png" alt="Shy Blob" width={180} height={180} className="drop-shadow-xl" />
          </motion.div>
        </div>

        {/* Subtitle */}
        <p className="text-gray-500 text-base mb-6">
          Join SocialEase and start your journey to confident conversations.
        </p>

        {/* Success / Error Message */}
        {message && (
          <p className={`font-medium text-sm mb-4 ${message.includes('successfully') ? 'text-green-600' : 'text-red-500'}`}>
            {message}
          </p>
        )}

        {/* Registration Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-4 md:space-y-5">
          {/* Name */}
          <input
            name="name"
            type="text"
            placeholder="Name"
            className="w-full p-3 border rounded-lg focus:ring-4 focus:ring-purple-100"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={loading}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-xs">{formik.errors.name}</p>
          )}

          {/* Email */}
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg focus:ring-4 focus:ring-purple-100"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={loading}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-xs">{formik.errors.email}</p>
          )}

          {/* Password */}
          <div className="relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full p-3 border rounded-lg focus:ring-4 focus:ring-purple-100"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
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
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-xs">{formik.errors.password}</p>
          )}

          {/* Confirm Password */}
          <div className="relative">
            <input
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              className="w-full p-3 border rounded-lg focus:ring-4 focus:ring-purple-100"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="text-red-500 text-xs">{formik.errors.confirmPassword}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-xl font-semibold transition disabled:bg-gray-300"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500 text-sm">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* ✅ Google Sign-Up Button */}
        <button
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 font-semibold hover:bg-gray-50 transition"
        >
          <Image src="/images/google-icon.png" alt="Google" width={20} height={20} />
          Sign up with Google
        </button>

        {/* Footer */}
        <p className="text-sm text-gray-500 mt-8">
          Already have an account?{' '}
          <Link href="/login" className="text-purple-500 font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
