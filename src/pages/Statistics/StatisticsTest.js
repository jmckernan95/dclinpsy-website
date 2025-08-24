/**
 * Statistics Test Page
 * Quiz interface for statistics practice testing
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { statisticsQuestions, questionMetadata } from '../../data/statistics-questions';
import StatQuestion from '../../components/Statistics/StatQuestion';
import TestResults from '../../components/Statistics/TestResults';

const StatisticsTest = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  
  // Test configuration
  const [testSettings, setTestSettings] = useState({
    numQuestions: 5,
    difficulty: 'all',
    category: 'all',
    timeLimit: true
  });

  // Test state
  const [currentTest, setCurrentTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [testStartTime, setTestStartTime] = useState(null);
  const [testEndTime, setTestEndTime] = useState(null);
  const [isTestActive, setIsTestActive] = useState(false);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [testResults, setTestResults] = useState(null);
  
  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [timerActive, setTimerActive] = useState(false);

  // Generate new test
  const generateTest = () => {
    let availableQuestions = [...statisticsQuestions];
    
    // Filter by difficulty
    if (testSettings.difficulty !== 'all') {
      availableQuestions = availableQuestions.filter(q => 
        q.difficulty.toLowerCase() === testSettings.difficulty.toLowerCase()
      );
    }
    
    // Filter by category
    if (testSettings.category !== 'all') {
      availableQuestions = availableQuestions.filter(q => 
        q.category === testSettings.category
      );
    }
    
    // Shuffle and select questions
    const shuffled = availableQuestions.sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, Math.min(testSettings.numQuestions, shuffled.length));
    
    return selectedQuestions;
  };

  // Start test
  const startTest = () => {
    const questions = generateTest();
    if (questions.length === 0) {
      alert('No questions available for the selected criteria. Please adjust your settings.');
      return;
    }
    
    setCurrentTest(questions);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setTestStartTime(new Date());
    setTestEndTime(null);
    setIsTestActive(true);
    setIsTestComplete(false);
    setTestResults(null);
    
    // Set up timer if enabled
    if (testSettings.timeLimit) {
      const totalTime = questions.reduce((sum, q) => sum + q.timeLimit, 0);
      setTimeRemaining(totalTime);
      setTimerActive(true);
    }
  };

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 1) {
            finishTest();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeRemaining]);

  // Handle answer submission
  const handleAnswer = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  // Move to next question
  const nextQuestion = () => {
    if (currentQuestionIndex < currentTest.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishTest();
    }
  };

  // Move to previous question
  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Finish test
  const finishTest = () => {
    setTestEndTime(new Date());
    setIsTestActive(false);
    setIsTestComplete(true);
    setTimerActive(false);
    calculateResults();
  };

  // Calculate test results
  const calculateResults = () => {
    if (!currentTest) return;

    const results = {
      totalQuestions: currentTest.length,
      answeredQuestions: Object.keys(userAnswers).length,
      correctAnswers: 0,
      totalPoints: 0,
      maxPoints: 0,
      timeSpent: testStartTime ? (testEndTime || new Date()) - testStartTime : 0,
      questionResults: [],
      categoryBreakdown: {}
    };

    currentTest.forEach(question => {
      const userAnswer = userAnswers[question.id];
      const isCorrect = checkAnswer(question, userAnswer);
      const pointsEarned = isCorrect ? question.points : 0;
      
      results.maxPoints += question.points;
      results.totalPoints += pointsEarned;
      
      if (isCorrect) {
        results.correctAnswers++;
      }
      
      results.questionResults.push({
        question,
        userAnswer,
        isCorrect,
        pointsEarned
      });
      
      // Category breakdown
      if (!results.categoryBreakdown[question.category]) {
        results.categoryBreakdown[question.category] = {
          correct: 0,
          total: 0,
          points: 0,
          maxPoints: 0
        };
      }
      
      results.categoryBreakdown[question.category].total++;
      results.categoryBreakdown[question.category].maxPoints += question.points;
      results.categoryBreakdown[question.category].points += pointsEarned;
      
      if (isCorrect) {
        results.categoryBreakdown[question.category].correct++;
      }
    });
    
    results.percentage = results.maxPoints > 0 ? Math.round((results.totalPoints / results.maxPoints) * 100) : 0;
    
    setTestResults(results);
    
    // Save to localStorage if logged in
    if (isLoggedIn) {
      saveTestResults(results);
    }
  };

  // Check if answer is correct
  const checkAnswer = (question, userAnswer) => {
    if (userAnswer === null || userAnswer === undefined) return false;
    
    switch (question.type) {
      case 'multiple-choice':
        return userAnswer === question.correctAnswer;
      case 'true-false':
        return userAnswer === question.correctAnswer;
      case 'numerical-input':
        const tolerance = question.tolerance || 0;
        return Math.abs(userAnswer - question.correctAnswer) <= tolerance;
      default:
        return false;
    }
  };

  // Save test results to localStorage
  const saveTestResults = (results) => {
    try {
      const existingResults = JSON.parse(localStorage.getItem('statistics-test-history') || '[]');
      const newResult = {
        ...results,
        timestamp: new Date().toISOString(),
        settings: testSettings
      };
      existingResults.push(newResult);
      
      // Keep only last 50 results
      if (existingResults.length > 50) {
        existingResults.splice(0, existingResults.length - 50);
      }
      
      localStorage.setItem('statistics-test-history', JSON.stringify(existingResults));
    } catch (error) {
      console.error('Error saving test results:', error);
    }
  };

  // Format time
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Reset test
  const resetTest = () => {
    setCurrentTest(null);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setTestStartTime(null);
    setTestEndTime(null);
    setIsTestActive(false);
    setIsTestComplete(false);
    setTestResults(null);
    setTimeRemaining(null);
    setTimerActive(false);
  };

  // Show results
  if (isTestComplete && testResults) {
    return (
      <TestResults
        results={testResults}
        onRetakeTest={resetTest}
        onBackToSettings={resetTest}
        onViewTheory={() => navigate('/statistics/theory')}
      />
    );
  }

  // Show active test
  if (isTestActive && currentTest) {
    const currentQuestion = currentTest[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / currentTest.length) * 100;
    
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Test Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Statistics Practice Test</h1>
                <p className="text-gray-600">
                  Question {currentQuestionIndex + 1} of {currentTest.length}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                {testSettings.timeLimit && (
                  <div className={`text-lg font-mono ${timeRemaining < 60 ? 'text-red-600' : 'text-gray-800'}`}>
                    ⏱️ {formatTime(timeRemaining)}
                  </div>
                )}
                
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to end the test?')) {
                      finishTest();
                    }
                  }}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  End Test
                </button>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          
          {/* Question */}
          <StatQuestion
            question={currentQuestion}
            userAnswer={userAnswers[currentQuestion.id]}
            onAnswer={(answer) => handleAnswer(currentQuestion.id, answer)}
            questionNumber={currentQuestionIndex + 1}
          />
          
          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <button
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                currentQuestionIndex === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              ← Previous
            </button>
            
            <button
              onClick={nextQuestion}
              disabled={!userAnswers[currentQuestion.id] && userAnswers[currentQuestion.id] !== 0 && userAnswers[currentQuestion.id] !== false}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                !userAnswers[currentQuestion.id] && userAnswers[currentQuestion.id] !== 0 && userAnswers[currentQuestion.id] !== false
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : currentQuestionIndex === currentTest.length - 1
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {currentQuestionIndex === currentTest.length - 1 ? 'Finish Test' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show test setup
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
            <span className="text-gray-800">Practice Test</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Statistics Practice Test
          </h1>
          <p className="text-lg text-gray-600">
            Test your knowledge of statistical concepts and methods
          </p>
        </div>

        {/* Test Settings */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Test Settings</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions
              </label>
              <select
                value={testSettings.numQuestions}
                onChange={(e) => setTestSettings(prev => ({...prev, numQuestions: parseInt(e.target.value)}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
                <option value={statisticsQuestions.length}>All Questions ({statisticsQuestions.length})</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                value={testSettings.difficulty}
                onChange={(e) => setTestSettings(prev => ({...prev, difficulty: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Levels</option>
                <option value="basic">Basic</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Focus
              </label>
              <select
                value={testSettings.category}
                onChange={(e) => setTestSettings(prev => ({...prev, category: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {questionMetadata.categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timer
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={testSettings.timeLimit}
                    onChange={() => setTestSettings(prev => ({...prev, timeLimit: true}))}
                    className="mr-2"
                  />
                  Timed
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={!testSettings.timeLimit}
                    onChange={() => setTestSettings(prev => ({...prev, timeLimit: false}))}
                    className="mr-2"
                  />
                  Untimed
                </label>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={startTest}
              className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition transform hover:scale-105"
            >
              Start Test
            </button>
          </div>
        </div>

        {/* Quick Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">📊 Available Content</h3>
            <div className="space-y-2 text-sm">
              <div>Total Questions: <span className="font-semibold">{questionMetadata.totalQuestions}</span></div>
              <div>Categories: <span className="font-semibold">{questionMetadata.categories.length}</span></div>
              <div>Difficulty Levels: <span className="font-semibold">3</span></div>
              <div>Question Types: <span className="font-semibold">Multiple Choice, Numerical, True/False</span></div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">💡 Test Tips</h3>
            <ul className="space-y-2 text-sm">
              <li>• Read questions carefully before answering</li>
              <li>• Pay attention to numerical precision requirements</li>
              <li>• Use the timer to practice exam conditions</li>
              <li>• Review explanations after completing the test</li>
            </ul>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="mt-8 text-center">
          <div className="inline-flex space-x-4">
            <Link
              to="/statistics/theory"
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              📚 Study Theory First
            </Link>
            <Link
              to="/practice"
              className="px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition"
            >
              🎯 SJT Practice
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsTest;