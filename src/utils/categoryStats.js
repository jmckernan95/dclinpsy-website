/**
 * Utility functions for calculating category-based performance statistics
 */

/**
 * Calculates performance statistics by category for a completed test
 * @param {Array} questions - Array of question objects from the test
 * @param {Array} questionScores - Array of score arrays for each question
 * @returns {Object} - Category performance statistics
 */
export const calculateCategoryPerformance = (questions, questionScores) => {
  if (!questions || !questionScores || questions.length !== questionScores.length) {
    return { categoryStats: {}, overallStats: null };
  }

  const categoryStats = {};
  let totalEarned = 0;
  let totalPossible = 0;

  // Process each question and its scores
  questions.forEach((question, questionIndex) => {
    const category = question.category || 'Uncategorized';
    const scores = questionScores[questionIndex] || [];
    
    // Calculate question totals
    const questionEarned = scores.reduce((sum, scoreObj) => sum + (scoreObj.score || 0), 0);
    const questionPossible = scores.length * 4; // 4 points max per option
    
    // Initialize category if not exists
    if (!categoryStats[category]) {
      categoryStats[category] = {
        category: category,
        questionsCount: 0,
        totalEarned: 0,
        totalPossible: 0,
        percentage: 0,
        questions: []
      };
    }
    
    // Add to category totals
    categoryStats[category].questionsCount++;
    categoryStats[category].totalEarned += questionEarned;
    categoryStats[category].totalPossible += questionPossible;
    categoryStats[category].questions.push({
      questionIndex,
      scenario: question.scenario.substring(0, 100) + '...', // Truncated for display
      earned: questionEarned,
      possible: questionPossible,
      percentage: Math.round((questionEarned / questionPossible) * 100)
    });
    
    // Add to overall totals
    totalEarned += questionEarned;
    totalPossible += questionPossible;
  });

  // Calculate percentages for each category
  Object.keys(categoryStats).forEach(category => {
    const stats = categoryStats[category];
    stats.percentage = Math.round((stats.totalEarned / stats.totalPossible) * 100);
    stats.averagePerQuestion = Math.round((stats.totalEarned / stats.questionsCount) * 100) / 100;
  });

  // Sort categories by performance (descending)
  const sortedCategories = Object.values(categoryStats).sort((a, b) => b.percentage - a.percentage);

  const overallStats = {
    totalEarned,
    totalPossible,
    percentage: Math.round((totalEarned / totalPossible) * 100),
    categoriesCount: Object.keys(categoryStats).length
  };

  return {
    categoryStats,
    sortedCategories,
    overallStats
  };
};

/**
 * Gets performance level description based on percentage
 * @param {number} percentage - Score percentage (0-100)
 * @returns {Object} - Performance level with label and color
 */
export const getPerformanceLevel = (percentage) => {
  if (percentage >= 90) {
    return { 
      label: "Excellent", 
      color: "text-green-600", 
      bgColor: "bg-green-50",
      description: "Outstanding understanding of this clinical domain" 
    };
  }
  if (percentage >= 80) {
    return { 
      label: "Good", 
      color: "text-green-500", 
      bgColor: "bg-green-50",
      description: "Strong grasp of clinical principles in this area" 
    };
  }
  if (percentage >= 70) {
    return { 
      label: "Satisfactory", 
      color: "text-yellow-500", 
      bgColor: "bg-yellow-50",
      description: "Adequate understanding with room for improvement" 
    };
  }
  if (percentage >= 60) {
    return { 
      label: "Needs Development", 
      color: "text-orange-500", 
      bgColor: "bg-orange-50",
      description: "Further study and practice recommended" 
    };
  }
  return { 
    label: "Requires Focus", 
    color: "text-red-500", 
    bgColor: "bg-red-50",
    description: "Significant development needed in this area" 
  };
};

/**
 * Identifies strongest and weakest categories
 * @param {Array} sortedCategories - Categories sorted by performance
 * @returns {Object} - Strongest and weakest category information
 */
export const getPerformanceHighlights = (sortedCategories) => {
  if (sortedCategories.length === 0) {
    return { strongest: null, weakest: null };
  }

  const strongest = sortedCategories[0];
  const weakest = sortedCategories[sortedCategories.length - 1];

  return {
    strongest: strongest.percentage > 0 ? {
      category: strongest.category,
      percentage: strongest.percentage,
      questionsCount: strongest.questionsCount
    } : null,
    weakest: weakest.percentage < 100 && sortedCategories.length > 1 ? {
      category: weakest.category,
      percentage: weakest.percentage,
      questionsCount: weakest.questionsCount
    } : null
  };
};

/**
 * Generates study recommendations based on category performance
 * @param {Array} sortedCategories - Categories sorted by performance
 * @returns {Array} - Array of recommendation objects
 */
export const generateStudyRecommendations = (sortedCategories) => {
  const recommendations = [];
  
  // Find categories that need improvement (below 75%)
  const needsImprovement = sortedCategories.filter(cat => cat.percentage < 75);
  
  if (needsImprovement.length > 0) {
    const weakest = needsImprovement[needsImprovement.length - 1];
    recommendations.push({
      type: 'priority',
      title: `Focus on ${weakest.category}`,
      description: `Your score of ${weakest.percentage}% suggests this area needs attention. Review BPS and HCPC guidelines related to ${weakest.category.toLowerCase()}.`,
      category: weakest.category
    });
  }
  
  // Find strongest area for positive reinforcement
  const strongest = sortedCategories[0];
  if (strongest && strongest.percentage >= 85) {
    recommendations.push({
      type: 'strength',
      title: `Maintain ${strongest.category} Excellence`,
      description: `Your ${strongest.percentage}% score shows strong competence. Continue applying these principles consistently.`,
      category: strongest.category
    });
  }
  
  // General recommendations based on overall performance
  const averagePerformance = sortedCategories.reduce((sum, cat) => sum + cat.percentage, 0) / sortedCategories.length;
  
  if (averagePerformance < 70) {
    recommendations.push({
      type: 'general',
      title: 'Review Core Ethical Principles',
      description: 'Consider revisiting fundamental BPS Code of Ethics and HCPC Standards to strengthen your foundation.',
      category: null
    });
  }
  
  return recommendations;
};