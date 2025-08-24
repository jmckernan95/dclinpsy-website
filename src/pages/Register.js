/**
 * User Registration Page with Age Verification
 * Includes secure registration flow with age verification and consent forms
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { registerUser } from '../utils/auth';
import { validatePasswordStrength, calculateAge } from '../utils/encryption';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    dateOfBirth: '',
    password: '',
    confirmPassword: '',
    consentGiven: false
  });
  
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Multi-step form
  const [passwordValidation, setPasswordValidation] = useState({ isValid: false, messages: [] });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Real-time password validation
    if (name === 'password') {
      setPasswordValidation(validatePasswordStrength(value));
    }

    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const calculateUserAge = () => {
    if (!formData.dateOfBirth) return null;
    return calculateAge(formData.dateOfBirth);
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    const stepErrors = [];
    
    // Basic validation for step 1
    if (!formData.username || formData.username.trim().length < 2) {
      stepErrors.push('Username must be at least 2 characters long');
    }
    
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      stepErrors.push('Please enter a valid email address');
    }
    
    if (!formData.dateOfBirth) {
      stepErrors.push('Date of birth is required');
    } else {
      const age = calculateAge(formData.dateOfBirth);
      if (age < 18) {
        stepErrors.push('You must be 18 or older to create an account');
      } else if (age > 100) {
        stepErrors.push('Please enter a valid date of birth');
      }
    }
    
    if (stepErrors.length > 0) {
      setErrors(stepErrors);
      return;
    }
    
    setStep(2);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      console.log('Starting registration process...'); // Debug log
      const result = await registerUser(formData);
      console.log('Registration result:', result); // Debug log
      
      if (result && result.success) {
        // Auto-login after successful registration
        login({
          userId: result.user.id,
          username: result.user.username,
          email: result.user.email
        });
        
        // Always redirect to research prompt after successful registration
        navigate('/research-prompt', { 
          state: { message: 'Account created successfully! Welcome to DClinPsy SJT Practice.' }
        });
      } else {
        console.log('Registration failed:', result); // Debug log
        const errorMessages = (result && result.errors) || ['Registration failed. Please try again.'];
        setErrors(errorMessages);
      }
    } catch (error) {
      console.error('Registration error (caught):', error);
      console.error('Error stack:', error.stack); // More detailed error info
      
      // More specific error messages based on error type
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      if (error.message.includes('Web Crypto')) {
        errorMessage = 'Your browser may not support the required security features. Please try using a modern browser or enable secure context (HTTPS).';
      } else if (error.message.includes('encrypt') || error.message.includes('hash')) {
        errorMessage = 'There was an issue with password security. Please try again or use a different browser.';
      } else if (error.message.includes('storage') || error.message.includes('localStorage')) {
        errorMessage = 'There was an issue saving your account. Please ensure your browser allows local storage and try again.';
      }
      
      setErrors([errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const goBackToStep1 = () => {
    setStep(1);
    setErrors([]);
  };

  const userAge = calculateUserAge();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="text-blue-600 hover:text-blue-800 font-semibold">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mt-4">Create Account</h1>
          <p className="text-gray-600 mt-2">
            Join DClinPsy SJT Practice to track your progress and receive personalized recommendations
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className={`h-1 w-16 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-2 max-w-xs mx-auto">
            <span>Basic Info</span>
            <span>Security & Consent</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Step 1: Basic Information & Age Verification */}
          {step === 1 && (
            <form onSubmit={handleStep1Submit}>
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Name *
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your preferred name"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This will be displayed on your profile (2-30 characters)
                  </p>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="your.email@example.com"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Used for account recovery only
                  </p>
                </div>

                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  {userAge && (
                    <p className={`text-xs mt-1 ${userAge >= 18 ? 'text-green-600' : 'text-red-600'}`}>
                      {userAge >= 18 ? 
                        `✓ Age: ${userAge} years (eligible)` : 
                        `✗ Age: ${userAge} years (must be 18+ to use this app)`
                      }
                    </p>
                  )}
                </div>

                {/* Age Verification Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-800 mb-2">Age Verification Required</h3>
                  <p className="text-sm text-blue-700">
                    This application is designed for individuals aged 18 and above who are preparing for 
                    or considering DClinPsy applications. Your date of birth is encrypted and stored securely.
                  </p>
                </div>
              </div>

              {/* Errors Display */}
              {errors.length > 0 && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">Please correct the following:</h4>
                  <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-6 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition"
              >
                Continue to Security Settings
              </button>
            </form>
          )}

          {/* Step 2: Password & Consent */}
          {step === 2 && (
            <form onSubmit={handleFinalSubmit}>
              <h2 className="text-xl font-semibold mb-4">Security & Consent</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Create a strong password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="text-xs text-gray-600 mb-1">Password Requirements:</div>
                      <ul className="text-xs space-y-1">
                        {passwordValidation.messages.map((message, index) => (
                          <li key={index} className="text-red-600">✗ {message}</li>
                        ))}
                        {passwordValidation.isValid && (
                          <li className="text-green-600">✓ Password meets all requirements</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Confirm your password"
                    required
                  />
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-red-600 mt-1">✗ Passwords do not match</p>
                  )}
                </div>

                {/* Consent Section */}
                <div className="space-y-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-800 mb-2">Data Processing Consent *</h3>
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="consentGiven"
                        checked={formData.consentGiven}
                        onChange={handleInputChange}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        required
                      />
                      <div className="text-sm text-gray-700">
                        I consent to the processing of my personal data as described in the{' '}
                        <Link to="/privacy" target="_blank" className="text-blue-600 hover:underline">
                          Privacy Policy
                        </Link>. I understand that my data is stored locally on my device and I can 
                        delete my account at any time.
                      </div>
                    </label>
                  </div>

                </div>
              </div>

              {/* Errors Display */}
              {errors.length > 0 && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">Please correct the following:</h4>
                  <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex space-x-4 mt-6">
                <button
                  type="button"
                  onClick={goBackToStep1}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || !formData.consentGiven || !passwordValidation.isValid}
                  className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </form>
          )}

          {/* Login Link */}
          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>
            By creating an account, you agree to our terms of service and acknowledge that 
            this is an educational tool designed to supplement formal DClinPsy preparation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;