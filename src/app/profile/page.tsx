'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { UploadCloud, Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';

export default function ProfilePage() {
  const { user, token, logout, refreshProfile, loading } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [theme, setTheme] = useState('light');
  const [avatar, setAvatar] = useState('default-avatar.png');
  const [customAvatar, setCustomAvatar] = useState<File | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const tokenInStorage = localStorage.getItem('token');
    if (!loading && !user && !tokenInStorage) {
      router.push('/login');
    }
  }, [user, loading, router]);

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
    setLoadingSave(true);
    setMessage(null);
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

      await api.put('/user/profile', { name, avatar: avatarUrl, theme }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      await refreshProfile();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setLoadingSave(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    try {
      const payload = user?.provider === 'google' ? { newPassword } : { currentPassword, newPassword };
      const res = await api.put('/user/password', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.token && res.data?.user) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }

      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || err.message || 'Failed to update password' });
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete your account.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await api.delete('/user/delete', {
          headers: { Authorization: `Bearer ${token}` },
        });

        await Swal.fire({
          icon: 'success',
          title: 'Account Deleted',
          text: 'Your account has been deleted successfully.',
          timer: 1500,
          showConfirmButton: false,
        });

        logout();
        router.push('/');
      } catch (err: any) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.response?.data?.message || 'Something went wrong.',
        });
      }
    }
  };

  const displayAvatar = customAvatar
    ? URL.createObjectURL(customAvatar)
    : avatar.startsWith('http')
    ? avatar
    : `/images/${avatar || 'default-avatar.png'}`;

  if (loading || (!user && token)) {
    return <p className="text-center mt-10 text-gray-500">Loading profile...</p>;
  }

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-purple-50 to-white flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-3xl p-8 w-full max-w-2xl border">
        <h1 className="text-3xl font-bold text-purple-700 mb-6 text-center">Your Profile</h1>

        {message && (
          <div className={`mb-4 p-3 rounded-lg text-center font-semibold ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

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
          <label className="block text-gray-600 mb-2 font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 mb-2 font-medium">Email</label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-600 mb-2 font-medium">Theme</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
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

        {user?.provider !== 'google' || user?.password ? (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold mb-4 text-purple-700">Update Password</h2>
            {[{ value: currentPassword, setter: setCurrentPassword, label: 'Current', toggle: showCurrentPassword, setToggle: setShowCurrentPassword },
              { value: newPassword, setter: setNewPassword, label: 'New', toggle: showNewPassword, setToggle: setShowNewPassword },
              { value: confirmPassword, setter: setConfirmPassword, label: 'Confirm New', toggle: showConfirmPassword, setToggle: setShowConfirmPassword }]
              .map(({ value, setter, label, toggle, setToggle }, i) => (
                <div key={i} className="relative mb-3">
                  <input
                    type={toggle ? 'text' : 'password'}
                    placeholder={`${label} Password`}
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setToggle(!toggle)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  >
                    {toggle ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              ))}
            <button
              onClick={handlePasswordUpdate}
              className="bg-purple-600 text-white w-full py-2 rounded-lg hover:bg-purple-700"
            >
              Update Password
            </button>
          </div>
        ) : (
          <div className="mt-8 border-t pt-6 text-center text-sm text-gray-500">
            You signed up with Google. Set a password to allow email login.
          </div>
        )}

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
    </div>
  );
}
