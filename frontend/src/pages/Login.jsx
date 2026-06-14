import { motion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, authError, refreshAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-card-light dark:bg-card-dark p-8 rounded-xl shadow-card border border-border-light dark:border-border-dark w-full max-w-md"
      >
        <h2 className="text-heading-h3 mb-2 text-text-primary-light dark:text-text-primary-dark text-center">Welcome Back!</h2>
        <p className="text-center text-body-md text-text-secondary-light dark:text-text-secondary-dark mb-8">Login to continue to FinWise.</p>

        {error && <p className="text-red-500 text-center mb-4 text-body-sm">{error}</p>}
        {authError && (
          <div className="text-center mb-4">
            <p className="text-sm text-yellow-500">{authError}</p>
            <button onClick={refreshAuth} className="mt-2 btn-primary">Retry</button>
          </div>
        )}

        <div className="relative mb-4">
          <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field pl-12"
            required
          />
        </div>
        <div className="relative mb-6">
          <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field pl-12"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-shadow hover-lift disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p className="text-center text-body-sm text-text-secondary-light dark:text-text-secondary-dark mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </motion.form>
    </div>
  );
};

export default Login;
