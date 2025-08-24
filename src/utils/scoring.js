/**
 * Utility functions for calculating SJT scores based on proximity to ideal rankings
 */

/**
 * Calculates the score for a single option based on distance from ideal ranking
 * @param {number} userRank - The rank the user assigned (1-5)
 * @param {number} idealRank - The correct rank for this option (1-5)
 * @returns {number} - Points earned (0-4)
 */
export const calculateOptionScore = (userRank, idealRank) => {
  const difference = Math.abs(userRank - idealRank);
  
  // Score based on difference from ideal ranking
  if (difference === 0) return 4; // Exact match
  if (difference === 1) return 3; // ±1 position
  if (difference === 2) return 2; // ±2 positions
  if (difference === 3) return 1; // ±3 positions
  return 0; // ±4 positions (maximum difference)
};

/**
 * Calculates detailed scores for all options in a question
 * @param {Array} userRankings - Array of {optionIndex, rank} objects
 * @param {Array} idealRanking - Array of ideal ranks [1,2,3,4,5]
 * @returns {Array} - Array of score objects with details
 */
export const calculateQuestionScores = (userRankings, idealRanking) => {
  return idealRanking.map((idealRank, optionIndex) => {
    const userRanking = userRankings.find(r => r.optionIndex === optionIndex);
    const userRank = userRanking ? userRanking.rank : 0;
    const difference = Math.abs(userRank - idealRank);
    const score = calculateOptionScore(userRank, idealRank);
    
    return {
      optionIndex,
      userRank,
      idealRank,
      score,
      difference,
      maxScore: 4
    };
  });
};

/**
 * Calculates the total score for a single question
 * @param {Array} questionScores - Result from calculateQuestionScores
 * @returns {Object} - Score summary for the question
 */
export const calculateQuestionTotal = (questionScores) => {
  const earned = questionScores.reduce((sum, option) => sum + option.score, 0);
  const possible = questionScores.length * 4; // 4 points max per option
  const percentage = Math.round((earned / possible) * 100);
  
  return {
    earned,
    possible,
    percentage
  };
};

/**
 * Calculates the overall test score across all questions
 * @param {Array} allQuestionScores - Array of question score arrays
 * @returns {Object} - Overall test score summary
 */
export const calculateTotalScore = (allQuestionScores) => {
  const totalPossiblePoints = allQuestionScores.length * 5 * 4; // questions × options × max points
  const earnedPoints = allQuestionScores.reduce((sum, questionScores) => {
    return sum + questionScores.reduce((qSum, option) => qSum + option.score, 0);
  }, 0);
  
  return {
    earned: earnedPoints,
    possible: totalPossiblePoints,
    percentage: Math.round((earnedPoints / totalPossiblePoints) * 100),
    questionsCount: allQuestionScores.length
  };
};

/**
 * Gets a color class name based on score performance
 * @param {number} score - The score achieved (0-4 for individual options)
 * @returns {string} - Tailwind CSS color class
 */
export const getScoreColor = (score) => {
  if (score === 4) return "text-green-600";
  if (score === 3) return "text-green-500";
  if (score === 2) return "text-yellow-500";
  if (score === 1) return "text-yellow-600";
  return "text-red-500";
};

/**
 * Gets a performance category based on percentage score
 * @param {number} percentage - Score percentage (0-100)
 * @returns {Object} - Performance category with color and label
 */
export const getPerformanceCategory = (percentage) => {
  if (percentage >= 90) {
    return { label: "Excellent", color: "text-green-600", bgColor: "bg-green-50" };
  }
  if (percentage >= 80) {
    return { label: "Good", color: "text-green-500", bgColor: "bg-green-50" };
  }
  if (percentage >= 70) {
    return { label: "Satisfactory", color: "text-yellow-500", bgColor: "bg-yellow-50" };
  }
  if (percentage >= 60) {
    return { label: "Needs Improvement", color: "text-yellow-600", bgColor: "bg-yellow-50" };
  }
  return { label: "Poor", color: "text-red-500", bgColor: "bg-red-50" };
};

/**
 * Validates that user rankings are complete and valid
 * @param {Array} userRankings - Array of {optionIndex, rank} objects
 * @param {number} expectedCount - Expected number of options (default: 5)
 * @returns {Object} - Validation result
 */
export const validateRankings = (userRankings, expectedCount = 5) => {
  const isComplete = userRankings.length === expectedCount;
  const ranks = userRankings.map(r => r.rank).sort((a, b) => a - b);
  const expectedRanks = Array.from({ length: expectedCount }, (_, i) => i + 1);
  const hasValidRanks = JSON.stringify(ranks) === JSON.stringify(expectedRanks);
  
  return {
    isValid: isComplete && hasValidRanks,
    isComplete,
    hasValidRanks,
    issues: {
      incomplete: !isComplete,
      duplicateRanks: !hasValidRanks && isComplete,
      invalidRankValues: userRankings.some(r => r.rank < 1 || r.rank > expectedCount)
    }
  };
};

/**
 * Constants for scoring system
 */
export const SCORING_CONFIG = {
  MAX_POINTS_PER_OPTION: 4,
  OPTIONS_PER_QUESTION: 5,
  MAX_POINTS_PER_QUESTION: 20, // 5 options × 4 points
  POINT_VALUES: {
    EXACT_MATCH: 4,
    ONE_OFF: 3,
    TWO_OFF: 2,
    THREE_OFF: 1,
    FOUR_OFF: 0
  },
  PERFORMANCE_THRESHOLDS: {
    EXCELLENT: 90,
    GOOD: 80,
    SATISFACTORY: 70,
    NEEDS_IMPROVEMENT: 60
  }
};