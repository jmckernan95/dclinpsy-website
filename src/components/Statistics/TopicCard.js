/**
 * Topic Card Component
 * Displays individual statistics topics in a card format
 */

import React from 'react';
import { Link } from 'react-router-dom';

const TopicCard = ({ topic, isCompleted, isBookmarked, onBookmark }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'basic':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Fundamentals':
        return 'bg-blue-100 text-blue-800';
      case 'Advanced':
        return 'bg-purple-100 text-purple-800';
      case 'Relationships':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
      <div className="p-6">
        {/* Header with status indicators */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(topic.category)}`}>
                {topic.category}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(topic.difficulty)}`}>
                {topic.difficulty}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {topic.title}
            </h3>
          </div>
          
          {/* Status indicators */}
          <div className="flex items-center space-x-2">
            {isCompleted && (
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                onBookmark();
              }}
              className={`w-6 h-6 rounded-full flex items-center justify-center transition ${
                isBookmarked
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-gray-200 text-gray-600 hover:bg-orange-100 hover:text-orange-600'
              }`}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark this topic'}
            >
              <span className="text-xs">🔖</span>
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
          {topic.description}
        </p>

        {/* Metadata */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <span className="mr-1">⏱️</span>
              {topic.estimatedTime}
            </span>
            <span className="flex items-center">
              <span className="mr-1">📝</span>
              {topic.sections ? topic.sections.length : 0} sections
            </span>
          </div>
        </div>

        {/* Progress indicator for completed topics */}
        {isCompleted && (
          <div className="mb-4">
            <div className="w-full bg-green-100 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full w-full"></div>
            </div>
            <p className="text-green-600 text-xs mt-1 font-medium">Completed</p>
          </div>
        )}

        {/* Action button */}
        <Link
          to={`/statistics/theory/${topic.slug}`}
          className={`block w-full py-2 px-4 rounded-lg text-center font-medium transition ${
            isCompleted
              ? 'bg-green-50 text-green-700 hover:bg-green-100'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isCompleted ? 'Review Topic' : 'Start Learning'}
        </Link>
      </div>

      {/* Topic preview - sections */}
      {topic.sections && topic.sections.length > 0 && (
        <div className="border-t border-gray-100 px-6 py-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">What you'll learn:</h4>
          <ul className="space-y-1">
            {topic.sections.slice(0, 3).map((section, index) => (
              <li key={section.id} className="text-xs text-gray-500 flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                {section.title}
              </li>
            ))}
            {topic.sections.length > 3 && (
              <li className="text-xs text-gray-400 italic">
                + {topic.sections.length - 3} more sections
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TopicCard;