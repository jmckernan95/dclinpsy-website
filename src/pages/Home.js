/**
 * Home/Landing Page for DClinPsy SJT Practice App v4
 * Professional landing page with authentication options and app overview
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

  if (isLoggedIn) {
    // Authenticated user homepage
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Welcome back, {user.username}!
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Continue your DClinPsy preparation with personalized practice tests and progress tracking.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
              <div className="text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold mb-2">SJT Practice</h3>
                <p className="text-gray-600 mb-4">Clinical scenarios</p>
                <button
                  onClick={handleStartPractice}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Start Practice
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
              <div className="text-center">
                <div className="text-4xl mb-4">📈</div>
                <h3 className="text-xl font-semibold mb-2">Statistics</h3>
                <p className="text-gray-600 mb-4">Learn concepts</p>
                <button
                  onClick={() => navigate('/statistics/theory')}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Study Statistics
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
              <div className="text-center">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-semibold mb-2">Blog & Resources</h3>
                <p className="text-gray-600 mb-4">Expert advice</p>
                <button
                  onClick={() => navigate('/blog')}
                  className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                >
                  Read Articles
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
              <div className="text-center">
                <div className="text-4xl mb-4">📰</div>
                <h3 className="text-xl font-semibold mb-2">Psychology News</h3>
                <p className="text-gray-600 mb-4">Latest updates</p>
                <button
                  onClick={() => navigate('/news')}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  View News
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
              <div className="text-center">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-2">Progress</h3>
                <p className="text-gray-600 mb-4">View analytics</p>
                <Link
                  to="/dashboard"
                  className="block w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-center"
                >
                  View Progress
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
              <div className="text-center">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-semibold mb-2">Volunteer</h3>
                <p className="text-gray-600 mb-4">Join our team</p>
                <button
                  onClick={() => navigate('/volunteer')}
                  className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
                >
                  Get Involved
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
              <div className="text-center">
                <div className="text-4xl mb-4">⚙️</div>
                <h3 className="text-xl font-semibold mb-2">Profile</h3>
                <p className="text-gray-600 mb-4">Account settings</p>
                <Link
                  to="/profile"
                  className="block w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-center"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity or Tips */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">📚 Study Tips</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-gray-800">Focus on Professional Guidelines</h4>
                <p className="text-gray-600 text-sm">Remember that SJT questions are based on BPS and HCPC professional standards. Consider ethical implications in each scenario.</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-gray-800">Practice Regularly</h4>
                <p className="text-gray-600 text-sm">Consistent practice with immediate feedback helps develop clinical judgment. Aim for multiple short sessions rather than cramming.</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-gray-800">Review Your Weak Areas</h4>
                <p className="text-gray-600 text-sm">Use the progress dashboard to identify categories where you need improvement and focus your study efforts.</p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-gray-800">Think Beyond Right/Wrong</h4>
                <p className="text-gray-600 text-sm">Consider the reasoning behind rankings. Understanding why options are more or less appropriate is key to clinical reasoning.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Anonymous/guest homepage
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            DClinPsy Prep Hub
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-8">
            Complete preparation platform for UK Clinical Psychology Doctorate applications featuring 
            SJT practice, statistics learning, expert resources, and live psychology news.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={handleStartPractice}
              className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition transform hover:scale-105"
            >
              Start Practice (Anonymous)
            </button>
            <Link
              to="/register"
              className="px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition transform hover:scale-105 text-center"
            >
              Create Account
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-gray-600 text-white text-lg font-semibold rounded-lg hover:bg-gray-700 transition transform hover:scale-105 text-center"
            >
              Login
            </Link>
          </div>
          
          <p className="text-sm text-gray-500">
            Free to use • No registration required for anonymous practice
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div 
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition cursor-pointer"
            onClick={handleStartPractice}
          >
            <div className="text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">SJT Practice</h3>
              <p className="text-gray-600 mb-4">
                Clinical decision-making scenarios with intelligent question mixing 
                across multiple domains for comprehensive preparation.
              </p>
              <div className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Try Now
              </div>
            </div>
          </div>

          <div 
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition cursor-pointer"
            onClick={() => navigate('/statistics/theory')}
          >
            <div className="text-center">
              <div className="text-5xl mb-4">📈</div>
              <h3 className="text-xl font-semibold mb-2">Statistics Learning</h3>
              <p className="text-gray-600 mb-4">
                Interactive statistics theory and practice tests covering essential 
                concepts for psychological research and analysis.
              </p>
              <div className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                Learn Statistics
              </div>
            </div>
          </div>

          <div 
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition cursor-pointer"
            onClick={() => navigate('/blog')}
          >
            <div className="text-center">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-2">Expert Resources</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive articles and guides covering DClinPsy applications, 
                training tips, and career development advice from experienced professionals.
              </p>
              <div className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">
                Read Articles
              </div>
            </div>
          </div>

          <div 
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition cursor-pointer"
            onClick={() => navigate('/news')}
          >
            <div className="text-center">
              <div className="text-5xl mb-4">📰</div>
              <h3 className="text-xl font-semibold mb-2">Live News Feed</h3>
              <p className="text-gray-600 mb-4">
                Auto-updating psychology and mental health news from trusted sources 
                including BPS, APA, NHS, and leading research organizations.
              </p>
              <div className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                View News
              </div>
            </div>
          </div>

          <div 
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition cursor-pointer"
            onClick={() => navigate('/dashboard')}
          >
            <div className="text-center">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Progress Analytics</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive performance tracking with category breakdowns, trends, and 
                personalized study recommendations across all modules.
              </p>
              <div className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                View Progress
              </div>
            </div>
          </div>

          <div 
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition cursor-pointer"
            onClick={() => navigate('/volunteer')}
          >
            <div className="text-center">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-2">Volunteer Opportunities</h3>
              <p className="text-gray-600 mb-4">
                Join our team and gain valuable experience whilst supporting fellow 
                DClinPsy applicants. Perfect for CV building and networking.
              </p>
              <div className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition">
                Get Involved
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Privacy Focused</h3>
              <p className="text-gray-600">
                Optional account creation with GDPR compliance. All data stays local 
                to your device for maximum privacy and security.
              </p>
            </div>
          </div>
        </div>

        {/* Clinical Categories */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Clinical Domains Covered</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <div key={index} className="bg-blue-50 rounded-lg p-4 text-center">
                <h4 className="font-semibold text-gray-800">{category}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* Account Benefits */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Why Create an Account?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="text-green-600 text-xl">📈</div>
                <div>
                  <h4 className="font-semibold">Progress Tracking</h4>
                  <p className="text-gray-600 text-sm">Detailed analytics showing improvement over time</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-green-600 text-xl">🎯</div>
                <div>
                  <h4 className="font-semibold">Personalized Recommendations</h4>
                  <p className="text-gray-600 text-sm">AI-generated study suggestions based on your performance</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-green-600 text-xl">📊</div>
                <div>
                  <h4 className="font-semibold">Category Performance</h4>
                  <p className="text-gray-600 text-sm">Identify strengths and areas for development</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="text-blue-600 text-xl">🔬</div>
                <div>
                  <h4 className="font-semibold">Optional Research Participation</h4>
                  <p className="text-gray-600 text-sm">Help improve DClinPsy preparation resources (completely optional)</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-blue-600 text-xl">🔒</div>
                <div>
                  <h4 className="font-semibold">Data Privacy</h4>
                  <p className="text-gray-600 text-sm">Full control over your data with export and deletion options</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-blue-600 text-xl">⚡</div>
                <div>
                  <h4 className="font-semibold">Always Free</h4>
                  <p className="text-gray-600 text-sm">No subscription fees, premium features, or hidden costs</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Ready to Begin?</h2>
          <p className="text-gray-600 mb-6">
            Start practicing immediately or create an account for the full experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleStartPractice}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Try It Now (Anonymous)
            </button>
            <Link
              to="/register"
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition text-center"
            >
              Create Free Account
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p className="mb-2">
            <strong>Disclaimer:</strong> This practice tool supplements, but does not replace, formal DClinPsy preparation programs. 
            Always refer to official BPS and HCPC guidelines for authoritative information.
          </p>
          <p>
            <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link> • 
            <span className="mx-2">Contact: help@example.com</span> • 
            <span>Version 4.0</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;