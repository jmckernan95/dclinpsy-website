/**
 * Utility functions for implementing category mixing in test generation
 */

/**
 * Gets all unique categories from the question bank
 * @param {Array} questions - Array of question objects
 * @returns {Array} - Array of unique category strings
 */
export const getAvailableCategories = (questions) => {
  const categories = questions.map(q => q.category).filter(Boolean);
  return [...new Set(categories)];
};

/**
 * Groups questions by category
 * @param {Array} questions - Array of question objects
 * @returns {Object} - Object with category names as keys and arrays of questions as values
 */
export const groupQuestionsByCategory = (questions) => {
  return questions.reduce((groups, question) => {
    const category = question.category;
    if (category) {
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(question);
    }
    return groups;
  }, {});
};

/**
 * Generates a mixed test with questions from multiple categories
 * @param {Array} questions - Array of all available questions
 * @param {number} testSize - Number of questions needed for the test (default: 10)
 * @returns {Array} - Array of selected questions with category diversity
 */
export const generateCategoryMixedTest = (questions, testSize = 10) => {
  if (questions.length === 0) {
    return [];
  }

  const questionsByCategory = groupQuestionsByCategory(questions);
  const availableCategories = Object.keys(questionsByCategory);
  
  if (availableCategories.length === 0) {
    // Fallback: if no categories, use original random selection
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(testSize, questions.length));
  }

  const selectedQuestions = [];
  const categoryCounts = {};
  
  // Initialize category counts
  availableCategories.forEach(category => {
    categoryCounts[category] = 0;
  });

  // Calculate ideal questions per category
  const questionsPerCategory = Math.floor(testSize / availableCategories.length);
  const remainder = testSize % availableCategories.length;

  // First, try to get at least one question from each category
  const shuffledCategories = [...availableCategories].sort(() => 0.5 - Math.random());
  
  for (const category of shuffledCategories) {
    const categoryQuestions = [...questionsByCategory[category]].sort(() => 0.5 - Math.random());
    const questionsToTake = Math.min(
      questionsPerCategory + (remainder > shuffledCategories.indexOf(category) ? 1 : 0),
      categoryQuestions.length
    );
    
    for (let i = 0; i < questionsToTake && selectedQuestions.length < testSize; i++) {
      selectedQuestions.push(categoryQuestions[i]);
      categoryCounts[category]++;
    }
  }

  // If we still need more questions, fill from available questions
  while (selectedQuestions.length < testSize && selectedQuestions.length < questions.length) {
    const remainingQuestions = questions.filter(q => 
      !selectedQuestions.some(selected => selected.id === q.id || 
        (selected.scenario === q.scenario && selected.category === q.category))
    );
    
    if (remainingQuestions.length === 0) break;
    
    // Prefer categories with fewer questions selected
    const sortedRemaining = remainingQuestions.sort((a, b) => {
      const aCategoryCount = categoryCounts[a.category] || 0;
      const bCategoryCount = categoryCounts[b.category] || 0;
      if (aCategoryCount !== bCategoryCount) {
        return aCategoryCount - bCategoryCount;
      }
      return 0.5 - Math.random(); // Random if equal
    });

    const questionToAdd = sortedRemaining[0];
    selectedQuestions.push(questionToAdd);
    if (questionToAdd.category) {
      categoryCounts[questionToAdd.category]++;
    }
  }

  // Final shuffle to randomize question order
  return selectedQuestions.sort(() => 0.5 - Math.random());
};

/**
 * Gets category distribution statistics for a set of questions
 * @param {Array} questions - Array of question objects
 * @returns {Object} - Statistics about category distribution
 */
export const getCategoryDistribution = (questions) => {
  const distribution = {};
  const total = questions.length;
  
  questions.forEach(question => {
    const category = question.category || 'Uncategorized';
    if (!distribution[category]) {
      distribution[category] = { count: 0, percentage: 0 };
    }
    distribution[category].count++;
  });

  // Calculate percentages
  Object.keys(distribution).forEach(category => {
    distribution[category].percentage = Math.round((distribution[category].count / total) * 100);
  });

  return {
    distribution,
    totalQuestions: total,
    categoriesCount: Object.keys(distribution).length
  };
};