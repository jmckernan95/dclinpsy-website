/**
 * Authentication Context for DClinPsy SJT Practice App
 * Manages user authentication state throughout the application
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, logoutUser, isAuthenticated } from '../utils/auth';

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = () => {
      try {
        const currentUser = getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsLoggedIn(true);
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Check session periodically (every 5 minutes)
    const interval = setInterval(checkSession, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Login function to be called after successful authentication
  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  // Logout function
  const logout = () => {
    try {
      logoutUser();
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Error during logout:', error);
      // Still clear local state even if localStorage fails
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  // Update user data (useful after profile updates)
  const updateUser = (updatedUserData) => {
    if (user) {
      const newUser = { ...user, ...updatedUserData };
      setUser(newUser);
      
      // Update session in localStorage
      try {
        const currentSession = getCurrentUser();
        if (currentSession) {
          const updatedSession = { ...currentSession, ...updatedUserData };
          localStorage.setItem('dclinpsy-sjt-current-user', JSON.stringify(updatedSession));
        }
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }
  };

  // Check if user has completed research questionnaire
  const hasCompletedResearch = () => {
    return user && user.profileData && user.profileData.completedAt;
  };

  // Get user's personalized test history key
  const getUserTestHistoryKey = () => {
    return user ? `dclinpsy-sjt-test-history-${user.userId}` : 'dclinpsy-sjt-test-history';
  };

  const value = {
    // State
    user,
    loading,
    isLoggedIn,
    isAuthenticated: isAuthenticated(),
    
    // Actions
    login,
    logout,
    updateUser,
    
    // Utilities
    hasCompletedResearch,
    getUserTestHistoryKey
  };

  if (loading) {
    // Show loading screen while checking authentication
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading DClinPsy SJT Practice</h2>
          <p className="text-gray-600">Checking your session...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};