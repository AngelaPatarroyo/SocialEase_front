'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark');
    }
  };

  return (
    <header className="w-full h-16 px-4 flex justify-between items-center fixed top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-md z-50">
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <Image
          src="/images/actualogo.png"
          alt="SocialEase Logo"
          width={140}
          height={70}
          priority
        />
      </Link>

      {/* Desktop Nav Links */}
      <nav className="hidden md:flex items-center gap-6">
        <Link href="/login" className="hover:underline">
          Login
        </Link>
        <Link
          href="/register"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
        >
          Get Started
        </Link>
        <button
          onClick={toggleDarkMode}
          className="px-3 py-2 rounded-full border hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden px-3 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        {menuOpen ? '✖' : '☰'}
      </button>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="absolute top-16 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg w-48 p-4 flex flex-col gap-4 md:hidden">
          <Link href="/login" onClick={() => setMenuOpen(false)}>
            Login
          </Link>
          <Link
            href="/register"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
            onClick={() => setMenuOpen(false)}
          >
            Get Started
          </Link>
          <button
            onClick={() => {
              toggleDarkMode();
              setMenuOpen(false);
            }}
            className="px-3 py-2 rounded-full border hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      )}
    </header>
  );
}
