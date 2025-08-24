/**
 * Stat Question Component
 * Individual question display for statistics tests
 */

import React, { useState } from 'react';

const StatQuestion = ({ question, userAnswer, onAnswer, questionNumber }) => {
  const [inputValue, setInputValue] = useState(userAnswer?.toString() || '');

  const handleMultipleChoiceAnswer = (optionIndex) => {
    onAnswer(optionIndex);
  };

  const handleTrueFalseAnswer = (value) => {
    onAnswer(value);
  };

  const handleNumericalAnswer = () => {
    const numericValue = parseFloat(inputValue);
    if (!isNaN(numericValue)) {
      onAnswer(numericValue);
    }
  };

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

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Question Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <span className="text-2xl font-bold text-blue-600">
            Q{questionNumber}
          </span>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              {question.category}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty}
            </span>
            {question.points && (
              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                {question.points} pts
              </span>
            )}
          </div>
        </div>
        
        {question.timeLimit && (
          <div className="text-sm text-gray-500">
            ⏱️ Suggested time: {Math.floor(question.timeLimit / 60)}:{(question.timeLimit % 60).toString().padStart(2, '0')}
          </div>
        )}
      </div>

      {/* Question Text */}
      <div className="mb-6">
        <p className="text-lg text-gray-800 leading-relaxed">
          {question.question}
        </p>
      </div>

      {/* Answer Options */}
      <div className="mb-6">
        {question.type === 'multiple-choice' && (
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition ${
                  userAnswer === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={index}
                  checked={userAnswer === index}
                  onChange={() => handleMultipleChoiceAnswer(index)}
                  className="mt-1 mr-3"
                />
                <span className="flex-1 text-gray-800">
                  <span className="font-medium mr-2">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </span>
              </label>
            ))}
          </div>
        )}

        {question.type === 'true-false' && (
          <div className="space-y-3">
            <label
              className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition ${
                userAnswer === true
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                checked={userAnswer === true}
                onChange={() => handleTrueFalseAnswer(true)}
                className="mr-3"
              />
              <span className="text-gray-800 font-medium">True</span>
            </label>
            
            <label
              className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition ${
                userAnswer === false
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                checked={userAnswer === false}
                onChange={() => handleTrueFalseAnswer(false)}
                className="mr-3"
              />
              <span className="text-gray-800 font-medium">False</span>
            </label>
          </div>
        )}

        {question.type === 'numerical-input' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 font-medium">
                Your answer:
              </label>
              <input
                type="number"
                step="any"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={handleNumericalAnswer}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleNumericalAnswer();
                  }
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter numerical answer"
              />
            </div>
            
            {question.tolerance !== undefined && (
              <div className="text-sm text-gray-500">
                <span className="font-medium">Note:</span> Answers within ±{question.tolerance} of the correct value will be accepted.
              </div>
            )}
            
            <button
              onClick={handleNumericalAnswer}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Submit Answer
            </button>
          </div>
        )}
      </div>

      {/* Answer Status */}
      {(userAnswer !== null && userAnswer !== undefined) && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center text-green-700">
            <span className="mr-2">✓</span>
            <span className="font-medium">Answer selected</span>
          </div>
        </div>
      )}

      {/* Question Tags */}
      {question.tags && question.tags.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 font-medium">Topics:</span>
            <div className="flex flex-wrap gap-2">
              {question.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatQuestion;