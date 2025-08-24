/**
 * Refresh Button Component
 * Manual refresh control with loading state and last update info
 */

import React from 'react';

const RefreshButton = ({ onRefresh, isRefreshing, lastUpdated, disabled = false }) => {
  const handleRefresh = (e) => {
    e.preventDefault();
    if (!isRefreshing && !disabled && onRefresh) {
      onRefresh();
    }
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Last updated info */}
      <div className="text-sm text-gray-500">
        <span className="hidden sm:inline">Updated: </span>
        <span className="font-medium">{lastUpdated}</span>
      </div>
      
      {/* Refresh button */}
      <button
        onClick={handleRefresh}
        disabled={isRefreshing || disabled}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
          isRefreshing || disabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
        }`}
        title={isRefreshing ? 'Refreshing...' : 'Refresh news feed'}
      >
        <span 
          className={`text-lg ${isRefreshing ? 'animate-spin' : ''}`}
          style={{ 
            animationDuration: isRefreshing ? '1s' : undefined,
            transformOrigin: 'center'
          }}
        >
          🔄
        </span>
        <span className="hidden sm:inline">
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </span>
      </button>
    </div>
  );
};

export default RefreshButton;