import React from 'react';
import { getTestHistory, getHistoryStats, getCategoryTrend, clearTestHistory } from '../utils/testHistory';
import { getPerformanceLevel } from '../utils/categoryStats';

const ProgressDashboard = ({ onClose }) => {
  const history = getTestHistory();
  const stats = getHistoryStats();

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all test history? This action cannot be undone.')) {
      clearTestHistory();
      // Refresh the component by calling onClose and reopening
      onClose();
    }
  };

  const getTrendEmoji = (trend) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'improving': return 'text-green-600';
      case 'declining': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (history.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-700">Progress Dashboard</h1>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Back to Test
          </button>
        </div>
        
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-xl font-semibold mb-2 text-gray-700">No Test History Yet</h2>
          <p className="text-gray-600 mb-6">
            Complete your first test to start tracking your progress and receive personalized insights.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Take Your First Test
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700">Progress Dashboard</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleClearHistory}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
          >
            Clear History
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Back to Test
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-700">{stats.totalTests}</div>
          <div className="text-sm text-blue-600">Tests Completed</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-700">{stats.averageScore}%</div>
          <div className="text-sm text-green-600">Average Score</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-700">{stats.bestScore}%</div>
          <div className="text-sm text-purple-600">Best Score</div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-700">{stats.streakInfo.current}</div>
          <div className="text-sm text-yellow-600">Current Streak (80%+)</div>
        </div>
      </div>

      {/* Trend and Streak Info */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Recent Performance Trend</h2>
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{getTrendEmoji(stats.recentTrend)}</span>
            <div>
              <p className={`font-semibold ${getTrendColor(stats.recentTrend)}`}>
                {stats.recentTrend === 'improving' ? 'Improving' :
                 stats.recentTrend === 'declining' ? 'Declining' : 'Stable'}
              </p>
              <p className="text-sm text-gray-600">
                Based on your last {Math.min(10, history.length)} tests
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Streak Information</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Current Streak (80%+):</span>
              <span className="font-bold">{stats.streakInfo.current} tests</span>
            </div>
            <div className="flex justify-between">
              <span>Best Streak:</span>
              <span className="font-bold">{stats.streakInfo.best} tests</span>
            </div>
            {stats.streakInfo.current > 0 && (
              <div className="mt-3 p-2 bg-green-100 rounded text-green-800 text-sm">
                🔥 Great job! Keep up the excellent performance!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Performance */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Category Performance Over Time</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(stats.categoryAverages)
            .sort(([,a], [,b]) => b - a)
            .map(([category, average]) => {
              const performanceLevel = getPerformanceLevel(average);
              return (
                <div key={category} className="bg-white p-4 rounded-lg border">
                  <h3 className="font-semibold mb-2">{category}</h3>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${performanceLevel.bgColor} ${performanceLevel.color}`}>
                      {performanceLevel.label}
                    </span>
                    <span className="font-bold">{average}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        average >= 80 ? 'bg-green-500' :
                        average >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${average}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Recent Tests */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Recent Test History</h2>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {history.slice(0, 10).map((test, index) => (
            <div key={test.id} className="bg-white p-4 rounded-lg border">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">#{history.length - index}</span>
                  <span className="text-sm text-gray-600">{test.date} at {test.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`font-bold text-lg ${
                    test.overallScore.percentage >= 80 ? 'text-green-600' :
                    test.overallScore.percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {test.overallScore.percentage}%
                  </span>
                  <span className="text-sm text-gray-500">
                    ({test.overallScore.earned}/{test.overallScore.possible})
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.entries(test.categoryBreakdown).map(([category, stats]) => (
                  <span 
                    key={category} 
                    className={`px-2 py-1 rounded-full text-xs ${
                      stats.percentage >= 80 ? 'bg-green-100 text-green-800' :
                      stats.percentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}
                  >
                    {category}: {stats.percentage}%
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;