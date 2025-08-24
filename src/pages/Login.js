/**
 * Login Page Component
 * Secure authentication with rate limiting and user-friendly error handling
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { loginUser, checkRateLimit } from '../utils/auth';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoggedIn } = useAuth();
  
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo);
    }
  }, [isLoggedIn, navigate, location]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (error) {
      setError('');
    }
    
    if (rateLimited) {
      setRateLimited(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Check rate limiting
      if (!checkRateLimit(formData.usernameOrEmail)) {
        setRateLimited(true);
        setError('Too many login attempts. Please wait 15 minutes before trying again.');
        setLoading(false);
        return;
      }

      const result = await loginUser(formData.usernameOrEmail, formData.password);
      
      if (result.success) {
        // Set authentication state
        login({
          userId: result.user.id,
          username: result.user.username,
          email: result.user.email,
          researchDataConsent: result.user.researchDataConsent
        });
        
        // Redirect to intended page or home
        const redirectTo = location.state?.from?.pathname || '/';
        navigate(redirectTo, { 
          state: { message: `Welcome back, ${result.user.username}!` }
        });
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Since we're using localStorage-based auth, we can't send reset emails
    // Instead, show instructions for account recovery
    setError('');
    alert(`Account Recovery Instructions:

Since this app stores data locally on your device, password reset via email is not available. 

If you've forgotten your password:
1. You can create a new account with a different email address
2. Your previous test history will remain on this device under the old account
3. For security reasons, we cannot recover passwords for local accounts

Contact help@example.com if you need assistance with account management.`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="text-blue-600 hover:text-blue-800 font-semibold">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mt-4">Sign In</h1>
          <p className="text-gray-600 mt-2">
            Access your DClinPsy SJT Practice account
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="usernameOrEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Username or Email
                </label>
                <input
                  type="text"
                  id="usernameOrEmail"
                  name="usernameOrEmail"
                  value={formData.usernameOrEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your username or email"
                  required
                  autoComplete="username"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className={`mt-4 p-4 rounded-lg border ${
                rateLimited 
                  ? 'bg-orange-50 border-orange-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <p className={`text-sm font-medium ${
                  rateLimited ? 'text-orange-800' : 'text-red-800'
                }`}>
                  {rateLimited ? '⚠️ ' : '❌ '}{error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || rateLimited}
              className="w-full mt-6 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              Forgot your password?
            </button>
          </div>

          {/* Register Link */}
          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:underline font-medium">
                Create one here
              </Link>
            </p>
          </div>
        </div>

        {/* Anonymous Practice Option */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-800 mb-2">Just Want to Practice?</h3>
          <p className="text-sm text-blue-700 mb-3">
            You can use the app without creating an account. However, you won't have access to 
            progress tracking, personalized recommendations, or data persistence.
          </p>
          <Link
            to="/practice?anonymous=true"
            className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
          >
            Practice Anonymously
          </Link>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p className="mb-2">
            🔒 Your data is stored securely on your device. We use industry-standard 
            encryption for password protection.
          </p>
          <p>
            Having trouble? Contact{' '}
            <a href="mailto:help@example.com" className="text-blue-600 hover:underline">
              help@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;