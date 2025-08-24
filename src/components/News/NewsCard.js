/**
 * News Card Component
 * Individual news article display card
 */

import React from 'react';
import { getSourceById } from '../../data/news-sources';

const NewsCard = ({ article, isFirst = false }) => {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      if (diffHours < 1) {
        const diffMins = Math.floor(diffMs / (1000 * 60));
        return diffMins < 1 ? 'Just now' : `${diffMins}m ago`;
      } else if (diffHours < 24) {
        return `${diffHours}h ago`;
      } else if (diffDays < 7) {
        return `${diffDays}d ago`;
      } else {
        return date.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
      }
    } catch (error) {
      return 'Recently';
    }
  };

  const getSourceInfo = () => {
    const sourceInfo = getSourceById(article.sourceId);
    return sourceInfo || {
      name: article.source || 'Unknown Source',
      color: 'bg-gray-100 text-gray-800'
    };
  };

  const handleArticleClick = () => {
    // Track click if analytics needed
    if (window.gtag) {
      window.gtag('event', 'news_article_click', {
        article_title: article.title,
        source: article.source
      });
    }
    
    // Open in new tab
    window.open(article.url, '_blank', 'noopener,noreferrer');
  };

  const handleShare = (e) => {
    e.stopPropagation();
    
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.description,
        url: article.url
      });
    } else {
      navigator.clipboard.writeText(article.url);
      // Could add toast notification here
      alert('Article URL copied to clipboard!');
    }
  };

  const sourceInfo = getSourceInfo();

  return (
    <article 
      className={`bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden cursor-pointer ${
        isFirst ? 'border-l-4 border-blue-500' : ''
      } ${article.isFallback ? 'border-orange-200' : ''}`}
      onClick={handleArticleClick}
    >
      <div className="p-6">
        {/* Header with source and timestamp */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${sourceInfo.color}`}>
              {sourceInfo.name}
            </span>
            {article.category && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                {article.category}
              </span>
            )}
            {isFirst && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                Latest
              </span>
            )}
            {article.isFallback && (
              <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">
                Curated
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>{formatDate(article.publishDate)}</span>
            <button
              onClick={handleShare}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Share article"
            >
              <span className="text-sm">📤</span>
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          {/* Main Content */}
          <div className="flex-1">
            {/* Title */}
            <h2 className="text-xl font-semibold text-gray-800 mb-3 leading-tight hover:text-blue-600 transition-colors">
              {article.title}
            </h2>

            {/* Description */}
            {article.description && (
              <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                {article.description}
              </p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <span className="mr-1">🔗</span>
                  External Link
                </span>
                {!article.isFallback && (
                  <span className="flex items-center">
                    <span className="mr-1">🔄</span>
                    Live Feed
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                  Read More →
                </span>
              </div>
            </div>
          </div>

          {/* Optional Image */}
          {article.imageUrl && (
            <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
                loading="lazy"
              />
            </div>
          )}
        </div>
      </div>

      {/* Hover effect indicator */}
      <div className="h-1 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 hover:opacity-100 transition-opacity duration-200"></div>
    </article>
  );
};

export default NewsCard;