import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Check if user is logged in on app start
    const checkAuth = async () => {
      try {
        // Always call the profile endpoint to determine if there's an active session.
        // We cannot rely on reading the token cookie in JS since it's set as HttpOnly for security.
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user/profile`, {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else if (response.status === 401) {
          // Not logged in — expected in dev or when no cookie is present
          setUser(null);
        } else {
          const err = await response.json().catch(() => null);
          console.warn('Auth check non-401:', err);
          setAuthError(err?.message || 'Unexpected auth error');
        }
      } catch (error) {
        // Fetch will throw when backend is down (ERR_CONNECTION_REFUSED)
        // Keep the message friendly and actionable
        const api = import.meta.env.VITE_API_URL || 'backend';
        const message = `Unable to reach authentication service at ${api}. Make sure the backend is running and accessible.`;
        setAuthError(message);
        // Only log the error object (not a noisy stack) when dev
        if (import.meta.env.DEV) console.warn('Auth check failed:', error?.message || error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
    // expose refresh via closure by assigning to stateful ref? We'll provide refreshAuth below
  }, []);

  // Expose a function to re-check auth from UI (retry)
  const refreshAuth = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/profile`, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setAuthError(null);
      } else if (response.status === 401) {
        setUser(null);
      } else {
        const err = await response.json().catch(() => null);
        setAuthError(err?.message || 'Unexpected auth error');
      }
    } catch (error) {
      const api = import.meta.env.VITE_API_URL || 'backend';
      setAuthError(`Unable to reach authentication service at ${api}. Make sure the backend is running and accessible.`);
      if (import.meta.env.DEV) console.warn('Auth check failed:', error?.message || error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        return { success: true };
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
        return { success: false, message: errorData.message };
      }
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  };

  const register = async (email, name, password) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, name, password })
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        return { success: true };
      } else if (response.status === 404) {
        // Helpful message for missing backend route
        return { success: false, message: 'API route not found (404) - is the backend running?' };
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Registration failed' }));
        return { success: false, message: errorData.message };
      }
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  };

  const logout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, authError, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
