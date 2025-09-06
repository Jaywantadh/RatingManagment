import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, LogIn, Star, Sparkles, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      console.log('LoginPage: Submitting login form');
      await login(formData.email, formData.password);
      console.log('LoginPage: Login successful, navigating to /');
      toast.success('Login successful!');
      navigate('/');
    } catch (error: any) {
      console.error('LoginPage: Login failed:', error);
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-luxury relative overflow-hidden py-4">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary-500/20 rounded-full blur-xl animate-pulse-slow"></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 bg-luxury-400/20 rounded-full blur-lg animate-float"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-secondary-500/20 rounded-full blur-lg animate-pulse-slow" style={{animationDelay: '1s'}}></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        className="relative z-10 w-full max-w-md p-2 mx-2 sm:mx-0"
      >
        {/* Main Card */}
        <div className="luxury-card p-3 sm:p-4 space-y-3 sm:space-y-4">
          {/* Header */}
          <div className="text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="mx-auto h-12 w-12 bg-gradient-premium rounded-xl flex items-center justify-center mb-2 shadow-glow relative"
            >
              <Star className="h-6 w-6 text-white" />
              <Sparkles className="absolute -top-0.5 -right-0.5 h-4 w-4 text-luxury-400 animate-pulse" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h1 className="text-2xl font-bold luxury-gradient-text mb-1">RateIN</h1>
              <p className="text-gray-300 text-sm font-medium">
                Premium Store Rating Platform
              </p>
              <p className="mt-0.5 text-gray-400 text-xs">
                Sign in to your elite account
              </p>
            </motion.div>
          </div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-3"
            onSubmit={handleSubmit}
          >
            <div className="space-y-3">
              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-400">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-primary-400 transition-colors" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="elite-input pl-12 h-10 text-sm"
                    placeholder="Enter your premium email"
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
              >
                <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-400">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary-400 transition-colors" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="elite-input pl-12 pr-12 h-10 text-sm"
                    placeholder="Enter your secure password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-primary-400 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(249, 115, 22, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="premium-button w-full h-10 text-sm font-bold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="loading-dots">Authenticating</span>
                </div>
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  <span>Access Premium Dashboard</span>
                  <LogIn className="h-4 w-4" />
                </>
              )}
            </motion.button>

            {/* Register Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="text-center pt-2"
            >
              <p className="text-gray-400">
                New to our platform?{' '}
                <Link
                  to="/register"
                  className="font-semibold text-primary-400 hover:text-primary-300 transition-colors duration-300 hover:underline"
                >
                  Join the Elite
                </Link>
              </p>
            </motion.div>
          </motion.form>

          {/* Demo Credentials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-3 p-3 bg-gradient-to-r from-dark-800/40 to-dark-700/40 backdrop-blur-sm rounded-xl border border-primary-500/20"
          >
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="h-5 w-5 text-luxury-400" />
              <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Premium Demo Access</h3>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1.5 px-2 bg-dark-800/60 rounded-lg border border-primary-500/10">
                <span className="text-luxury-400 font-semibold text-xs">System Admin</span>
                <span className="text-gray-300 font-mono text-xs">admin2@ratein.com / Admin123!</span>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2 bg-dark-800/60 rounded-lg border border-primary-500/10">
                <span className="text-primary-400 font-semibold text-xs">Store Owner</span>
                <span className="text-gray-300 font-mono text-xs">storeowner2@ratein.com / Store123!</span>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2 bg-dark-800/60 rounded-lg border border-primary-500/10">
                <span className="text-secondary-400 font-semibold text-xs">Premium User</span>
                <span className="text-gray-300 font-mono text-xs">testuser@ratein.com / Test123!</span>
              </div>
            </div>
            <div className="mt-2 text-center">
              <p className="text-xs text-gray-500">Click credentials to copy • Experience luxury-grade features</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
