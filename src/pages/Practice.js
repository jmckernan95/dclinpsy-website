/**
 * Practice Page Component
 * Main SJT practice interface (adapted from original App.js)
 * Supports both authenticated and anonymous usage
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import questionsData from '../questions';
import { generateRandomizedTest, convertDisplayRankingsToOriginal } from '../utils/randomization';
import { calculateQuestionScores, calculateTotalScore, getScoreColor } from '../utils/scoring';
import { calculateCategoryPerformance, getPerformanceLevel, getPerformanceHighlights, generateStudyRecommendations } from '../utils/categoryStats';
import { saveTestToHistory, getHistoryStats } from '../utils/testHistory';
import ProgressDashboard from '../components/ProgressDashboard';

// Constants for categories
const CATEGORIES = {
  BOUNDARIES: 'Professional Boundaries',
  RISK: 'Risk Management',
  ETHICS: 'Ethical Dilemmas',
  DIVERSITY: 'Diversity & Inclusion',
  CLINICAL: 'Clinical Decision-Making',
  INTERPROFESSIONAL: 'Interprofessional Working',
  TRAINEE: 'Trainee Development',
  SERVICE: 'Service Delivery'
};

const Practice = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { isLoggedIn, getUserTestHistoryKey } = useAuth();
  
  // Check if this is anonymous usage
  const isAnonymous = searchParams.get('anonymous') === 'true' || !isLoggedIn;
  
  // State management (same as original App.js)
  const [allQuestions, setAllQuestions] = useState([]);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userRankings, setUserRankings] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [questionScores, setQuestionScores] = useState([]);
  const [testCompleted, setTestCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [testSavedToHistory, setTestSavedToHistory] = useState(false);
  const [showProgressDashboard, setShowProgressDashboard] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');

  // Display welcome message if passed from navigation
  useEffect(() => {
    if (location.state?.message) {
      setWelcomeMessage(location.state.message);
      // Clear the message after showing it
      setTimeout(() => setWelcomeMessage(''), 5000);
    }
  }, [location.state]);

  // Initialize the app with questions and generate a new test
  useEffect(() => {
    setAllQuestions(questionsData);
  }, []);

  // Generate new test when questions are loaded
  useEffect(() => {
    if (allQuestions.length > 0) {
      generateNewTest();
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allQuestions]); // generateNewTest is stable and doesn't need to be in deps

  // Function to generate a new test with 10 random questions
  const generateNewTest = () => {
    const randomizedQuestions = generateRandomizedTest(allQuestions, 10);
    
    setCurrentQuestions(randomizedQuestions);
    setCurrentQuestionIndex(0);
    setUserRankings([]);
    setQuestionScores([]);
    setIsSubmitted(false);
    setTestCompleted(false);
    setTestSavedToHistory(false);
    setShowProgressDashboard(false);
  };

  // Function to retry the current test
  const retryCurrentTest = () => {
    setCurrentQuestionIndex(0);
    setUserRankings([]);
    setQuestionScores([]);
    setIsSubmitted(false);
    setTestCompleted(false);
    setTestSavedToHistory(false);
  };

  // Function to handle option selection/ranking
  const handleOptionClick = (optionIndex) => {
    if (isSubmitted) return;
    
    const updatedRankings = [...userRankings];
    const existingRankIndex = updatedRankings.findIndex(item => item.optionIndex === optionIndex);
    
    if (existingRankIndex !== -1) {
      updatedRankings.splice(existingRankIndex, 1);
      updatedRankings.forEach(item => {
        if (item.rank > existingRankIndex + 1) {
          item.rank -= 1;
        }
      });
    } else {
      updatedRankings.push({
        optionIndex,
        rank: updatedRankings.length + 1
      });
    }
    
    setUserRankings(updatedRankings);
  };

  // Function to handle submission
  const handleSubmit = () => {
    if (userRankings.length !== 5) return;
    
    const currentQuestion = currentQuestions[currentQuestionIndex];
    const originalRankings = convertDisplayRankingsToOriginal(userRankings, currentQuestion.shuffleMap);
    const scores = calculateQuestionScores(originalRankings, currentQuestion.originalRanking);
    
    const updatedScores = [...questionScores];
    updatedScores[currentQuestionIndex] = scores;
    setQuestionScores(updatedScores);
    
    setIsSubmitted(true);
  };

  // Function to move to the next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserRankings([]);
      setIsSubmitted(false);
    } else {
      setTestCompleted(true);
      // Save test to history if user is logged in
      if (isLoggedIn && !isAnonymous) {
        saveCompletedTestToHistory();
      }
    }
  };

  // Function to save completed test to history (for logged-in users)
  const saveCompletedTestToHistory = () => {
    if (testSavedToHistory || isAnonymous) return;
    
    const totalScore = getTotalScore();
    const categoryPerformance = calculateCategoryPerformance(currentQuestions, questionScores);
    
    const testData = {
      questions: currentQuestions,
      questionScores: questionScores,
      totalScore: totalScore,
      categoryPerformance: categoryPerformance
    };
    
    // Use user-specific storage for authenticated users
    // Storage key is handled by the testHistory utility
    
    const savedTest = saveTestToHistory(testData);
    if (savedTest) {
      setTestSavedToHistory(true);
    }
  };

  // Use the scoring utility for total score calculation
  const getTotalScore = () => {
    return calculateTotalScore(questionScores);
  };

  // Function to check for explanation mismatches (same as original)
  const checkExplanationMismatch = (explanation, idealRank) => {
    const hasMostAppropriate = explanation.toLowerCase().includes("most appropriate");
    const hasLeastAppropriate = explanation.toLowerCase().includes("least appropriate");
    
    if (hasMostAppropriate && idealRank === 5) {
      return "Note: There is a mismatch. This IS the least appropriate option despite what the explanation says.";
    }
    
    if (hasLeastAppropriate && idealRank === 1) {
      return "Note: There is a mismatch. This IS the most appropriate option despite what the explanation says.";
    }
    
    return null;
  };

  // Helper function to get rank label (same as original)
  const getRankLabel = (rank) => {
    switch (rank) {
      case 1: return "Most Appropriate Option (#1)";
      case 2: return "Second Most Appropriate Option (#2)";
      case 3: return "Middle Option (#3)";
      case 4: return "Second Least Appropriate Option (#4)";
      case 5: return "Least Appropriate Option (#5)";
      default: return `Option (#${rank})`;
    }
  };

  // Show Progress Dashboard if requested (only for logged-in users)
  if (showProgressDashboard && isLoggedIn && !isAnonymous) {
    return <ProgressDashboard onClose={() => setShowProgressDashboard(false)} />;
  }

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
          DClinPsy Situational Judgment Test Practice
        </h1>
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="mb-4">Loading questions...</p>
        </div>
      </div>
    );
  }

  // If the test is completed, show results summary
  if (testCompleted) {
    const totalScore = getTotalScore();
    const categoryPerformance = calculateCategoryPerformance(currentQuestions, questionScores);
    const performanceHighlights = getPerformanceHighlights(categoryPerformance.sortedCategories);
    const studyRecommendations = generateStudyRecommendations(categoryPerformance.sortedCategories);
    
    return (
      <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg">
        {/* Header with Navigation */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-700">Test Results</h1>
          <Link to="/" className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition">
            Back to Home
          </Link>
        </div>
        
        {/* Anonymous User Notice */}
        {isAnonymous && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-yellow-800 mb-2">📝 Anonymous Practice Session</h3>
            <p className="text-sm text-yellow-700 mb-3">
              Your results are not saved. Create an account to track progress and receive personalized recommendations.
            </p>
            <div className="flex space-x-3">
              <Link
                to="/register"
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
              >
                Create Account
              </Link>
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
              >
                Login
              </Link>
            </div>
          </div>
        )}
        
        <div className="bg-blue-50 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Overall Score</h2>
          <div className="text-center">
            <p className="text-4xl font-bold mb-2">
              {totalScore.earned} / {totalScore.possible}
            </p>
            <p className={`text-2xl font-bold ${
              totalScore.percentage >= 80 ? "text-green-600" : 
              totalScore.percentage >= 60 ? "text-yellow-500" : "text-red-500"
            }`}>
              {totalScore.percentage}%
            </p>
          </div>
        </div>

        {/* Category Performance Breakdown - same as original */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Performance by Category</h2>
          <div className="space-y-4">
            {categoryPerformance.sortedCategories.map((categoryStats, index) => {
              const performanceLevel = getPerformanceLevel(categoryStats.percentage);
              return (
                <div key={categoryStats.category} className="border rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-lg">{categoryStats.category}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-sm font-medium ${performanceLevel.bgColor} ${performanceLevel.color}`}>
                        {performanceLevel.label}
                      </span>
                      <span className="font-bold text-lg">{categoryStats.percentage}%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>{categoryStats.questionsCount} question{categoryStats.questionsCount !== 1 ? 's' : ''}</span>
                    <span>{categoryStats.totalEarned}/{categoryStats.totalPossible} points</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        categoryStats.percentage >= 80 ? 'bg-green-500' :
                        categoryStats.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${categoryStats.percentage}%` }}
                    ></div>
                  </div>
                  
                  <p className="text-sm text-gray-600">{performanceLevel.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Performance Highlights - same as original */}
        {(performanceHighlights.strongest || performanceHighlights.weakest) && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-4">Performance Highlights</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {performanceHighlights.strongest && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">🌟 Strongest Area</h3>
                  <p className="text-green-700">
                    <strong>{performanceHighlights.strongest.category}</strong> 
                    <br />
                    {performanceHighlights.strongest.percentage}% ({performanceHighlights.strongest.questionsCount} question{performanceHighlights.strongest.questionsCount !== 1 ? 's' : ''})
                  </p>
                </div>
              )}
              
              {performanceHighlights.weakest && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h3 className="font-semibold text-orange-800 mb-2">📚 Area for Development</h3>
                  <p className="text-orange-700">
                    <strong>{performanceHighlights.weakest.category}</strong> 
                    <br />
                    {performanceHighlights.weakest.percentage}% ({performanceHighlights.weakest.questionsCount} question{performanceHighlights.weakest.questionsCount !== 1 ? 's' : ''})
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Study Recommendations - same as original */}
        {studyRecommendations.length > 0 && (
          <div className="bg-purple-50 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-4">📖 Study Recommendations</h2>
            <div className="space-y-3">
              {studyRecommendations.map((rec, index) => (
                <div key={index} className={`p-3 rounded-lg border ${
                  rec.type === 'priority' ? 'bg-red-50 border-red-200' :
                  rec.type === 'strength' ? 'bg-green-50 border-green-200' :
                  'bg-blue-50 border-blue-200'
                }`}>
                  <h3 className={`font-semibold mb-1 ${
                    rec.type === 'priority' ? 'text-red-800' :
                    rec.type === 'strength' ? 'text-green-800' :
                    'text-blue-800'
                  }`}>{rec.title}</h3>
                  <p className={`text-sm ${
                    rec.type === 'priority' ? 'text-red-700' :
                    rec.type === 'strength' ? 'text-green-700' :
                    'text-blue-700'
                  }`}>{rec.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Question-by-Question Breakdown</h2>
          {questionScores.map((scores, index) => {
            const questionScore = scores.reduce((sum, option) => sum + option.score, 0);
            const maxScore = scores.length * 4;
            const percentage = Math.round((questionScore / maxScore) * 100);
            
            return (
              <div key={index} className="mb-4 p-3 border-b border-gray-200">
                <p className="font-medium">
                  Scenario {index + 1}: {currentQuestions[index].category}
                </p>
                <p className={`font-bold ${
                  percentage >= 80 ? "text-green-600" : 
                  percentage >= 60 ? "text-yellow-500" : "text-red-500"
                }`}>
                  Score: {questionScore}/{maxScore} ({percentage}%)
                </p>
              </div>
            );
          })}
        </div>
        
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={generateNewTest}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Generate New Test
          </button>
          <button
            onClick={retryCurrentTest}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Retry This Test
          </button>
          {isLoggedIn && !isAnonymous && (
            <button
              onClick={() => setShowProgressDashboard(true)}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              View Progress 📊
            </button>
          )}
        </div>
      </div>
    );
  }

  // Main question display (same as original with navigation updates)
  const currentQuestion = currentQuestions[currentQuestionIndex];
  
  if (!currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-700">
            DClinPsy Situational Judgment Test Practice
          </h1>
          <Link to="/" className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition">
            Back to Home
          </Link>
        </div>
        <div className="text-center p-8">
          <p className="mb-4">No questions available.</p>
          <p>Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700">
          DClinPsy Situational Judgment Test Practice
        </h1>
        <div className="flex items-center space-x-3">
          {isLoggedIn && !isAnonymous && (
            <button
              onClick={() => setShowProgressDashboard(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm"
            >
              Progress 📊
            </button>
          )}
          <Link to="/" className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm">
            Home
          </Link>
        </div>
      </div>

      {/* Welcome Message */}
      {welcomeMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-center font-medium">✅ {welcomeMessage}</p>
        </div>
      )}

      {/* Anonymous Notice */}
      {isAnonymous && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-center">
            <strong>Anonymous Practice:</strong> Your results won't be saved. 
            <Link to="/register" className="text-blue-600 hover:underline ml-1">Create an account</Link> 
            to track progress.
          </p>
        </div>
      )}
      
      {/* Question Header - same as original */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">
            Scenario {currentQuestionIndex + 1} of {currentQuestions.length}
          </h2>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {currentQuestion.category}
          </span>
        </div>
        <p className="text-gray-800 bg-blue-50 p-4 rounded-lg">
          {currentQuestion.scenario}
        </p>
      </div>
      
      {/* Ranking Area - same as original */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">
          Rank the following responses from most appropriate (1) to least appropriate (5):
        </h3>
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const userRanking = userRankings.find(r => r.optionIndex === index);
            const isRanked = Boolean(userRanking);
            
            return (
              <div 
                key={index}
                onClick={() => handleOptionClick(index)}
                className={`p-3 rounded-lg flex items-start cursor-pointer border ${
                  isRanked ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'
                } transition`}
              >
                {isRanked && (
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3 mt-0.5">
                    {userRanking.rank}
                  </div>
                )}
                <div className="flex-grow">
                  <p>{option}</p>
                  {isRanked && (
                    <p className="text-sm text-blue-600 mt-1">(Click again to deselect)</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={userRankings.length !== 5 || isSubmitted}
            className={`px-6 py-2 rounded-lg ${
              userRankings.length === 5 && !isSubmitted
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            } transition`}
          >
            Submit
          </button>
        </div>
      </div>
      
      {/* Feedback Area - same as original */}
      {isSubmitted && (
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-4">Feedback</h3>
          
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((targetRank) => {
              const originalIndex = currentQuestion.originalRanking.findIndex(rank => rank === targetRank);
              if (originalIndex === -1) return null;
              
              const result = questionScores[currentQuestionIndex].find(r => r.optionIndex === originalIndex);
              const userRank = result?.userRank || 0;
              const score = result?.score || 0;
              
              const option = currentQuestion.originalOptions[originalIndex];
              const explanation = currentQuestion.originalExplanations[originalIndex];
              const mismatchWarning = checkExplanationMismatch(explanation, targetRank);
              
              return (
                <div key={`rank-${targetRank}`} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{getRankLabel(targetRank)}</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Your ranking: {userRank || 'Not ranked'} | Ideal ranking: {targetRank}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full ${getScoreColor(score)} font-bold`}>
                      {score}/4 pts
                    </div>
                  </div>
                  
                  <p className="mb-2">{option}</p>
                  <div className="bg-white p-3 rounded border">
                    <p className="text-sm">{explanation}</p>
                    {mismatchWarning && (
                      <p className="text-sm text-red-600 mt-2 font-medium">{mismatchWarning}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setIsSubmitted(false)}
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
            >
              Back to Rankings
            </button>
            <button
              onClick={handleNextQuestion}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {currentQuestionIndex < currentQuestions.length - 1 ? 'Next Question' : 'View Results'}
            </button>
          </div>
        </div>
      )}
      
      {/* Footer - updated for v4 */}
      <div className="mt-8 pt-4 border-t border-gray-200 text-sm text-gray-600">
        <p>DClinPsy Situational Judgment Test Practice App v4</p>
        <p className="mt-1">
          Question bank: {allQuestions.length} scenarios across categories including {Object.values(CATEGORIES).slice(0, 3).join(', ')}, and more
        </p>
        <div className="mt-1 text-xs space-x-4">
          <span className="text-blue-600">✨ v4: User accounts with progress tracking</span>
          {isAnonymous && (
            <span className="text-yellow-600">📝 Anonymous mode: Results not saved</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Practice;