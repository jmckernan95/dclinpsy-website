/**
 * Utility functions for randomizing question display order while maintaining
 * correct mapping between options, rankings, and explanations.
 */

/**
 * Creates a shuffled array of indices for randomizing option display order
 * @param {number} length - The number of options (should be 5)
 * @returns {number[]} - Shuffled array of indices [0,1,2,3,4] in random order
 */
export const createShuffledIndices = (length = 5) => {
  const indices = Array.from({ length }, (_, i) => i);
  
  // Fisher-Yates shuffle algorithm for proper randomization
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  
  return indices;
};

/**
 * Creates a randomized version of a question with shuffled display order
 * @param {Object} question - The original question object
 * @returns {Object} - Question object with shuffled display order and mapping
 */
export const randomizeQuestion = (question) => {
  const shuffledIndices = createShuffledIndices(question.options.length);
  
  return {
    ...question,
    // Store the original question data unchanged
    originalOptions: question.options,
    originalRanking: question.idealRanking,
    originalExplanations: question.explanations,
    
    // Create shuffled versions for display
    options: shuffledIndices.map(i => question.options[i]),
    idealRanking: shuffledIndices.map(i => question.idealRanking[i]),
    explanations: shuffledIndices.map(i => question.explanations[i]),
    
    // Store the mapping for converting user selections back to original indices
    shuffleMap: shuffledIndices,
    
    // Reverse mapping: given a display position, what was the original index?
    displayToOriginal: shuffledIndices,
    
    // Forward mapping: given an original index, what's the display position?
    originalToDisplay: shuffledIndices.reduce((map, originalIndex, displayIndex) => {
      map[originalIndex] = displayIndex;
      return map;
    }, {})
  };
};

/**
 * Converts a user ranking from display positions back to original question indices
 * @param {Array} userRankings - Array of {optionIndex, rank} based on display order
 * @param {number[]} shuffleMap - The shuffle mapping from randomizeQuestion
 * @returns {Array} - Rankings converted to original question indices
 */
export const convertDisplayRankingsToOriginal = (userRankings, shuffleMap) => {
  return userRankings.map(ranking => ({
    ...ranking,
    // Convert display position back to original index
    optionIndex: shuffleMap[ranking.optionIndex]
  }));
};

/**
 * Converts user rankings from original indices to display positions
 * @param {Array} userRankings - Array of {optionIndex, rank} based on original indices
 * @param {Object} originalToDisplay - Mapping from original to display positions
 * @returns {Array} - Rankings converted to display positions
 */
export const convertOriginalRankingsToDisplay = (userRankings, originalToDisplay) => {
  return userRankings.map(ranking => ({
    ...ranking,
    // Convert original index to display position
    optionIndex: originalToDisplay[ranking.optionIndex]
  }));
};

/**
 * Generates a batch of randomized questions for a test session with category mixing
 * @param {Array} questions - Array of question objects
 * @param {number} count - Number of questions to select (default: 10)
 * @param {boolean} useCategoryMixing - Whether to use category mixing (default: true)
 * @returns {Array} - Array of randomized questions
 */
export const generateRandomizedTest = (questions, count = 10, useCategoryMixing = true) => {
  let selectedQuestions = [];

  if (useCategoryMixing) {
    // Use category mixing to ensure diverse selection
    selectedQuestions = generateCategoryMixedSelection(questions, count);
  } else {
    // Original random selection method
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    selectedQuestions = shuffled.slice(0, Math.min(count, questions.length));
  }
  
  // Then randomize the display order for each selected question
  return selectedQuestions.map(question => randomizeQuestion(question));
};

/**
 * Implements category mixing to ensure diverse question selection
 * @param {Array} questions - Array of all available questions
 * @param {number} testSize - Number of questions needed for the test
 * @returns {Array} - Array of selected questions with category diversity
 */
const generateCategoryMixedSelection = (questions, testSize = 10) => {
  if (questions.length === 0) {
    return [];
  }

  // Group questions by category
  const questionsByCategory = {};
  const availableCategories = [];
  
  questions.forEach(question => {
    const category = question.category || 'Uncategorized';
    if (!questionsByCategory[category]) {
      questionsByCategory[category] = [];
      availableCategories.push(category);
    }
    questionsByCategory[category].push(question);
  });

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

  // Calculate questions per category - try to distribute evenly
  const questionsPerCategory = Math.floor(testSize / availableCategories.length);
  const remainder = testSize % availableCategories.length;

  // Shuffle categories to randomize which get the extra questions
  const shuffledCategories = [...availableCategories].sort(() => 0.5 - Math.random());
  
  // First pass: try to get questions from each category
  for (let i = 0; i < shuffledCategories.length && selectedQuestions.length < testSize; i++) {
    const category = shuffledCategories[i];
    const categoryQuestions = [...questionsByCategory[category]].sort(() => 0.5 - Math.random());
    
    // Determine how many questions to take from this category
    let questionsToTake = questionsPerCategory;
    if (i < remainder) {
      questionsToTake += 1; // Give remainder to first few categories
    }
    
    // Don't take more than available or more than we need
    questionsToTake = Math.min(questionsToTake, categoryQuestions.length, testSize - selectedQuestions.length);
    
    for (let j = 0; j < questionsToTake; j++) {
      selectedQuestions.push(categoryQuestions[j]);
      categoryCounts[category]++;
    }
  }

  // Second pass: if we still need questions, fill from any available
  while (selectedQuestions.length < testSize) {
    const remainingQuestions = questions.filter(q => 
      !selectedQuestions.some(selected => 
        selected.id === q.id || 
        (selected.scenario === q.scenario && selected.category === q.category)
      )
    );
    
    if (remainingQuestions.length === 0) break;
    
    // Prefer categories with fewer questions selected for better balance
    const sortedRemaining = remainingQuestions.sort((a, b) => {
      const aCategoryCount = categoryCounts[a.category || 'Uncategorized'] || 0;
      const bCategoryCount = categoryCounts[b.category || 'Uncategorized'] || 0;
      
      if (aCategoryCount !== bCategoryCount) {
        return aCategoryCount - bCategoryCount; // Prefer categories with fewer questions
      }
      return 0.5 - Math.random(); // Random if equal
    });

    const questionToAdd = sortedRemaining[0];
    selectedQuestions.push(questionToAdd);
    const category = questionToAdd.category || 'Uncategorized';
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  }

  // Final shuffle to randomize the order of questions in the test
  return selectedQuestions.sort(() => 0.5 - Math.random());
};