/**
 * DClinPsy SJT Practice App v4 - Main Application Component
 * Features user authentication, progress tracking, and GDPR compliance
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Page Components
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Practice from './pages/Practice';
import Profile from './pages/Profile';
import Privacy from './pages/Privacy';
import ResearchQuestionnaire from './pages/ResearchQuestionnaire';
import ResearchPrompt from './pages/ResearchPrompt';

// Component Imports
import ProgressDashboard from './components/ProgressDashboard';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/privacy" element={<Privacy />} />
            
            {/* Practice Route - supports both authenticated and anonymous */}
            <Route path="/practice" element={<Practice />} />
            
            {/* Protected Routes */}
            <Route 
              path="/profile" 
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/research-prompt" 
              element={
                <PrivateRoute>
                  <ResearchPrompt />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/research-questionnaire" 
              element={
                <PrivateRoute>
                  <ResearchQuestionnaire />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <ProgressDashboard onClose={() => window.history.back()} />
                </PrivateRoute>
              } 
            />
            
            {/* Catch-all Route */}
            <Route 
              path="*" 
              element={
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-6xl font-bold text-gray-400 mb-4">404</h1>
                    <h2 className="text-2xl font-semibold text-gray-600 mb-4">Page Not Found</h2>
                    <p className="text-gray-500 mb-6">
                      The page you're looking for doesn't exist.
                    </p>
                    <a 
                      href="/" 
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Return to Home
                    </a>
                  </div>
                </div>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;