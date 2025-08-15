'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import api from '@/utils/api';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { UploadCloud, Eye, EyeOff, Shield, Key, Info } from 'lucide-react';
import { showNotification } from '@/components/Notification';
import Link from 'next/link';

interface PasswordStatus {
  hasPassword: boolean;
  canSetPassword: boolean;
  requiresCurrentPassword: boolean;
  authType: 'local' | 'google' | 'hybrid';
}

export default function ProfilePage() {
  const { user, token, logout, refreshProfile, loading } = useAuth();
  const { theme: globalTheme, setTheme } = useTheme();
  const router = useRouter();

  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('default-avatar.png');
  const [customAvatar, setCustomAvatar] = useState<File | null>(null);
  const [localTheme, setLocalTheme] = useState<'light' | 'dark'>('light');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const [passwordStatus, setPasswordStatus] = useState<PasswordStatus | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    const tokenInStorage = localStorage.getItem('token');
    if (!loading && !user && !tokenInStorage) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAvatar(user.avatar || 'default-avatar.png');
      // Initialize local theme from user profile
      if (user.theme) {
        setLocalTheme(user.theme as 'light' | 'dark');
      }
    }
  }, [user]); // Only depend on user

  // Sync local theme with global theme changes (from navbar toggle)
  useEffect(() => {
    setLocalTheme(globalTheme);
  }, [globalTheme]);

  useEffect(() => {
    if (token) {
      fetchPasswordStatus();
    }
  }, [token]);

  const fetchPasswordStatus = async () => {
    try {
      const response = await api.get('/user/password/status', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('[Profile] Backend password status:', response.data);
      setPasswordStatus(response.data);
    } catch (error) {
      console.error('Failed to fetch password status:', error);
      // Fallback to basic status based on user provider
      const isGoogleUser = user?.provider === 'google';
      const hasExistingPassword = !!user?.password;
      
      console.log('[Profile] Fallback password status:', {
        isGoogleUser,
        hasExistingPassword,
        userProvider: user?.provider,
        userPassword: user?.password
      });
      
      setPasswordStatus({
        hasPassword: hasExistingPassword,
        canSetPassword: isGoogleUser,
        requiresCurrentPassword: hasExistingPassword, // Only require current password if user actually has one
        authType: isGoogleUser ? 'google' : 'local'
      });
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCustomAvatar(e.target.files[0]);
    }
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    // Don't do anything if the theme is already the same
    if (newTheme === localTheme) return;
    
    // Just update the local state for now - don't save to backend yet
    // The theme will be saved when user clicks "Save Changes" button
    setLocalTheme(newTheme);
  };

  const handleSave = async () => {
    setLoadingSave(true);
    try {
      let avatarUrl = avatar;

      if (customAvatar) {
        const { data: sig } = await api.get('/cloudinary/signature');
        const formData = new FormData();
        formData.append('file', customAvatar);
        formData.append('api_key', sig.api_key);
        formData.append('timestamp', sig.timestamp.toString());
        formData.append('signature', sig.signature);
        formData.append('folder', sig.folder);
        formData.append('upload_preset', sig.upload_preset);

        const cloudRes = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: 'POST', body: formData }
        );

        const cloudData = await cloudRes.json();
        if (!cloudRes.ok) throw new Error(cloudData.error?.message || 'Cloudinary upload failed');
        avatarUrl = cloudData.secure_url;
        setAvatar(avatarUrl);
      }

      await api.put('/user/profile', { name, avatar: avatarUrl, theme: localTheme }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update global theme after successful save
      setTheme(localTheme);
      
      showNotification('success', 'Profile updated successfully!', 'Theme and other changes have been saved.');
      await refreshProfile();
    } catch (err: any) {
      showNotification('error', 'Error', err.message || 'Failed to update profile.');
    } finally {
      setLoadingSave(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      showNotification('error', 'Validation Error', 'Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      showNotification('error', 'Validation Error', 'Password must be at least 6 characters long');
      return;
    }

    setLoadingPassword(true);

    try {
      const payload = passwordStatus?.requiresCurrentPassword 
        ? { currentPassword, newPassword } 
        : { newPassword };

      console.log('[Profile] Password update payload:', {
        payload,
        requiresCurrentPassword: passwordStatus?.requiresCurrentPassword,
        hasPassword: passwordStatus?.hasPassword,
        isGoogleUser: user?.provider === 'google'
      });

      const res = await api.put('/user/password', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.token && res.data?.user) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }

      showNotification('success', 'Success', 'Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Refresh password status
      await fetchPasswordStatus();
    } catch (err: any) {
      showNotification('error', 'Error', err.response?.data?.message || err.message || 'Failed to update password');
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      await api.delete('/user/delete', {
        headers: { Authorization: `Bearer ${token}` },
      });

      showNotification('success', 'Account Deleted', 'Your account has been deleted successfully.');

      logout();
      router.push('/');
    } catch (err: any) {
      showNotification('error', 'Error', err.response?.data?.message || 'Something went wrong.');
    } finally {
      setShowDeleteConfirmation(false);
    }
  };

  const cancelDeleteAccount = () => {
    setShowDeleteConfirmation(false);
  };

  const displayAvatar = customAvatar
    ? URL.createObjectURL(customAvatar)
    : avatar.startsWith('http')
    ? avatar
    : `/images/${avatar || 'default-avatar.png'}`;

  const getPasswordStatusMessage = () => {
    if (!passwordStatus) return '';
    
    if (passwordStatus.authType === 'google' && !passwordStatus.hasPassword) {
      return 'You can set a password to enable email/password login alongside Google OAuth.';
    }
    
    if (passwordStatus.authType === 'hybrid') {
      return 'You have both Google OAuth and email/password authentication enabled.';
    }
    
    if (passwordStatus.authType === 'local') {
      return 'You can only login with your email and password.';
    }
    
    return '';
  };

  const getPasswordStatusBadge = () => {
    if (!passwordStatus) return null;
    
    const getBadgeColor = () => {
      if (passwordStatus.authType === 'hybrid') return 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700';
      if (passwordStatus.authType === 'google') return 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700';
      return 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-700';
    };

    const getBadgeText = () => {
      if (passwordStatus.authType === 'hybrid') return 'Dual Auth';
      if (passwordStatus.authType === 'google') return 'Google OAuth';
      return 'Local Auth';
    };

    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${getBadgeColor()}`}>
        <Shield size={16} />
        {getBadgeText()}
      </div>
    );
  };

  if (loading || (!user && token)) {
    return <p className="text-center mt-10 text-gray-500">Loading profile...</p>;
  }

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col items-center transition-colors">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-3xl p-8 w-full max-w-2xl border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-purple-700 dark:text-purple-300 mb-6 text-center">Your Profile</h1>

        {/* Quick Navigation */}
        <div className="mb-6">
          <div className="flex flex-wrap justify-center gap-3">
            <Link 
              href="/" 
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-900/50 transition-colors border border-gray-200 dark:border-gray-700 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
            
            <Link 
              href="/dashboard" 
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors border border-indigo-200 dark:border-indigo-700 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Dashboard
            </Link>
            <Link 
              href="/scenarios" 
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors border border-blue-200 dark:border-blue-700 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Scenarios
            </Link>
            <Link 
              href="/goals" 
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors border border-green-200 dark:border-green-700 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Goals
            </Link>
            <Link 
              href="/self-assessment" 
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors border border-purple-200 dark:border-purple-700 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Assessment
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center mb-6">
          <Image
            src={displayAvatar}
            alt="User Avatar"
            width={120}
            height={120}
            className="rounded-full border-4 border-purple-500 mb-4 object-cover shadow-lg"
            priority
          />
          <div className="relative text-center">
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            <label
              htmlFor="avatar-upload"
              className="inline-flex items-center gap-2 cursor-pointer bg-purple-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-purple-700 transition"
            >
              <UploadCloud size={18} />
              Change Avatar
            </label>
            {customAvatar && (
              <p className="text-sm text-gray-600 mt-2">
                Selected: <span className="font-medium">{customAvatar.name}</span>
              </p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 dark:text-gray-300 mb-2 font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 dark:text-gray-300 mb-2 font-medium">Email</label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full p-3 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg cursor-not-allowed text-gray-500 dark:text-gray-400"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-600 dark:text-gray-300 mb-2 font-medium">Theme</label>
          <div className="flex items-center gap-3">
            <select
              value={localTheme}
              onChange={(e) => handleThemeChange(e.target.value as 'light' | 'dark')}
              className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
            <div className={`w-4 h-4 rounded-full ${localTheme === 'dark' ? 'bg-gray-800 border-2 border-gray-600' : 'bg-white border-2 border-gray-300'}`} />
          </div>
          
        </div>

        <button
          onClick={handleSave}
          disabled={loadingSave}
          className={`w-full py-3 rounded-lg text-white font-semibold transition ${
            loadingSave ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {loadingSave ? 'Saving...' : 'Save Changes'}
        </button>

        {/* Password Management Section */}
        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-purple-700 dark:text-purple-300">Password Management</h2>
            {getPasswordStatusBadge()}
          </div>

          {passwordStatus && (
            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="flex items-start gap-3">
                <Info size={20} className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-700 dark:text-gray-200">
                  <p className="font-medium mb-1">Authentication Status</p>
                  <p>{getPasswordStatusMessage()}</p>
                  {passwordStatus.canSetPassword && !passwordStatus.hasPassword && (
                    <p className="text-blue-600 dark:text-blue-400 font-medium mt-2">
                      💡 You can set a password to enable email/password login!
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Password Form */}
          <div className="space-y-3">
            {passwordStatus?.requiresCurrentPassword && (
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg pr-10 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            )}

            {/* Debug info */}
            <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 p-2 rounded">
              Debug: requiresCurrentPassword = {String(passwordStatus?.requiresCurrentPassword)}, 
              hasPassword = {String(passwordStatus?.hasPassword)}, 
              provider = {user?.provider}
            </div>

            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg pr-10 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg pr-10 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              onClick={handlePasswordUpdate}
              disabled={loadingPassword || !newPassword || newPassword !== confirmPassword}
              className={`w-full py-3 rounded-lg text-white font-semibold transition flex items-center justify-center gap-2 ${
                loadingPassword || !newPassword || newPassword !== confirmPassword
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {loadingPassword ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Key size={18} />
                  {passwordStatus?.hasPassword ? 'Update Password' : 'Set Password'}
                </>
              )}
            </button>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-6 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold"
        >
          Logout
        </button>

        <button
          onClick={handleDeleteAccount}
          className="w-full mt-4 py-3 rounded-lg bg-red-700 hover:bg-red-800 text-white font-semibold"
        >
          Delete Account
        </button>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/40">
                <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-4">Delete Account</h3>
              <div className="mt-2 px-7">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to permanently delete your account? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-center space-x-3 mt-6">
                <button
                  onClick={cancelDeleteAccount}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteAccount}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
