import { motion } from 'framer-motion';
import { User, Mail, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await register(email, name, password);
    if (result.success) {
      navigate('/');
    } else {
      // Show backend message or fallback text
      setError(result.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-full p-4">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-card-light dark:bg-card-dark p-8 rounded-xl shadow-card border border-border-light dark:border-border-dark w-full max-w-md"
      >
        <h2 className="text-heading-h3 mb-2 text-text-primary-light dark:text-text-primary-dark text-center">Create Account</h2>
        <p className="text-center text-body-md text-text-secondary-light dark:text-text-secondary-dark mb-8">Join FinWise to manage your finances.</p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="relative mb-4">
          <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark" />
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field text-text-primary-light dark:text-text-primary-dark"
            required
          />
        </div>
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
        <button className="w-full bg-primary text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-shadow hover-lift">Signup</button>
        <p className="text-center text-body-sm text-text-secondary-light dark:text-text-secondary-dark mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Login
          </Link>
        </p>
      </motion.form>
    </div>
  );
};

export default Signup;
