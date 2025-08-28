/**
 * DClinPsy Prep Hub - Professional Website Application
 * Transformed from app-like interface to professional website UX
 * Features comprehensive navigation, improved layouts, and enhanced user experience
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';

// Page Components
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Practice from './pages/Practice';
import Profile from './pages/Profile';
import Privacy from './pages/Privacy';
import Volunteer from './pages/Volunteer';
import ResearchQuestionnaire from './pages/ResearchQuestionnaire';
import ResearchPrompt from './pages/ResearchPrompt';

// Statistics Pages
import StatisticsTheory from './pages/Statistics/StatisticsTheory';
import StatisticsTest from './pages/Statistics/StatisticsTest';

// Blog Pages
import BlogList from './pages/Blog/BlogList';
import ArticleView from './pages/Blog/ArticleView';

// News Pages
import NewsFeed from './pages/News/NewsFeed';

// Events Page
import Events from './pages/Events';

// New Pages
import SJTTest from './pages/SJTTest';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Feedback from './pages/Feedback';

// Component Imports
import ProgressDashboard from './components/ProgressDashboard';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <AuthProvider>
      <Router basename={process.env.NODE_ENV === 'production' ? '/dclinpsy-website' : ''}>
        <Routes>
          {/* Homepage - No breadcrumbs */}
          <Route 
            path="/" 
            element={
              <Layout showBreadcrumbs={false}>
                <Home />
              </Layout>
            } 
          />
          
          {/* Authentication Pages - No breadcrumbs for clean UX */}
          <Route 
            path="/login" 
            element={
              <Layout showBreadcrumbs={false}>
                <Login />
              </Layout>
            } 
          />
          <Route 
            path="/register" 
            element={
              <Layout showBreadcrumbs={false}>
                <Register />
              </Layout>
            } 
          />
          
          {/* Practice Routes */}
          <Route 
            path="/sjt" 
            element={
              <Layout showBreadcrumbs={true}>
                <SJTTest />
              </Layout>
            } 
          />
          <Route 
            path="/practice" 
            element={
              <Layout showBreadcrumbs={true}>
                <Practice />
              </Layout>
            } 
          />
          
          {/* Statistics Routes */}
          <Route 
            path="/statistics/theory" 
            element={
              <Layout showBreadcrumbs={true}>
                <StatisticsTheory />
              </Layout>
            } 
          />
          <Route 
            path="/statistics/theory/:topicSlug" 
            element={
              <Layout showBreadcrumbs={true}>
                <StatisticsTheory />
              </Layout>
            } 
          />
          <Route 
            path="/statistics/test" 
            element={
              <Layout showBreadcrumbs={true}>
                <StatisticsTest />
              </Layout>
            } 
          />
          
          {/* Blog Routes */}
          <Route 
            path="/blog" 
            element={
              <Layout showBreadcrumbs={true}>
                <BlogList />
              </Layout>
            } 
          />
          <Route 
            path="/blog/:slug" 
            element={
              <Layout 
                showBreadcrumbs={true}
                customBreadcrumbs={[
                  { label: 'Home', href: '/' },
                  { label: 'Expert Resources', href: '/blog' },
                  { label: 'Article', href: null }
                ]}
              >
                <ArticleView />
              </Layout>
            } 
          />
          
          {/* News Routes */}
          <Route 
            path="/news" 
            element={
              <Layout showBreadcrumbs={true}>
                <NewsFeed />
              </Layout>
            } 
          />
          
          {/* Events Routes */}
          <Route 
            path="/events" 
            element={
              <Layout showBreadcrumbs={true}>
                <Events />
              </Layout>
            } 
          />
          
          {/* Information Pages */}
          <Route 
            path="/faq" 
            element={
              <Layout showBreadcrumbs={true}>
                <FAQ />
              </Layout>
            } 
          />
          <Route 
            path="/contact" 
            element={
              <Layout showBreadcrumbs={true}>
                <Contact />
              </Layout>
            } 
          />
          <Route 
            path="/feedback" 
            element={
              <Layout showBreadcrumbs={true}>
                <Feedback />
              </Layout>
            } 
          />
          <Route 
            path="/privacy" 
            element={
              <Layout showBreadcrumbs={true}>
                <Privacy />
              </Layout>
            } 
          />
          <Route 
            path="/volunteer" 
            element={
              <Layout showBreadcrumbs={true}>
                <Volunteer />
              </Layout>
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/profile" 
            element={
              <Layout showBreadcrumbs={true}>
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              </Layout>
            } 
          />
          <Route 
            path="/research-prompt" 
            element={
              <Layout showBreadcrumbs={true}>
                <PrivateRoute>
                  <ResearchPrompt />
                </PrivateRoute>
              </Layout>
            } 
          />
          <Route 
            path="/research-questionnaire" 
            element={
              <Layout showBreadcrumbs={true}>
                <PrivateRoute>
                  <ResearchQuestionnaire />
                </PrivateRoute>
              </Layout>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <Layout showBreadcrumbs={true}>
                <PrivateRoute>
                  <ProgressDashboard onClose={() => window.history.back()} />
                </PrivateRoute>
              </Layout>
            } 
          />
          
          {/* 404 Page - No layout wrapper for custom styling */}
          <Route 
            path="*" 
            element={
              <Layout showBreadcrumbs={false}>
                <div className="container mx-auto py-20 text-center">
                  <div className="max-w-md mx-auto">
                    <h1 className="h1 text-neutral-400 mb-4">404</h1>
                    <h2 className="h2 text-neutral-600 mb-4">Page Not Found</h2>
                    <p className="body-lg text-neutral-500 mb-8">
                      The page you're looking for doesn't exist.
                    </p>
                    <a 
                      href="/" 
                      className="btn btn-primary"
                    >
                      Return to Home
                    </a>
                  </div>
                </div>
              </Layout>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;