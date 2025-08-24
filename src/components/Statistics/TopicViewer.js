/**
 * Topic Viewer Component
 * Detailed view for individual statistics topics
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TopicViewer = ({ topic, isCompleted, isBookmarked, onComplete, onBookmark, onBack }) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [showFormulas, setShowFormulas] = useState(true);

  if (!topic) return null;

  const currentSection = topic.sections[currentSectionIndex];

  const formatContent = (content) => {
    // Simple markdown-style formatting
    return content
      .split('\n')
      .map((line, index) => {
        // Headers
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold text-gray-800 mb-4 mt-6">{line.substring(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-semibold text-gray-800 mb-3 mt-5">{line.substring(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-semibold text-gray-800 mb-2 mt-4">{line.substring(4)}</h3>;
        }
        
        // Bold text
        if (line.startsWith('- **') && line.includes('**:')) {
          const parts = line.split('**');
          return (
            <div key={index} className="mb-2">
              <span className="font-semibold text-gray-800">{parts[1]}</span>
              <span className="text-gray-600">: {parts[2].substring(1)}</span>
            </div>
          );
        }
        
        // Lists
        if (line.startsWith('- ')) {
          return <li key={index} className="text-gray-700 mb-1">{line.substring(2)}</li>;
        }
        if (line.startsWith('• ')) {
          return <li key={index} className="text-gray-700 mb-1">{line.substring(2)}</li>;
        }
        
        // Regular paragraphs
        if (line.trim() && !line.startsWith('#')) {
          return <p key={index} className="text-gray-700 mb-3 leading-relaxed">{line}</p>;
        }
        
        // Empty lines
        return <div key={index} className="mb-2"></div>;
      });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <span>→</span>
            <Link to="/statistics" className="hover:text-blue-600">Statistics</Link>
            <span>→</span>
            <button onClick={onBack} className="hover:text-blue-600">Theory</button>
            <span>→</span>
            <span className="text-gray-800">{topic.title}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                {topic.title}
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                {topic.description}
              </p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <span className="mr-1">⏱️</span>
                  {topic.estimatedTime}
                </span>
                <span className="flex items-center">
                  <span className="mr-1">📊</span>
                  {topic.difficulty}
                </span>
                <span className="flex items-center">
                  <span className="mr-1">🏷️</span>
                  {topic.category}
                </span>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <button
                onClick={onBookmark}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  isBookmarked
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-orange-100 hover:text-orange-700'
                }`}
              >
                {isBookmarked ? '🔖 Bookmarked' : '🔖 Bookmark'}
              </button>
              
              {!isCompleted && (
                <button
                  onClick={onComplete}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  ✓ Mark Complete
                </button>
              )}
              
              {isCompleted && (
                <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium">
                  ✓ Completed
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Table of Contents */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Contents</h3>
              <nav className="space-y-2">
                {topic.sections.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => setCurrentSectionIndex(index)}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                      index === currentSectionIndex
                        ? 'bg-blue-100 text-blue-800 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
              
              {/* Quick actions */}
              <div className="mt-6 pt-6 border-t">
                <div className="space-y-2">
                  <Link
                    to="/statistics/test"
                    className="block w-full px-3 py-2 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 transition text-sm"
                  >
                    Practice Test
                  </Link>
                  <button
                    onClick={() => setShowFormulas(!showFormulas)}
                    className="block w-full px-3 py-2 bg-gray-200 text-gray-700 text-center rounded-lg hover:bg-gray-300 transition text-sm"
                  >
                    {showFormulas ? 'Hide' : 'Show'} Formulas
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg">
              {/* Section Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {currentSection.title}
                  </h2>
                  <div className="text-sm text-gray-500">
                    Section {currentSectionIndex + 1} of {topic.sections.length}
                  </div>
                </div>
              </div>

              {/* Section Content */}
              <div className="px-6 py-6">
                <div className="prose prose-lg max-w-none">
                  {formatContent(currentSection.content)}
                </div>

                {/* Formulas Box */}
                {showFormulas && currentSection.formulas && currentSection.formulas.length > 0 && (
                  <div className="mt-8 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">📐 Key Formulas</h4>
                    <div className="space-y-3">
                      {currentSection.formulas.map((formula, index) => (
                        <div key={index} className="bg-white p-3 rounded border">
                          <div className="font-medium text-gray-800 mb-1">{formula.name}</div>
                          <div className="font-mono text-blue-700 bg-blue-50 px-2 py-1 rounded">
                            {formula.formula}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Practice Problems */}
                {topic.practiceProblems && topic.practiceProblems.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">🧮 Practice Problems</h4>
                    <div className="space-y-4">
                      {topic.practiceProblems.map((problem, index) => (
                        <div key={index} className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                          <div className="font-medium text-gray-800 mb-2">
                            Problem {index + 1}: {problem.question}
                          </div>
                          <details className="mt-2">
                            <summary className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
                              Show Solution
                            </summary>
                            <div className="mt-2 pt-2 border-t border-yellow-200">
                              <div className="font-medium text-green-700 mb-1">
                                Answer: {problem.answer}
                              </div>
                              <div className="text-sm text-gray-700">
                                {problem.explanation}
                              </div>
                            </div>
                          </details>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
                <button
                  onClick={() => setCurrentSectionIndex(Math.max(0, currentSectionIndex - 1))}
                  disabled={currentSectionIndex === 0}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    currentSectionIndex === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-600 text-white hover:bg-gray-700'
                  }`}
                >
                  ← Previous Section
                </button>
                
                <button
                  onClick={() => setCurrentSectionIndex(Math.min(topic.sections.length - 1, currentSectionIndex + 1))}
                  disabled={currentSectionIndex === topic.sections.length - 1}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    currentSectionIndex === topic.sections.length - 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Next Section →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicViewer;