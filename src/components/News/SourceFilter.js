/**
 * Source Filter Component
 * Filter news by source with cache status indicators
 */

import React from 'react';

const SourceFilter = ({ sources, selectedSources, onSourceToggle, cacheStatus }) => {
  const formatCacheAge = (age) => {
    if (age < 60000) return 'Just updated';
    const minutes = Math.floor(age / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const getCacheStatusColor = (sourceId) => {
    const status = cacheStatus[sourceId];
    if (!status) return 'bg-gray-100';
    if (status.error) return 'bg-red-100';
    if (status.expired || !status.cached) return 'bg-orange-100';
    return 'bg-green-100';
  };

  const getCacheStatusIcon = (sourceId) => {
    const status = cacheStatus[sourceId];
    if (!status) return '❓';
    if (status.error) return '❌';
    if (status.expired || !status.cached) return '⏳';
    return '✅';
  };

  const activeSources = sources.filter(source => source.active);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">News Sources</h3>
        <span className="text-xs text-gray-500">
          {selectedSources.size === 0 ? 'All' : selectedSources.size} selected
        </span>
      </div>

      <div className="space-y-3 mb-4">
        {activeSources.map((source) => {
          const isSelected = selectedSources.has(source.id);
          const status = cacheStatus[source.id];
          
          return (
            <div
              key={source.id}
              className={`border-2 rounded-lg p-3 transition-all cursor-pointer ${
                isSelected
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onSourceToggle(source.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedSources.size === 0 || isSelected}
                    onChange={() => onSourceToggle(source.id)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <h4 className="font-medium text-gray-800 text-sm">
                    {source.name}
                  </h4>
                </div>
                
                {/* Cache status indicator */}
                <div 
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${getCacheStatusColor(source.id)}`}
                  title={status ? 
                    `${status.cached ? 'Cached' : 'Not cached'} - ${status.articleCount} articles` : 
                    'Unknown status'
                  }
                >
                  {getCacheStatusIcon(source.id)}
                </div>
              </div>
              
              <p className="text-xs text-gray-600 mb-2">
                {source.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded text-xs ${source.color}`}>
                  {source.category}
                </span>
                
                {status && status.cached && (
                  <span className="text-xs text-gray-500">
                    {formatCacheAge(status.age)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
        <button
          onClick={() => {
            // Clear selection to show all sources
            activeSources.forEach(source => {
              if (selectedSources.has(source.id)) {
                onSourceToggle(source.id);
              }
            });
          }}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          disabled={selectedSources.size === 0}
        >
          Show All Sources
        </button>
        
        <button
          onClick={() => {
            // Select only high priority sources
            const highPrioritySources = activeSources.filter(s => s.priority === 1);
            // Clear current selection
            selectedSources.forEach(sourceId => onSourceToggle(sourceId));
            // Add high priority sources
            highPrioritySources.forEach(source => {
              if (!selectedSources.has(source.id)) {
                onSourceToggle(source.id);
              }
            });
          }}
          className="text-sm text-green-600 hover:text-green-800 font-medium"
        >
          Top Sources Only
        </button>
      </div>

      {/* Status Legend */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-xs font-semibold text-gray-700 mb-2">Status Legend</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-green-100 rounded-full flex items-center justify-center text-xs">✅</span>
            <span className="text-gray-600">Updated</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-orange-100 rounded-full flex items-center justify-center text-xs">⏳</span>
            <span className="text-gray-600">Loading</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-red-100 rounded-full flex items-center justify-center text-xs">❌</span>
            <span className="text-gray-600">Error</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-gray-100 rounded-full flex items-center justify-center text-xs">❓</span>
            <span className="text-gray-600">Unknown</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SourceFilter;