import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';

const Profile = () => {
  const { user, token, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    password: '',
  });
  const [saving, setSaving] = useState(false);

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-8'>
          Profile
        </h1>
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-700'>
          <div className='flex items-center space-x-6 mb-6'>
            <div className='w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center'>
              <span className='text-white font-bold text-2xl'>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h2 className='text-2xl font-semibold text-gray-900 dark:text-white'>
                {user?.name || 'User'}
              </h2>
              <p className='text-gray-600 dark:text-gray-400'>
                {user?.email || ''}
              </p>
            </div>
          </div>
          {/* Edit controls */}
          <div className='flex justify-end mb-4'>
            <button
              onClick={() => setIsEditing((s) => !s)}
              className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition'
            >
              {isEditing ? 'Close' : 'Edit Profile'}
            </button>
          </div>

          <div className='space-y-4'>
            {isEditing && (
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Name
                </label>
                <input
                  type='text'
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 mt-3'>
                  Password (leave blank to keep current)
                </label>
                <input
                  type='password'
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />

                <div className='flex space-x-2 mt-4'>
                  <button
                    onClick={async () => {
                      // call update
                      setSaving(true);
                      try {
                        const payload = { name: form.name };
                        if (form.password) payload.password = form.password;
                        const resp = await authAPI.updateCurrentUser(payload);
                        // normalize response: could be { user: {...} } or user object directly
                        const updatedUser =
                          resp?.user || resp?.data || resp || {};
                        // update context and localStorage via login helper (preserve token)
                        login(updatedUser, token);
                        // clear password field
                        setForm((f) => ({ ...f, password: '' }));
                        setIsEditing(false);
                        alert('Profile updated successfully');
                      } catch (err) {
                        console.error('Error updating profile:', err);
                        const backendMessage =
                          typeof err.response?.data === 'string'
                            ? err.response.data
                            : err.response?.data?.message ||
                              err.response?.data?.detail ||
                              '';
                        alert(
                          backendMessage ||
                            err.message ||
                            'Failed to update profile'
                        );
                      } finally {
                        setSaving(false);
                      }
                    }}
                    disabled={saving}
                    className='px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition disabled:opacity-60'
                  >
                    {saving ? 'Saving...' : 'Update'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setForm({ name: user?.name || '', password: '' });
                    }}
                    className='px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition'
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* rest of profile details */}
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                User ID
              </label>
              <p className='text-gray-900 dark:text-white'>
                {user?.user_id || 'N/A'}
              </p>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Email
              </label>
              <p className='text-gray-900 dark:text-white'>
                {user?.email || 'N/A'}
              </p>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Name
              </label>
              <p className='text-gray-900 dark:text-white'>
                {user?.name || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
