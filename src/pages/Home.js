/**
 * Professional Website Landing Page
 * Complete transformation from app-style to professional website homepage
 * Features hero section, trust indicators, and comprehensive content showcase
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const handleStartPractice = () => {
    if (isLoggedIn) {
      navigate('/practice');
    } else {
      navigate('/practice?anonymous=true');
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="gradient-hero py-20 lg:py-32">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="h1 mb-6">
              Master Your DClinPsy Application
            </h1>
            <p className="body-lg text-neutral-600 mb-8 max-w-3xl mx-auto">
              Complete preparation platform for UK Clinical Psychology Doctorate applications. 
              Practice SJTs, master statistics, access expert resources, and track your progress 
              with evidence-based tools designed by clinical psychology professionals.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={handleStartPractice}
                className="btn btn-primary text-lg px-8 py-4"
              >
                {isLoggedIn ? 'Continue Practice' : 'Start Free Practice'}
              </button>
              {!isLoggedIn && (
                <Link
                  to="/register"
                  className="btn btn-secondary text-lg px-8 py-4"
                >
                  Create Account
                </Link>
              )}
            </div>
            
            {!isLoggedIn && (
              <p className="caption text-neutral-500">
                Free to use • No registration required • Full functionality available
              </p>
            )}
            
            {isLoggedIn && (
              <p className="body-sm text-primary-600 font-medium">
                Welcome back, {user.username}! Continue your DClinPsy preparation journey.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-white border-b border-neutral-200">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-primary-600 text-2xl font-bold mb-1">25+</div>
              <div className="caption text-neutral-600">SJT Scenarios</div>
            </div>
            <div>
              <div className="text-primary-600 text-2xl font-bold mb-1">8</div>
              <div className="caption text-neutral-600">Clinical Domains</div>
            </div>
            <div>
              <div className="text-primary-600 text-2xl font-bold mb-1">BPS</div>
              <div className="caption text-neutral-600">Aligned Standards</div>
            </div>
            <div>
              <div className="text-primary-600 text-2xl font-bold mb-1">GDPR</div>
              <div className="caption text-neutral-600">Compliant</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="h2 mb-6">
              Complete DClinPsy Preparation Platform
            </h2>
            <p className="body-lg text-neutral-600 max-w-3xl mx-auto">
              Everything you need to prepare for your Clinical Psychology Doctorate application, 
              from practice tests to expert guidance.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <div 
              className="card cursor-pointer"
              onClick={handleStartPractice}
            >
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="h3 mb-4">SJT Practice Tests</h3>
                <p className="body-sm text-neutral-600 mb-6">
                  Authentic clinical scenarios with intelligent question mixing across all domains. 
                  Proximity-based scoring and detailed feedback aligned with BPS/HCPC standards.
                </p>
                <div className="btn btn-primary w-full">
                  Start Practicing
                </div>
              </div>
            </div>

            <div 
              className="card cursor-pointer"
              onClick={() => navigate('/statistics/theory')}
            >
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="h3 mb-4">Statistics Learning</h3>
                <p className="body-sm text-neutral-600 mb-6">
                  Interactive theory and practice tests covering essential statistical concepts 
                  for psychological research and DClinPsy applications.
                </p>
                <div className="btn btn-secondary w-full">
                  Learn Statistics
                </div>
              </div>
            </div>

            <div 
              className="card cursor-pointer"
              onClick={() => navigate('/blog')}
            >
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="h3 mb-4">Expert Resources</h3>
                <p className="body-sm text-neutral-600 mb-6">
                  Comprehensive articles and guides covering application strategies, interview preparation, 
                  and career development from experienced professionals.
                </p>
                <div className="btn btn-outline w-full">
                  Read Articles
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div 
              className="card cursor-pointer"
              onClick={() => navigate('/news')}
            >
              <div className="card-body">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-error-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <h4 className="h4 mb-2">Psychology News</h4>
                    <p className="body-sm text-neutral-600 mb-4">
                      Stay updated with the latest psychology research, NHS developments, 
                      and professional announcements from BPS, APA, and leading organizations.
                    </p>
                    <div className="btn btn-ghost">View News Feed →</div>
                  </div>
                </div>
              </div>
            </div>

            <div 
              className="card cursor-pointer"
              onClick={() => navigate('/events')}
            >
              <div className="card-body">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h12l-1 5H9l-1-5z" />
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <h4 className="h4 mb-2">Psychology Events</h4>
                    <p className="body-sm text-neutral-600 mb-4">
                      Discover conferences, workshops, training sessions, and networking events 
                      across the UK. Perfect for building connections and experience.
                    </p>
                    <div className="btn btn-ghost">Browse Events →</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="h2 mb-6">How It Works</h2>
            <p className="body-lg text-neutral-600 max-w-3xl mx-auto">
              Our evidence-based approach helps you develop the clinical judgment and knowledge 
              needed for successful DClinPsy applications.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                1
              </div>
              <h3 className="h4 mb-4">Practice Clinical Scenarios</h3>
              <p className="body-sm text-neutral-600">
                Complete authentic SJT questions covering all clinical domains with 
                randomized answer ordering for genuine assessment.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                2
              </div>
              <h3 className="h4 mb-4">Get Detailed Feedback</h3>
              <p className="body-sm text-neutral-600">
                Receive comprehensive explanations aligned with BPS and HCPC professional 
                standards to understand clinical reasoning.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                3
              </div>
              <h3 className="h4 mb-4">Track Your Progress</h3>
              <p className="body-sm text-neutral-600">
                Monitor performance across categories, identify strengths and weaknesses, 
                and receive personalized study recommendations.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                4
              </div>
              <h3 className="h4 mb-4">Achieve Success</h3>
              <p className="body-sm text-neutral-600">
                Build confidence and clinical judgment with consistent practice, 
                expert resources, and comprehensive preparation tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Clinical Domains */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="h2 mb-6">Clinical Domains Covered</h2>
            <p className="body-lg text-neutral-600 max-w-3xl mx-auto">
              Practice scenarios spanning all essential clinical psychology domains 
              relevant to DClinPsy applications and professional practice.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              'Professional Boundaries',
              'Risk Management', 
              'Ethical Dilemmas',
              'Diversity & Inclusion',
              'Clinical Decision-Making',
              'Interprofessional Working',
              'Trainee Development',
              'Service Delivery'
            ].map((category, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <h4 className="h4 text-primary-800">{category}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Account Benefits */}
      {!isLoggedIn && (
        <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="h2 mb-6">Why Create an Account?</h2>
              <p className="body-lg text-neutral-600 max-w-3xl mx-auto">
                Unlock the full potential of your DClinPsy preparation with personalized 
                features and comprehensive progress tracking.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="h3 mb-4">Progress Analytics</h3>
                <p className="body-sm text-neutral-600">
                  Detailed performance tracking with category breakdowns, trends, 
                  and personalized study recommendations.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="h3 mb-4">Personalized Learning</h3>
                <p className="body-sm text-neutral-600">
                  AI-powered recommendations, customized study plans, 
                  and targeted practice based on your performance.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h3 className="h3 mb-4">Community Features</h3>
                <p className="body-sm text-neutral-600">
                  Optional research participation, volunteer opportunities, 
                  and connection with the DClinPsy preparation community.
                </p>
              </div>
            </div>

            <div className="text-center">
              <Link
                to="/register"
                className="btn btn-primary text-lg px-8 py-4 mr-4"
              >
                Create Free Account
              </Link>
              <Link
                to="/login"
                className="btn btn-outline text-lg px-8 py-4"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Begin Your DClinPsy Journey?
          </h2>
          <p className="body-lg mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of aspiring clinical psychologists who trust our platform 
            for comprehensive DClinPsy application preparation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleStartPractice}
              className="bg-white text-primary-600 hover:bg-neutral-50 px-8 py-4 rounded-lg font-semibold transition"
            >
              {isLoggedIn ? 'Continue Your Preparation' : 'Start Free Practice'}
            </button>
            {!isLoggedIn && (
              <Link
                to="/register"
                className="bg-primary-700 hover:bg-primary-800 text-white px-8 py-4 rounded-lg font-semibold transition"
              >
                Create Account
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;