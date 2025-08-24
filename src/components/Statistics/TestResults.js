/**
 * Test Results Component
 * Displays detailed results for completed statistics tests
 */

import React, { useState } from 'react';

const TestResults = ({ results, onRetakeTest, onBackToSettings, onViewTheory }) => {
  const [showDetailedFeedback, setShowDetailedFeedback] = useState(false);

  const getScoreColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getPerformanceLevel = (percentage) => {
    if (percentage >= 90) return { level: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (percentage >= 80) return { level: 'Good', color: 'bg-blue-100 text-blue-800' };
    if (percentage >= 70) return { level: 'Satisfactory', color: 'bg-yellow-100 text-yellow-800' };
    if (percentage >= 60) return { level: 'Needs Practice', color: 'bg-orange-100 text-orange-800' };
    return { level: 'Requires Focus', color: 'bg-red-100 text-red-800' };
  };

  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const performance = getPerformanceLevel(results.percentage);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Test Results
          </h1>
          <p className="text-lg text-gray-600">
            Statistics Practice Test Complete
          </p>
        </div>

        {/* Overall Score Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center mb-6">
            <div className={`text-6xl font-bold mb-2 ${getScoreColor(results.percentage)}`}>
              {results.percentage}%
            </div>
            <div className={`inline-block px-4 py-2 rounded-full font-medium ${performance.color}`}>
              {performance.level}
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{results.correctAnswers}</div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{results.totalQuestions}</div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{results.totalPoints}</div>
              <div className="text-sm text-gray-600">Points Earned</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{formatTime(results.timeSpent)}</div>
              <div className="text-sm text-gray-600">Time Spent</div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        {Object.keys(results.categoryBreakdown).length > 1 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Performance by Category</h2>
            <div className="space-y-4">
              {Object.entries(results.categoryBreakdown).map(([category, data]) => {
                const percentage = Math.round((data.correct / data.total) * 100);
                return (
                  <div key={category} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{category}</h3>
                      <p className="text-sm text-gray-600">
                        {data.correct} of {data.total} correct ({percentage}%)
                      </p>
                    </div>
                    <div className="w-32 ml-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getScoreColor(percentage).includes('green') ? 'bg-green-500' : 
                            getScoreColor(percentage).includes('blue') ? 'bg-blue-500' : 
                            getScoreColor(percentage).includes('yellow') ? 'bg-yellow-500' : 
                            getScoreColor(percentage).includes('orange') ? 'bg-orange-500' : 'bg-red-500'}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className={`ml-3 text-sm font-medium ${getScoreColor(percentage)}`}>
                      {percentage}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Detailed Question Review */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Question Review</h2>
            <button
              onClick={() => setShowDetailedFeedback(!showDetailedFeedback)}
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              {showDetailedFeedback ? 'Hide Details' : 'Show Details'}
            </button>
          </div>

          <div className="space-y-4">
            {results.questionResults.map((result, index) => (
              <div
                key={result.question.id}
                className={`p-4 rounded-lg border-l-4 ${
                  result.isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-800">
                    Question {index + 1}: {result.question.category}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${result.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      {result.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {result.pointsEarned}/{result.question.points} pts
                    </span>
                  </div>
                </div>

                {showDetailedFeedback && (
                  <div className="mt-3 text-sm">
                    <p className="text-gray-700 mb-2">
                      <strong>Question:</strong> {result.question.question}
                    </p>
                    
                    {result.question.type === 'multiple-choice' && (
                      <div className="mb-2">
                        <p className="text-gray-700">
                          <strong>Your Answer:</strong> {result.question.options[result.userAnswer]} 
                        </p>
                        <p className="text-gray-700">
                          <strong>Correct Answer:</strong> {result.question.options[result.question.correctAnswer]}
                        </p>
                      </div>
                    )}
                    
                    {result.question.type === 'true-false' && (
                      <div className="mb-2">
                        <p className="text-gray-700">
                          <strong>Your Answer:</strong> {result.userAnswer ? 'True' : 'False'}
                        </p>
                        <p className="text-gray-700">
                          <strong>Correct Answer:</strong> {result.question.correctAnswer ? 'True' : 'False'}
                        </p>
                      </div>
                    )}
                    
                    {result.question.type === 'numerical-input' && (
                      <div className="mb-2">
                        <p className="text-gray-700">
                          <strong>Your Answer:</strong> {result.userAnswer}
                        </p>
                        <p className="text-gray-700">
                          <strong>Correct Answer:</strong> {result.question.correctAnswer}
                        </p>
                      </div>
                    )}
                    
                    <div className="mt-2 p-3 bg-white rounded border">
                      <p className="text-gray-800">
                        <strong>Explanation:</strong> {result.question.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Study Recommendations */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📚 Study Recommendations</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(results.categoryBreakdown)
              .filter(([, data]) => (data.correct / data.total) < 0.8)
              .map(([category]) => (
                <div key={category} className="flex items-start space-x-3">
                  <div className="text-blue-600">📖</div>
                  <div>
                    <h4 className="font-medium text-gray-800">Review {category}</h4>
                    <p className="text-sm text-gray-600">
                      Focus on concepts in this category to improve your understanding
                    </p>
                  </div>
                </div>
              ))}
            
            {results.percentage < 70 && (
              <div className="flex items-start space-x-3">
                <div className="text-blue-600">🎯</div>
                <div>
                  <h4 className="font-medium text-gray-800">Practice More</h4>
                  <p className="text-sm text-gray-600">
                    Take additional practice tests to strengthen your knowledge
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRetakeTest}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Retake Test
          </button>
          
          <button
            onClick={onViewTheory}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
          >
            Study Theory
          </button>
          
          <button
            onClick={onBackToSettings}
            className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition"
          >
            New Test Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestResults;