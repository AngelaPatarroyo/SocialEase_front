'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [theme, setTheme] = useState('light');
  const [avatar, setAvatar] = useState('default-avatar.png');
  const [customAvatar, setCustomAvatar] = useState<File | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setTheme(user.theme || 'light');
      setAvatar(user.avatar || 'default-avatar.png');
    }
  }, [user]);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCustomAvatar(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);

    try {
      let avatarUrl = avatar;

      if (customAvatar) {
        const formData = new FormData();
        formData.append('file', customAvatar);

        const uploadRes = await api.post('/upload/avatar', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        avatarUrl = uploadRes.data.url;
      }

      await api.put(
        '/user/profile',
        { name, avatar: avatarUrl, theme },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update profile.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    try {
      await api.put(
        '/user/password',
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update password'
      });
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login'); // Redirect after logout
  };

  const displayAvatar = customAvatar
    ? URL.createObjectURL(customAvatar)
    : `/images/${avatar}`;

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-purple-50 to-white flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-3xl p-8 w-full max-w-2xl border">
        <h1 className="text-3xl font-bold text-purple-700 mb-6 text-center">Your Profile</h1>

        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-center font-semibold ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Profile Avatar */}
        <div className="flex flex-col items-center mb-6">
          <Image
            src={displayAvatar}
            alt="Selected Avatar"
            width={100}
            height={100}
            className="rounded-full border-4 border-purple-500 mb-4"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="mb-4"
          />
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-2 font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-2 font-medium">Email</label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
          />
        </div>

        {/* Theme */}
        <div className="mb-6">
          <label className="block text-gray-600 mb-2 font-medium">Theme</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold shadow-md transition ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>

        {/* Password Update Section */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold mb-4 text-purple-700">Update Password</h2>
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-3"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-3"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-3"
          />
          <button
            onClick={handlePasswordUpdate}
            className="bg-purple-600 text-white w-full py-2 rounded-lg hover:bg-purple-700"
          >
            Update Password
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-6 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
