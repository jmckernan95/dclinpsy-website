/**
 * Research Participation Prompt Page
 * Persuasive post-registration prompt to encourage research participation
 */

import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ResearchPrompt = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleParticipate = () => {
    navigate('/research-questionnaire');
  };

  const handleSkip = () => {
    navigate('/practice', { 
      state: { message: location.state?.message || 'Welcome to DClinPsy SJT Practice!' }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Welcome Message */}
        {location.state?.message && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <p className="text-green-800 font-medium">✅ {location.state.message}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 text-center">
            <div className="text-5xl mb-4">🎓</div>
            <h1 className="text-3xl font-bold mb-2">Help Shape the Future of DClinPsy Preparation!</h1>
            <p className="text-blue-100 text-lg">
              Your experience could help thousands of future clinical psychologists
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Quick Stats */}
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">📊 Just 5 minutes of your time could make a huge difference</h2>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">15</div>
                  <div className="text-sm text-blue-700">Quick Questions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">100%</div>
                  <div className="text-sm text-green-700">Anonymous</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">0</div>
                  <div className="text-sm text-purple-700">Personal Details Shared</div>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">🌟 How Your Participation Helps:</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Improve Question Quality</h3>
                    <p className="text-gray-600">Help us identify which scenarios are most challenging and develop better practice questions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Support Diversity & Inclusion</h3>
                    <p className="text-gray-600">Your background helps us ensure our resources work for everyone applying to DClinPsy</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Inform Future Research</h3>
                    <p className="text-gray-600">Help researchers understand what preparation methods work best for DClinPsy success</p>
                  </div>
                </div>
              </div>
            </div>

            {/* What We Ask */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">📋 What We'll Ask About (All Optional):</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">📚 Education (5 questions)</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Your undergraduate degree & university</li>
                    <li>• Degree classification</li>
                    <li>• Masters degree (if completed)</li>
                    <li>• Graduation year</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">🌍 Background (5 questions)</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Demographics (with "prefer not to say" options)</li>
                    <li>• First language</li>
                    <li>• Previous application experience</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">🎯 Applications (5 questions)</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Universities you're considering</li>
                    <li>• Application timeline</li>
                    <li>• Previous applications (if any)</li>
                  </ul>
                </div>
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">⏱️</div>
                    <div className="font-medium text-gray-700">About 5 minutes</div>
                    <div className="text-sm text-gray-500">Skip any question</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Assurance */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-green-800 mb-3">🔒 Your Privacy is Protected</h2>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-green-700">
                <div>
                  <p className="mb-2">✅ <strong>Completely anonymous</strong> - no names or contact details</p>
                  <p className="mb-2">✅ <strong>Stored locally</strong> - data stays on your device</p>
                </div>
                <div>
                  <p className="mb-2">✅ <strong>Your choice</strong> - skip any question you prefer</p>
                  <p className="mb-2">✅ <strong>Delete anytime</strong> - remove your data whenever you want</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="text-center">
              <div className="mb-6">
                <button
                  onClick={handleParticipate}
                  className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition transform hover:scale-105 shadow-lg mb-4 md:mb-0 md:mr-4"
                >
                  🌟 Yes, I'll Help! (5 minutes)
                </button>
                <button
                  onClick={handleSkip}
                  className="w-full md:w-auto px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
                >
                  Maybe Later - Start Practicing
                </button>
              </div>
              
              <p className="text-sm text-gray-500">
                You can always complete the research questionnaire later from your{' '}
                <Link to="/profile" className="text-blue-600 hover:underline">profile page</Link>
              </p>
            </div>
          </div>
        </div>

        {/* Thank you note */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Thank you for considering helping to improve DClinPsy preparation for future applicants! 💙
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResearchPrompt;