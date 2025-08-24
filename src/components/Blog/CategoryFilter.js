/**
 * Category Filter Component
 * Sidebar filter for blog categories with article counts
 */

import React from 'react';

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange, articleCounts }) => {
  // Calculate article count for each category
  const getCategoryCount = (category) => {
    if (category === 'all') {
      return articleCounts.length;
    }
    return articleCounts.filter(article => article.category === category).length;
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Application Tips':
        return '📝';
      case 'Self-Care & Wellbeing':
        return '🧘';
      case 'Study Strategies':
        return '📚';
      case 'Interview Preparation':
        return '🎯';
      case 'Life as a Trainee':
        return '🎓';
      case 'Career Development':
        return '💼';
      default:
        return '📄';
    }
  };

  const getCategoryColor = (category, isSelected) => {
    if (isSelected) {
      switch (category) {
        case 'Application Tips':
          return 'bg-blue-100 text-blue-800 border-blue-300';
        case 'Self-Care & Wellbeing':
          return 'bg-green-100 text-green-800 border-green-300';
        case 'Study Strategies':
          return 'bg-purple-100 text-purple-800 border-purple-300';
        case 'Interview Preparation':
          return 'bg-orange-100 text-orange-800 border-orange-300';
        case 'Life as a Trainee':
          return 'bg-pink-100 text-pink-800 border-pink-300';
        case 'Career Development':
          return 'bg-indigo-100 text-indigo-800 border-indigo-300';
        default:
          return 'bg-blue-100 text-blue-800 border-blue-300';
      }
    }
    return 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Categories</h3>
      
      <div className="space-y-2">
        {/* All Articles */}
        <button
          onClick={() => onCategoryChange('all')}
          className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${getCategoryColor('all', selectedCategory === 'all')}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-lg">📄</span>
              <span className="font-medium">All Articles</span>
            </div>
            <span className="text-sm font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {getCategoryCount('all')}
            </span>
          </div>
        </button>

        {/* Individual Categories */}
        {categories.map((category) => {
          const count = getCategoryCount(category);
          const isSelected = selectedCategory === category;
          
          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${getCategoryColor(category, isSelected)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getCategoryIcon(category)}</span>
                  <span className="font-medium">{category}</span>
                </div>
                <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                  isSelected 
                    ? 'bg-white bg-opacity-50' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {count}
                </span>
              </div>
              
              {/* Category description */}
              <div className="mt-2 text-xs opacity-75">
                {category === 'Application Tips' && 'DClinPsy application guidance and requirements'}
                {category === 'Self-Care & Wellbeing' && 'Managing stress and maintaining mental health'}
                {category === 'Study Strategies' && 'Effective learning techniques and time management'}
                {category === 'Interview Preparation' && 'Interview skills and presentation tips'}
                {category === 'Life as a Trainee' && 'Real experiences from current students'}
                {category === 'Career Development' && 'Post-qualification career paths and opportunities'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Category Statistics */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick Stats</h4>
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex justify-between">
            <span>Total Articles:</span>
            <span className="font-semibold">{articleCounts.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Categories:</span>
            <span className="font-semibold">{categories.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Most Popular:</span>
            <span className="font-semibold">
              {categories.reduce((prev, current) => 
                getCategoryCount(current) > getCategoryCount(prev) ? current : prev, categories[0]
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700">
          💡 <strong>Tip:</strong> Use categories to find articles specific to your current needs - whether you're applying, preparing for interviews, or already training.
        </p>
      </div>
    </div>
  );
};

export default CategoryFilter;