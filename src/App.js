import React, { useState, useEffect } from 'react';
import questionsData from './questions'; // Import the questions data

// Constants for categories
const CATEGORIES = {
  BOUNDARIES: 'Professional Boundaries',
  RISK: 'Risk Management',
  ETHICS: 'Ethical Dilemmas',
  DIVERSITY: 'Diversity & Inclusion',
  CLINICAL: 'Clinical Decision-Making'
};

const DClinPsySJTApp = () => {
  // State management
  const [allQuestions, setAllQuestions] = useState([]);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userRankings, setUserRankings] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [questionScores, setQuestionScores] = useState([]);
  const [testCompleted, setTestCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize the app with questions and generate a new test
  useEffect(() => {
    // Load questions from imported data
    setAllQuestions(questionsData);
  }, []);

  // Generate new test when questions are loaded
  useEffect(() => {
    if (allQuestions.length > 0) {
      generateNewTest();
      setIsLoading(false);
    }
  }, [allQuestions]);

  // Function to generate a new test with 10 random questions
  const generateNewTest = () => {
    // Randomly select 10 questions from the question bank
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(10, allQuestions.length));
    
    setCurrentQuestions(selected);
    setCurrentQuestionIndex(0);
    setUserRankings([]);
    setQuestionScores([]);
    setIsSubmitted(false);
    setTestCompleted(false);
  };

  // Function to retry the current test
  const retryCurrentTest = () => {
    setCurrentQuestionIndex(0);
    setUserRankings([]);
    setQuestionScores([]);
    setIsSubmitted(false);
    setTestCompleted(false);
  };

  // Function to handle option selection/ranking
  const handleOptionClick = (optionIndex) => {
    if (isSubmitted) return;
    
    // Create a copy of the current rankings
    const updatedRankings = [...userRankings];
    
    // Check if the option is already ranked
    const existingRankIndex = updatedRankings.findIndex(item => item.optionIndex === optionIndex);
    
    if (existingRankIndex !== -1) {
      // Option is already ranked, so remove it
      updatedRankings.splice(existingRankIndex, 1);
      
      // Reorder the remaining rankings
      updatedRankings.forEach(item => {
        if (item.rank > existingRankIndex + 1) {
          item.rank -= 1;
        }
      });
    } else {
      // Option is not ranked, so add it with the next available rank
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
    const idealRanking = currentQuestion.idealRanking;
    
    // Calculate score for this question
    const scores = currentQuestion.options.map((_, index) => {
      const userRank = userRankings.find(r => r.optionIndex === index)?.rank || 0;
      const idealRank = idealRanking[index];
      const difference = Math.abs(userRank - idealRank);
      
      // Score based on difference from ideal ranking
      let score = 0;
      if (difference === 0) score = 4;
      else if (difference === 1) score = 3;
      else if (difference === 2) score = 2;
      else if (difference === 3) score = 1;
      // difference of 4 gets 0 points
      
      return {
        optionIndex: index,
        userRank,
        idealRank,
        score,
        difference
      };
    });
    
    // Update question scores
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
    }
  };

  // Function to calculate total score
  const calculateTotalScore = () => {
    const totalPossiblePoints = questionScores.length * 5 * 4; // 5 options per question, max 4 points each
    const earnedPoints = questionScores.reduce((sum, questionScore) => {
      return sum + questionScore.reduce((qSum, option) => qSum + option.score, 0);
    }, 0);
    
    return {
      earned: earnedPoints,
      possible: totalPossiblePoints,
      percentage: Math.round((earnedPoints / totalPossiblePoints) * 100)
    };
  };

  // Function to check for explanation mismatches
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

  // Helper function to get rank label
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

  // Function to get color based on score
  const getScoreColor = (score) => {
    if (score === 4) return "text-green-600";
    if (score === 3) return "text-green-500";
    if (score === 2) return "text-yellow-500";
    if (score === 1) return "text-yellow-600";
    return "text-red-500";
  };

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
          DClinPsy Situational Judgment Test Practice
        </h1>
        <div className="text-center p-8">
          <p className="mb-4">Loading questions...</p>
        </div>
      </div>
    );
  }

  // If the test is completed, show results summary
  if (testCompleted) {
    const totalScore = calculateTotalScore();
    
    return (
      <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Test Results
        </h1>
        
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
        
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Question Breakdown</h2>
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
        
        <div className="flex justify-center space-x-4">
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
        </div>
      </div>
    );
  }

  // Main question display
  const currentQuestion = currentQuestions[currentQuestionIndex];
  
  // If no questions are available
  if (!currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
          DClinPsy Situational Judgment Test Practice
        </h1>
        <div className="text-center p-8">
          <p className="mb-4">No questions available.</p>
          <p>Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
        DClinPsy Situational Judgment Test Practice
      </h1>
      
      {/* Question Header */}
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
      
      {/* Ranking Area */}
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
      
      {/* Feedback Area */}
      {isSubmitted && (
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-4">Feedback</h3>
          
          <div className="space-y-6">
            {currentQuestion.options.map((option, index) => {
              const result = questionScores[currentQuestionIndex].find(r => r.optionIndex === index);
              const userRank = result?.userRank || 0;
              const idealRank = result?.idealRank || 0;
              const score = result?.score || 0;
              const explanation = currentQuestion.explanations[index];
              const mismatchWarning = checkExplanationMismatch(explanation, idealRank);
              
              return (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{getRankLabel(idealRank)}</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Your ranking: {userRank || 'Not ranked'} | Ideal ranking: {idealRank}
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
      
      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-200 text-sm text-gray-600">
        <p>DClinPsy Situational Judgment Test Practice App</p>
        <p className="mt-1">
          Question bank: {allQuestions.length} scenarios across {Object.values(CATEGORIES).map(cat => cat).join(', ')}
        </p>
      </div>
    </div>
  );
};

function App() {
  return <DClinPsySJTApp />;
}
<div className="text-blue-500 font-bold p-4 bg-yellow-100 m-4 rounded-lg">
  If this text is blue, bold, with yellow background and rounded corners, Tailwind is working!
</div>
export default App;