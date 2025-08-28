/**
 * SJT Practice Test Landing Page
 * Professional landing page for Situational Judgment Test practice
 * Features category selection, timer options, and comprehensive explanations
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SJTTest = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  // Test configuration state
  const [testSettings, setTestSettings] = useState({
    numQuestions: 10,
    category: 'all',
    timerEnabled: false,
    timePerQuestion: 3 // minutes
  });

  // Clinical categories available
  const categories = [
    { value: 'all', label: 'All Categories (Recommended)', description: 'Mixed practice across all clinical domains' },
    { value: 'Professional Boundaries', label: 'Professional Boundaries', description: 'Maintaining appropriate therapeutic relationships' },
    { value: 'Risk Management', label: 'Risk Management', description: 'Assessing and managing clinical risks' },
    { value: 'Ethical Dilemmas', label: 'Ethical Dilemmas', description: 'Navigating complex ethical decisions' },
    { value: 'Diversity & Inclusion', label: 'Diversity & Inclusion', description: 'Cultural sensitivity and inclusive practice' },
    { value: 'Clinical Decision-Making', label: 'Clinical Decision-Making', description: 'Evidence-based clinical choices' },
    { value: 'Interprofessional Working', label: 'Interprofessional Working', description: 'Collaborating with other professionals' },
    { value: 'Trainee Development', label: 'Trainee Development', description: 'Professional growth and supervision' },
    { value: 'Service Delivery', label: 'Service Delivery', description: 'System-level decisions and service efficiency' }
  ];

  const handleStartTest = () => {
    // Create URL parameters for test configuration
    const params = new URLSearchParams({
      anonymous: !isLoggedIn ? 'true' : 'false',
      category: testSettings.category,
      numQuestions: testSettings.numQuestions.toString(),
      timer: testSettings.timerEnabled.toString(),
      timePerQuestion: testSettings.timePerQuestion.toString()
    });

    navigate(`/practice?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto text-center">
          <h1 className="h1 mb-6">SJT Practice Test</h1>
          <p className="body-lg text-neutral-600 max-w-3xl mx-auto mb-8">
            Practice Situational Judgment Tests designed specifically for DClinPsy applications. 
            Develop your clinical reasoning with authentic scenarios based on BPS and HCPC professional standards.
          </p>
          
          {!isLoggedIn && (
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 max-w-2xl mx-auto mb-8">
              <p className="body-sm text-primary-700">
                <strong>Anonymous Practice:</strong> You can take tests without creating an account, 
                but results won't be saved. <Link to="/register" className="text-primary-600 underline">Create account</Link> for progress tracking.
              </p>
            </div>
          )}
        </div>
      </section>

      <div className="container mx-auto py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Test Configuration */}
          <div className="lg:col-span-2">
            <div className="card mb-8">
              <div className="card-body">
                <h2 className="h2 mb-6">Configure Your Practice Test</h2>
                
                {/* Number of Questions */}
                <div className="mb-6">
                  <label className="form-label">Number of Questions</label>
                  <select 
                    value={testSettings.numQuestions}
                    onChange={(e) => setTestSettings({...testSettings, numQuestions: parseInt(e.target.value)})}
                    className="form-input"
                  >
                    <option value={5}>5 Questions (Quick Practice)</option>
                    <option value={10}>10 Questions (Standard)</option>
                    <option value={15}>15 Questions (Extended)</option>
                    <option value={20}>20 Questions (Full Test)</option>
                  </select>
                  <p className="caption text-neutral-500 mt-2">
                    Standard practice tests contain 10 questions for balanced domain coverage.
                  </p>
                </div>

                {/* Category Selection */}
                <div className="mb-6">
                  <label className="form-label">Clinical Domain Focus</label>
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <div key={category.value} 
                           className={`border rounded-lg p-4 cursor-pointer transition ${
                             testSettings.category === category.value 
                               ? 'border-primary-500 bg-primary-50' 
                               : 'border-neutral-200 hover:border-neutral-300'
                           }`}
                           onClick={() => setTestSettings({...testSettings, category: category.value})}
                      >
                        <div className="flex items-start">
                          <input
                            type="radio"
                            name="category"
                            value={category.value}
                            checked={testSettings.category === category.value}
                            onChange={() => setTestSettings({...testSettings, category: category.value})}
                            className="mt-1 mr-3 text-primary-600"
                          />
                          <div>
                            <h4 className="h4 mb-1">{category.label}</h4>
                            <p className="body-sm text-neutral-600">{category.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timer Options */}
                <div className="mb-8">
                  <div className="flex items-start space-x-3 mb-4">
                    <input
                      type="checkbox"
                      id="timer"
                      checked={testSettings.timerEnabled}
                      onChange={(e) => setTestSettings({...testSettings, timerEnabled: e.target.checked})}
                      className="mt-1 text-primary-600"
                    />
                    <div>
                      <label htmlFor="timer" className="form-label cursor-pointer">
                        Enable Timer (Exam Conditions)
                      </label>
                      <p className="body-sm text-neutral-600">
                        Practice under time pressure to simulate real exam conditions.
                      </p>
                    </div>
                  </div>
                  
                  {testSettings.timerEnabled && (
                    <div className="ml-6 mb-4">
                      <label className="form-label">Time per Question (minutes)</label>
                      <select 
                        value={testSettings.timePerQuestion}
                        onChange={(e) => setTestSettings({...testSettings, timePerQuestion: parseInt(e.target.value)})}
                        className="form-input max-w-xs"
                      >
                        <option value={2}>2 minutes (Challenging)</option>
                        <option value={3}>3 minutes (Standard)</option>
                        <option value={4}>4 minutes (Comfortable)</option>
                        <option value={5}>5 minutes (Extended)</option>
                      </select>
                      <p className="caption text-neutral-500 mt-2">
                        Total test time: {testSettings.numQuestions * testSettings.timePerQuestion} minutes
                      </p>
                    </div>
                  )}
                </div>

                {/* Start Test Button */}
                <button
                  onClick={handleStartTest}
                  className="btn btn-primary text-lg px-8 py-4 w-full sm:w-auto"
                >
                  Start Practice Test →
                </button>

                <p className="caption text-neutral-500 mt-4">
                  Questions will be randomized and answer options shuffled for authentic assessment.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Information */}
          <div className="space-y-8">
            {/* What is SJT? */}
            <div className="card">
              <div className="card-body">
                <h3 className="h3 mb-4">What is an SJT?</h3>
                <p className="body-sm text-neutral-600 mb-4">
                  <strong>SJT</strong> stands for <strong>Situational Judgment Test</strong>. These are assessments 
                  that present realistic workplace scenarios and ask you to rank response options 
                  from most to least appropriate.
                </p>
                <p className="body-sm text-neutral-600 mb-4">
                  SJTs are commonly used in DClinPsy applications to assess clinical reasoning, 
                  professional judgment, and alignment with psychological practice standards.
                </p>
                <Link to="/about/sjt" className="text-primary-600 text-sm hover:underline">
                  Learn more about SJTs →
                </Link>
              </div>
            </div>

            {/* Scoring System */}
            <div className="card">
              <div className="card-body">
                <h3 className="h3 mb-4">How Scoring Works</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="body-sm">Exact match:</span>
                    <span className="font-bold text-success-600">4 points</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="body-sm">±1 position:</span>
                    <span className="font-bold text-secondary-600">3 points</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="body-sm">±2 positions:</span>
                    <span className="font-bold text-warning-600">2 points</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="body-sm">±3 positions:</span>
                    <span className="font-bold text-warning-600">1 point</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="body-sm">±4 positions:</span>
                    <span className="font-bold text-error-600">0 points</span>
                  </div>
                </div>
                <p className="body-sm text-neutral-600 mb-4">
                  <strong>Maximum Score:</strong> {testSettings.numQuestions * 20} points 
                  ({testSettings.numQuestions} questions × 20 points each)
                </p>
                <p className="caption text-neutral-500">
                  Proximity-based scoring rewards clinical reasoning even when rankings aren't perfect.
                </p>
              </div>
            </div>

            {/* Study Tips */}
            <div className="card">
              <div className="card-body">
                <h3 className="h3 mb-4">Study Tips</h3>
                <ul className="space-y-3 text-sm text-neutral-600">
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    Consider BPS and HCPC professional standards when ranking options
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    Think about potential consequences of each response
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    Focus on client safety and professional boundaries
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    Read feedback carefully to understand clinical reasoning
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    Practice regularly across all clinical domains
                  </li>
                </ul>
              </div>
            </div>

            {/* Quick Links */}
            <div className="card">
              <div className="card-body">
                <h3 className="h3 mb-4">Related Resources</h3>
                <div className="space-y-3">
                  <Link to="/blog" className="block text-sm text-primary-600 hover:underline">
                    📚 Expert Articles & Application Guides
                  </Link>
                  <Link to="/statistics/theory" className="block text-sm text-primary-600 hover:underline">
                    📊 Statistics Learning Module
                  </Link>
                  <Link to="/news" className="block text-sm text-primary-600 hover:underline">
                    📰 Psychology News & Updates
                  </Link>
                  {isLoggedIn && (
                    <Link to="/dashboard" className="block text-sm text-primary-600 hover:underline">
                      📈 View Your Progress Dashboard
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SJTTest;