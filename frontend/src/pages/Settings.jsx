import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Bell, Shield, Palette, User, Mail, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const [open, setOpen] = useState(null); // 'notifications' | 'privacy' | 'appearance'
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [prefLoading, setPrefLoading] = useState(true);
  const [prefError, setPrefError] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changePassLoading, setChangePassLoading] = useState(false);
  const [changePassMessage, setChangePassMessage] = useState(null);

  // Profile editing states
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);

  const { logout, user } = useAuth();
  const { darkMode, setTheme } = useTheme();

  // Initialize profile fields
  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfileEmail(user.email || '');
    }
  }, [user]);

  useEffect(() => {
    const fetchPrefs = async () => {
      setPrefLoading(true);
      setPrefError(null);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user/preferences`, { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setEmailNotifications(Boolean(data.emailNotifications));
          setPushNotifications(Boolean(data.pushNotifications));
        } else if (response.status === 401) {
          setPrefError('Not logged in');
        } else {
          const err = await response.json().catch(() => null);
          setPrefError(err?.message || 'Failed to load preferences');
        }
      } catch (err) {
        console.error('Failed to fetch preferences', err);
        setPrefError('Network error');
      } finally {
        setPrefLoading(false);
      }
    };
    fetchPrefs();
  }, []);

  const saveProfile = async () => {
    setProfileLoading(true);
    setProfileMessage(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: profileName, email: profileEmail })
      });
      const body = await response.json().catch(() => null);
      if (response.ok) {
        setProfileMessage('Profile updated successfully!');
        // Update would reflect after page refresh or context update
      } else {
        setProfileMessage(body?.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Failed to save profile', err);
      setProfileMessage('Network error');
    } finally {
      setProfileLoading(false);
    }
  };

  const saveNotifications = async () => {
    setPrefError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/preferences`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ emailNotifications, pushNotifications })
      });
      if (!response.ok) {
        const err = await response.json().catch(() => null);
        setPrefError(err?.message || 'Failed to save preferences');
      }
    } catch (err) {
      console.error('Failed to save prefs', err);
      setPrefError('Network error');
    }
  };

  const handleChangePassword = async () => {
    setChangePassLoading(true);
    setChangePassMessage(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const body = await response.json().catch(() => null);
      if (response.ok) {
        setChangePassMessage('Password updated');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        setChangePassMessage(body?.message || 'Failed to update password');
      }
    } catch (err) {
      console.error('Change password failed', err);
      setChangePassMessage('Network error');
    } finally {
      setChangePassLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    // local redirect will happen through auth context
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 text-text-primary-light dark:text-text-primary-dark"
    >
      <div className="flex items-center mb-6">
        <SettingsIcon size={24} className="sm:w-8 sm:h-8 text-primary mr-3" />
        <h2 className="text-h2 font-bold text-gradient">Settings</h2>
      </div>
      <div className="space-y-4">
        {/* My Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 hover-lift"
        >
          <div className="flex items-center mb-4">
            <User size={20} className="sm:w-6 sm:h-6 text-primary mr-3" />
            <div>
              <h3 className="text-lg font-bold">My Profile</h3>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Update your personal information</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Profile Avatar */}
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl" style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
              }}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                  {user?.name || 'User'}
                </p>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark" />
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="Enter your name"
                  className="input-field pl-12"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark" />
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="input-field pl-12"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={saveProfile}
                disabled={profileLoading}
                className="btn-primary flex items-center gap-2"
              >
                <Save size={18} />
                {profileLoading ? 'Saving...' : 'Save Changes'}
              </motion.button>
              {profileMessage && (
                <span className={`text-sm ${profileMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                  {profileMessage}
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Notifications Section */}
        <div className="card p-6 hover-lift">
          <div className="flex items-center">
            <Bell size={20} className="sm:w-6 sm:h-6 text-secondary mr-3" />
            <div>
              <h3 className="text-body-md font-semibold">Notifications</h3>
              <p className="text-body-sm text-text-secondary-light dark:text-text-secondary-dark">Manage your notification preferences.</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm">Email notifications</div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={emailNotifications}
                  onChange={() => setEmailNotifications((v) => !v)}
                />
                <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-primary dark:peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm">Push notifications</div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={pushNotifications}
                  onChange={() => setPushNotifications((v) => !v)}
                />
                <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-primary dark:peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="mt-3 flex gap-3 items-center">
              <button onClick={saveNotifications} className="btn-primary" disabled={prefLoading}>{prefLoading ? 'Loading...' : 'Save'}</button>
              <button onClick={() => { setEmailNotifications(false); setPushNotifications(false); saveNotifications(); }} className="btn-ghost">Reset</button>
              {prefError && <span className="text-sm text-red-500">{prefError}</span>}
            </div>
          </div>
        </div>
        <div className="bg-card-light dark:bg-card-dark p-4 lg:p-6 rounded-lg shadow-card border border-border-light dark:border-border-dark hover-lift">
          <div className="flex items-center">
            <Shield size={20} className="sm:w-6 sm:h-6 text-secondary mr-3" />
            <div>
              <h3 className="text-body-md font-semibold">Privacy & Security</h3>
              <p className="text-body-sm text-text-secondary-light dark:text-text-secondary-dark">Control your privacy settings.</p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <button onClick={handleLogout} className="btn-ghost">Logout</button>
            <div>
              <h4 className="text-sm font-semibold mb-1">Change password</h4>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Use this to update your password. (Feature placeholder)</p>
              <div className="mt-2 flex gap-2">
                <input type="password" placeholder="Current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="input-field w-1/2" />
                <input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input-field w-1/2" />
              </div>
              <div className="mt-3 flex items-center gap-3">
                <button onClick={handleChangePassword} className="btn-primary" disabled={changePassLoading}>{changePassLoading ? 'Updating...' : 'Update'}</button>
                {changePassMessage && <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{changePassMessage}</span>}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-card-light dark:bg-card-dark p-4 lg:p-6 rounded-lg shadow-card border border-border-light dark:border-border-dark hover-lift">
          <div className="flex items-center">
            <Palette size={20} className="sm:w-6 sm:h-6 text-secondary mr-3" />
            <div>
              <h3 className="text-body-md font-semibold">Appearance</h3>
              <p className="text-body-sm text-text-secondary-light dark:text-text-secondary-dark">Customize the app's look and feel.</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-4">
              <label className="inline-flex items-center space-x-3">
                <input type="radio" name="theme" checked={!darkMode} onChange={() => setTheme('light')} />
                <span className="text-sm">Light</span>
              </label>
              <label className="inline-flex items-center space-x-3">
                <input type="radio" name="theme" checked={darkMode} onChange={() => setTheme('dark')} />
                <span className="text-sm">Dark</span>
              </label>
              <div className="ml-auto">
                <button onClick={() => setTheme(darkMode ? 'light' : 'dark')} className="btn-primary">Toggle</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
