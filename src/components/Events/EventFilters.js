/**
 * Event Filters Component
 * Filter events by category, format, price, and date range
 */

import React, { useState } from 'react';

const EventFilters = ({
  categories,
  selectedCategory,
  selectedFormat,
  selectedPrice,
  dateRange,
  onCategoryChange,
  onFormatChange,
  onPriceChange,
  onDateRangeChange,
  onClearFilters,
  activeFiltersCount
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatOptions = [
    { id: '', label: 'All Events', icon: '📅' },
    { id: 'in-person', label: 'In-Person Only', icon: '🏢' },
    { id: 'virtual', label: 'Virtual Only', icon: '💻' },
  ];

  const priceOptions = [
    { id: '', label: 'All Prices', icon: '💷' },
    { id: 'free', label: 'Free Events', icon: '🆓' },
    { id: 'paid', label: 'Paid Events', icon: '💰' },
  ];

  const dateOptions = [
    { id: 'upcoming', label: 'All Upcoming', icon: '📆' },
    { id: 'this-week', label: 'This Week', icon: '📅' },
    { id: 'this-month', label: 'This Month', icon: '🗓️' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg mb-8">
      {/* Filter Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              🎛️ Filter Events
            </h3>
            <p className="text-sm text-gray-600">
              Refine your search to find the perfect events
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {activeFiltersCount > 0 && (
              <button
                onClick={onClearFilters}
                className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center space-x-1"
              >
                <span>🧹</span>
                <span>Clear {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''}</span>
              </button>
            )}
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="lg:hidden px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium flex items-center space-x-2"
            >
              <span>{isExpanded ? '▲' : '▼'}</span>
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Content */}
      <div className={`p-6 space-y-6 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            📂 Event Category
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            <button
              onClick={() => onCategoryChange('')}
              className={`p-3 text-sm font-medium rounded-lg border-2 transition ${
                selectedCategory === ''
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="text-lg mb-1">📅</div>
              <div>All Categories</div>
            </button>
            
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`p-3 text-sm font-medium rounded-lg border-2 transition ${
                  selectedCategory === category.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="text-lg mb-1">{category.icon}</div>
                <div className="leading-tight">{category.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Format, Price, and Date Range Filters */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Format Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              🏢 Event Format
            </label>
            <div className="space-y-2">
              {formatOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => onFormatChange(option.id)}
                  className={`w-full flex items-center space-x-3 p-3 text-sm font-medium rounded-lg border transition ${
                    selectedFormat === option.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <span className="text-lg">{option.icon}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              💷 Price Range
            </label>
            <div className="space-y-2">
              {priceOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => onPriceChange(option.id)}
                  className={`w-full flex items-center space-x-3 p-3 text-sm font-medium rounded-lg border transition ${
                    selectedPrice === option.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <span className="text-lg">{option.icon}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              📅 Time Period
            </label>
            <div className="space-y-2">
              {dateOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => onDateRangeChange(option.id)}
                  className={`w-full flex items-center space-x-3 p-3 text-sm font-medium rounded-lg border transition ${
                    dateRange === option.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <span className="text-lg">{option.icon}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Filters Summary */}
        {activeFiltersCount > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-blue-800">Active Filters:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedCategory && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {categories.find(c => c.id === selectedCategory)?.name}
                      <button 
                        onClick={() => onCategoryChange('')}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {selectedFormat && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {formatOptions.find(f => f.id === selectedFormat)?.label}
                      <button 
                        onClick={() => onFormatChange('')}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {selectedPrice && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {priceOptions.find(p => p.id === selectedPrice)?.label}
                      <button 
                        onClick={() => onPriceChange('')}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {dateRange !== 'upcoming' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {dateOptions.find(d => d.id === dateRange)?.label}
                      <button 
                        onClick={() => onDateRangeChange('upcoming')}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
              </div>
              
              <button
                onClick={onClearFilters}
                className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventFilters;