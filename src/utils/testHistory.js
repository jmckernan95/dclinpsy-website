/**
 * Utility functions for managing test history using localStorage
 */

const STORAGE_KEY = 'dclinpsy-sjt-test-history';

/**
 * Gets all test history from localStorage
 * @returns {Array} - Array of test history objects
 */
export const getTestHistory = () => {
  try {
    const history = localStorage.getItem(STORAGE_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error reading test history from localStorage:', error);
    return [];
  }
};

/**
 * Saves a completed test to history
 * @param {Object} testData - Test data to save
 * @param {Array} testData.questions - Questions from the test
 * @param {Array} testData.questionScores - Scores for each question
 * @param {Object} testData.totalScore - Overall score information
 * @param {Object} testData.categoryPerformance - Category performance data
 */
export const saveTestToHistory = (testData) => {
  try {
    const history = getTestHistory();
    
    const testEntry = {
      id: Date.now() + Math.random().toString(36).substr(2, 9), // Unique ID
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      questionsCount: testData.questions.length,
      overallScore: {
        earned: testData.totalScore.earned,
        possible: testData.totalScore.possible,
        percentage: testData.totalScore.percentage
      },
      categoryBreakdown: testData.categoryPerformance.categoryStats,
      questions: testData.questions.map((question, index) => {
        const questionScore = testData.questionScores[index];
        const earned = questionScore.reduce((sum, option) => sum + option.score, 0);
        const possible = questionScore.length * 4;
        return {
          category: question.category,
          scenario: question.scenario.substring(0, 100) + '...', // Truncated for storage
          earned,
          possible,
          percentage: Math.round((earned / possible) * 100)
        };
      })
    };
    
    // Add to beginning of array (most recent first)
    history.unshift(testEntry);
    
    // Keep only the most recent 50 tests to avoid localStorage size issues
    const trimmedHistory = history.slice(0, 50);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
    
    return testEntry;
  } catch (error) {
    console.error('Error saving test to history:', error);
    return null;
  }
};

/**
 * Clears all test history
 */
export const clearTestHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing test history:', error);
    return false;
  }
};

/**
 * Gets summary statistics from test history
 * @returns {Object} - Summary statistics
 */
export const getHistoryStats = () => {
  const history = getTestHistory();
  
  if (history.length === 0) {
    return {
      totalTests: 0,
      averageScore: 0,
      bestScore: 0,
      recentTrend: 'stable',
      categoryAverages: {},
      streakInfo: { current: 0, best: 0 }
    };
  }
  
  // Calculate basic stats
  const totalTests = history.length;
  const scores = history.map(test => test.overallScore.percentage);
  const averageScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  const bestScore = Math.max(...scores);
  
  // Calculate recent trend (comparing last 5 tests to previous 5)
  let recentTrend = 'stable';
  if (history.length >= 10) {
    const recent5 = scores.slice(0, 5);
    const previous5 = scores.slice(5, 10);
    const recentAvg = recent5.reduce((sum, score) => sum + score, 0) / 5;
    const previousAvg = previous5.reduce((sum, score) => sum + score, 0) / 5;
    const difference = recentAvg - previousAvg;
    
    if (difference > 5) recentTrend = 'improving';
    else if (difference < -5) recentTrend = 'declining';
  }
  
  // Calculate category averages
  const categoryTotals = {};
  const categoryCounts = {};
  
  history.forEach(test => {
    Object.entries(test.categoryBreakdown).forEach(([category, stats]) => {
      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
        categoryCounts[category] = 0;
      }
      categoryTotals[category] += stats.percentage;
      categoryCounts[category] += 1;
    });
  });
  
  const categoryAverages = {};
  Object.keys(categoryTotals).forEach(category => {
    categoryAverages[category] = Math.round(categoryTotals[category] / categoryCounts[category]);
  });
  
  // Calculate streak information (consecutive tests above 80%)
  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;
  
  for (const test of history) {
    if (test.overallScore.percentage >= 80) {
      tempStreak++;
      if (currentStreak === 0) currentStreak = tempStreak; // Set current streak from most recent
    } else {
      if (currentStreak === 0) currentStreak = 0; // Reset if we haven't found the current streak yet
      tempStreak = 0;
    }
    bestStreak = Math.max(bestStreak, tempStreak);
  }
  
  return {
    totalTests,
    averageScore,
    bestScore,
    recentTrend,
    categoryAverages,
    streakInfo: { current: currentStreak, best: bestStreak }
  };
};

/**
 * Gets category performance trend over time
 * @param {string} category - Category to analyze
 * @param {number} limit - Number of recent tests to analyze (default: 10)
 * @returns {Object} - Trend information for the category
 */
export const getCategoryTrend = (category, limit = 10) => {
  const history = getTestHistory().slice(0, limit);
  
  const categoryScores = history
    .filter(test => test.categoryBreakdown[category])
    .map(test => ({
      date: test.date,
      percentage: test.categoryBreakdown[category].percentage,
      questionsCount: test.categoryBreakdown[category].questionsCount
    }))
    .reverse(); // Reverse to get chronological order
  
  if (categoryScores.length < 2) {
    return { trend: 'insufficient-data', scores: categoryScores };
  }
  
  // Simple trend calculation
  const first = categoryScores[0].percentage;
  const last = categoryScores[categoryScores.length - 1].percentage;
  const difference = last - first;
  
  let trend = 'stable';
  if (difference > 10) trend = 'improving';
  else if (difference < -10) trend = 'declining';
  
  return {
    trend,
    difference,
    scores: categoryScores,
    average: Math.round(categoryScores.reduce((sum, score) => sum + score.percentage, 0) / categoryScores.length)
  };
};

/**
 * Exports test history as JSON for backup/analysis
 * @returns {string} - JSON string of test history
 */
export const exportTestHistory = () => {
  const history = getTestHistory();
  return JSON.stringify(history, null, 2);
};

/**
 * Imports test history from JSON (merges with existing)
 * @param {string} jsonData - JSON string of test history to import
 * @returns {boolean} - Success status
 */
export const importTestHistory = (jsonData) => {
  try {
    const importedHistory = JSON.parse(jsonData);
    if (!Array.isArray(importedHistory)) {
      throw new Error('Invalid data format');
    }
    
    const existingHistory = getTestHistory();
    const mergedHistory = [...importedHistory, ...existingHistory];
    
    // Remove duplicates based on ID and timestamp
    const uniqueHistory = mergedHistory.filter((test, index, array) => 
      array.findIndex(t => t.id === test.id || t.timestamp === test.timestamp) === index
    );
    
    // Sort by timestamp (most recent first) and limit to 50
    uniqueHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const limitedHistory = uniqueHistory.slice(0, 50);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedHistory));
    return true;
  } catch (error) {
    console.error('Error importing test history:', error);
    return false;
  }
};