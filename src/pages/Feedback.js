/**
 * Feedback Page
 * Anonymous feedback form for user suggestions and improvements
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Feedback = () => {
  const [feedbackData, setFeedbackData] = useState({
    type: 'general',
    category: 'sjt',
    rating: 5,
    title: '',
    description: '',
    improvements: '',
    wouldRecommend: 'yes',
    anonymous: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFeedbackData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission (replace with actual implementation)
    setTimeout(() => {
      setSubmitStatus('success');
      setIsSubmitting(false);
      setFeedbackData({
        type: 'general',
        category: 'sjt',
        rating: 5,
        title: '',
        description: '',
        improvements: '',
        wouldRecommend: 'yes',
        anonymous: true
      });
    }, 1500);
  };

  const feedbackTypes = [
    { value: 'general', label: 'General Feedback', description: 'Overall thoughts about the platform' },
    { value: 'bug', label: 'Bug Report', description: 'Something isn\'t working correctly' },
    { value: 'feature', label: 'Feature Request', description: 'Suggest a new feature or improvement' },
    { value: 'content', label: 'Content Feedback', description: 'Questions, articles, or explanations' },
    { value: 'usability', label: 'Usability Issue', description: 'Interface or user experience problems' },
    { value: 'testimonial', label: 'Success Story', description: 'Share your positive experience' }
  ];

  const categories = [
    { value: 'sjt', label: 'SJT Practice Tests' },
    { value: 'statistics', label: 'Statistics Learning' },
    { value: 'blog', label: 'Expert Articles' },
    { value: 'news', label: 'Psychology News' },
    { value: 'events', label: 'Events Section' },
    { value: 'account', label: 'Account Management' },
    { value: 'navigation', label: 'Site Navigation' },
    { value: 'mobile', label: 'Mobile Experience' },
    { value: 'performance', label: 'Site Performance' },
    { value: 'other', label: 'Other' }
  ];

  const renderRatingStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => setFeedbackData(prev => ({...prev, rating: star}))}
        className={`text-2xl transition ${
          star <= feedbackData.rating 
            ? 'text-warning-500 hover:text-warning-600' 
            : 'text-neutral-300 hover:text-warning-400'
        }`}
      >
        ★
      </button>
    ));
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto text-center">
          <h1 className="h1 mb-6">Share Your Feedback</h1>
          <p className="body-lg text-neutral-600 max-w-3xl mx-auto">
            Your feedback helps us improve DClinPsy Prep Hub for everyone. Share your thoughts, 
            report issues, suggest features, or tell us about your success story.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Feedback Form */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="card-body">
                <h2 className="h2 mb-6">Tell us what you think</h2>
                
                {submitStatus === 'success' && (
                  <div className="bg-success-50 border border-success-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-success-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-success-700 font-medium">
                        Thank you for your feedback! Your input helps us improve the platform.
                      </p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Feedback Type */}
                  <div>
                    <label className="form-label">What type of feedback is this? *</label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {feedbackTypes.map((type) => (
                        <div key={type.value} 
                             className={`border rounded-lg p-3 cursor-pointer transition ${
                               feedbackData.type === type.value 
                                 ? 'border-primary-500 bg-primary-50' 
                                 : 'border-neutral-200 hover:border-neutral-300'
                             }`}
                             onClick={() => setFeedbackData(prev => ({...prev, type: type.value}))}
                        >
                          <div className="flex items-start">
                            <input
                              type="radio"
                              name="type"
                              value={type.value}
                              checked={feedbackData.type === type.value}
                              onChange={() => setFeedbackData(prev => ({...prev, type: type.value}))}
                              className="mt-0.5 mr-3 text-primary-600"
                            />
                            <div>
                              <h4 className="font-medium text-sm">{type.label}</h4>
                              <p className="text-xs text-neutral-600">{type.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Category and Rating */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="category" className="form-label">Which area does this relate to? *</label>
                      <select
                        id="category"
                        name="category"
                        value={feedbackData.category}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                      >
                        {categories.map(category => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="form-label">Overall Rating *</label>
                      <div className="flex items-center space-x-1 mt-2">
                        {renderRatingStars()}
                        <span className="ml-3 text-sm text-neutral-600">
                          ({feedbackData.rating}/5 stars)
                        </span>
                      </div>
                      <p className="caption text-neutral-500 mt-1">
                        Rate your overall experience with this area
                      </p>
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="form-label">
                      {feedbackData.type === 'bug' ? 'Bug Summary *' : 
                       feedbackData.type === 'feature' ? 'Feature Title *' :
                       feedbackData.type === 'testimonial' ? 'Success Story Title *' :
                       'Feedback Title *'}
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={feedbackData.title}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                      placeholder={
                        feedbackData.type === 'bug' ? 'Brief description of the issue' :
                        feedbackData.type === 'feature' ? 'Name of the feature you\'d like to see' :
                        feedbackData.type === 'testimonial' ? 'How DClinPsy Prep Hub helped you' :
                        'Brief summary of your feedback'
                      }
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="form-label">
                      {feedbackData.type === 'bug' ? 'Detailed Bug Report *' :
                       feedbackData.type === 'feature' ? 'Feature Description *' :
                       feedbackData.type === 'testimonial' ? 'Your Story *' :
                       'Detailed Feedback *'}
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={feedbackData.description}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="form-input resize-none"
                      placeholder={
                        feedbackData.type === 'bug' ? 'Please describe what happened, what you expected to happen, and steps to reproduce the issue. Include your browser type if relevant.' :
                        feedbackData.type === 'feature' ? 'Describe the feature you\'d like to see, how it would work, and why it would be useful.' :
                        feedbackData.type === 'testimonial' ? 'Share your experience with DClinPsy Prep Hub. How has it helped with your preparation? What features do you find most valuable?' :
                        'Please provide detailed feedback about your experience. Be specific about what works well and what could be improved.'
                      }
                    />
                    <p className="caption text-neutral-500 mt-2">
                      Minimum 30 characters. The more detail you provide, the better we can help.
                    </p>
                  </div>

                  {/* Improvements */}
                  <div>
                    <label htmlFor="improvements" className="form-label">
                      Suggestions for Improvement
                    </label>
                    <textarea
                      id="improvements"
                      name="improvements"
                      value={feedbackData.improvements}
                      onChange={handleInputChange}
                      rows={4}
                      className="form-input resize-none"
                      placeholder="What specific changes or improvements would make this better? Any additional features you'd like to see?"
                    />
                  </div>

                  {/* Recommendation */}
                  <div>
                    <label className="form-label">Would you recommend DClinPsy Prep Hub to others?</label>
                    <div className="flex space-x-6 mt-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="wouldRecommend"
                          value="yes"
                          checked={feedbackData.wouldRecommend === 'yes'}
                          onChange={handleInputChange}
                          className="mr-2 text-primary-600"
                        />
                        <span className="text-sm">Yes, definitely</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="wouldRecommend"
                          value="maybe"
                          checked={feedbackData.wouldRecommend === 'maybe'}
                          onChange={handleInputChange}
                          className="mr-2 text-primary-600"
                        />
                        <span className="text-sm">Maybe, with improvements</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="wouldRecommend"
                          value="no"
                          checked={feedbackData.wouldRecommend === 'no'}
                          onChange={handleInputChange}
                          className="mr-2 text-primary-600"
                        />
                        <span className="text-sm">Not currently</span>
                      </label>
                    </div>
                  </div>

                  {/* Anonymous Option */}
                  <div>
                    <label className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        name="anonymous"
                        checked={feedbackData.anonymous}
                        onChange={handleInputChange}
                        className="mt-1 text-primary-600"
                      />
                      <div>
                        <span className="form-label">Submit anonymously</span>
                        <p className="body-sm text-neutral-600">
                          Your feedback will be completely anonymous. We won't be able to follow up 
                          with you directly, but your input will still help improve the platform.
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || feedbackData.description.length < 30}
                    className={`btn btn-primary w-full sm:w-auto px-8 py-3 ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending Feedback...
                      </>
                    ) : (
                      'Submit Feedback'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar Information */}
          <div className="space-y-8">
            {/* Why Feedback Matters */}
            <div className="card">
              <div className="card-body">
                <h3 className="h3 mb-4">Why Your Feedback Matters</h3>
                <ul className="space-y-3 text-sm text-neutral-600">
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    Help us identify and fix bugs quickly
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    Guide the development of new features
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    Improve the user experience for everyone
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    Ensure content meets your learning needs
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    Make DClinPsy preparation more effective
                  </li>
                </ul>
              </div>
            </div>

            {/* Recent Improvements */}
            <div className="card">
              <div className="card-body">
                <h3 className="h3 mb-4">Recent User-Requested Improvements</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <span className="text-success-600">✓</span>
                    <span className="text-neutral-600">Added category-specific practice tests</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-success-600">✓</span>
                    <span className="text-neutral-600">Improved mobile responsive design</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-success-600">✓</span>
                    <span className="text-neutral-600">Enhanced progress tracking features</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-success-600">✓</span>
                    <span className="text-neutral-600">Added timer functionality for practice tests</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Alternative Feedback Methods */}
            <div className="card">
              <div className="card-body">
                <h3 className="h3 mb-4">Other Ways to Give Feedback</h3>
                <div className="space-y-3">
                  <Link to="/contact" className="block text-sm text-primary-600 hover:underline">
                    📞 Contact Support (Non-anonymous)
                  </Link>
                  <a 
                    href="https://github.com/jmckernan95/dclinpsy-app/issues" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-sm text-primary-600 hover:underline"
                  >
                    🐛 Report Issues on GitHub
                  </a>
                  <a 
                    href="https://github.com/jmckernan95/dclinpsy-app/discussions" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-sm text-primary-600 hover:underline"
                  >
                    💬 Join Community Discussions
                  </a>
                  <Link to="/volunteer" className="block text-sm text-primary-600 hover:underline">
                    🤝 Volunteer to Help Improve the Platform
                  </Link>
                </div>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="card">
              <div className="card-body">
                <h3 className="h3 mb-4">Privacy & Data</h3>
                <p className="body-sm text-neutral-600 mb-4">
                  Anonymous feedback cannot be traced back to you. Non-anonymous feedback 
                  may be used to follow up for clarification but will never be shared publicly.
                </p>
                <Link to="/privacy" className="text-sm text-primary-600 hover:underline">
                  Read our full Privacy Policy →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;