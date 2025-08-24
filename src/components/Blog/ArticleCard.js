/**
 * Article Card Component
 * Card display for blog articles in list views
 */

import React from 'react';
import { Link } from 'react-router-dom';

const ArticleCard = ({ article, isBookmarked, isRead, onBookmark, onRead, featured = false }) => {
  const handleCardClick = () => {
    if (onRead) {
      onRead();
    }
  };

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onBookmark) {
      onBookmark();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Application Tips':
        return 'bg-blue-100 text-blue-800';
      case 'Self-Care & Wellbeing':
        return 'bg-green-100 text-green-800';
      case 'Study Strategies':
        return 'bg-purple-100 text-purple-800';
      case 'Interview Preparation':
        return 'bg-orange-100 text-orange-800';
      case 'Life as a Trainee':
        return 'bg-pink-100 text-pink-800';
      case 'Career Development':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 ${
      featured ? 'border-2 border-yellow-200' : ''
    }`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(article.category)}`}>
              {article.category}
            </span>
            {featured && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                Featured
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {isRead && (
              <div className="w-2 h-2 bg-green-500 rounded-full" title="Read"></div>
            )}
            <button
              onClick={handleBookmarkClick}
              className={`p-1 rounded-full transition-colors ${
                isBookmarked
                  ? 'text-orange-600 hover:text-orange-700'
                  : 'text-gray-400 hover:text-orange-500'
              }`}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
            >
              <span className="text-sm">🔖</span>
            </button>
          </div>
        </div>

        {/* Title */}
        <Link to={`/blog/${article.slug}`} onClick={handleCardClick}>
          <h3 className="text-xl font-semibold text-gray-800 mb-3 hover:text-blue-600 transition-colors line-clamp-2">
            {article.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
          {article.excerpt}
        </p>

        {/* Metadata */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <span className="mr-1">👤</span>
              {article.author}
            </span>
            <span className="flex items-center">
              <span className="mr-1">📅</span>
              {formatDate(article.date)}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <span className="mr-1">⏱️</span>
              {article.readingTime} min
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {article.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
              +{article.tags.length - 3} more
            </span>
          )}
        </div>

        {/* Stats and Action */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <span className="mr-1">👁️</span>
              {article.views.toLocaleString()}
            </span>
            <span className="flex items-center">
              <span className="mr-1">👍</span>
              {article.likes}
            </span>
          </div>
          
          <Link
            to={`/blog/${article.slug}`}
            onClick={handleCardClick}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Read Article
          </Link>
        </div>
      </div>

      {/* Reading progress indicator for read articles */}
      {isRead && (
        <div className="h-1 bg-green-100">
          <div className="h-full bg-green-500 w-full"></div>
        </div>
      )}
    </div>
  );
};

export default ArticleCard;