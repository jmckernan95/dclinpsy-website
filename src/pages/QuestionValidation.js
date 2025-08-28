/**
 * Question Validation Review Page
 * Allows manual review of AI-validated SJT questions
 * Shows flagged questions and validation results
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const QuestionValidation = () => {
  const [validationData, setValidationData] = useState(null);
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadValidationData();
  }, []);

  const loadValidationData = async () => {
    try {
      setLoading(true);
      
      // Try to load validation report
      const reportResponse = await fetch('/validation-report.json');
      if (reportResponse.ok) {
        const report = await reportResponse.json();
        setValidationData(report);
        setFlaggedQuestions(report.flaggedQuestions || []);
      } else {
        throw new Error('Validation report not found');
      }
      
    } catch (err) {
      setError('No validation data found. Please run the question processing pipeline first.');
      console.error('Error loading validation data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (score) => {
    if (score >= 90) return 'text-success-600 bg-success-50';
    if (score >= 70) return 'text-warning-600 bg-warning-50';
    return 'text-error-600 bg-error-50';
  };

  const getSeverityColor = (issues) => {
    if (!issues || issues.length === 0) return 'text-neutral-500';
    if (issues.length >= 3) return 'text-error-600';
    if (issues.length >= 2) return 'text-warning-600';
    return 'text-warning-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading validation data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="container mx-auto py-12">
          <div className="card max-w-2xl mx-auto">
            <div className="card-body text-center">
              <h1 className="h2 text-error-600 mb-4">❌ Validation Data Not Found</h1>
              <p className="body-lg text-neutral-600 mb-6">{error}</p>
              <div className="space-y-4">
                <p className="body-sm text-neutral-500">To use this validation tool:</p>
                <ol className="text-left list-decimal list-inside space-y-2 text-sm text-neutral-600">
                  <li>Set your Gemini API key in the .env file</li>
                  <li>Add DClinPsy materials to the materials folder</li>
                  <li>Run: <code className="bg-neutral-100 px-2 py-1 rounded">npm run process-questions</code></li>
                  <li>Return here to review flagged questions</li>
                </ol>
                <Link to="/" className="btn btn-primary mt-6">
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <section className="bg-gradient-hero py-12">
        <div className="container mx-auto text-center">
          <h1 className="h1 mb-4">Question Validation Review</h1>
          <p className="body-lg text-neutral-600 max-w-3xl mx-auto">
            Review AI-validated SJT questions against BPS/HCPC guidelines. 
            Focus on flagged questions that require manual review.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-12">
        {/* Summary Dashboard */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="card">
            <div className="card-body text-center">
              <div className="text-2xl font-bold text-primary-600 mb-2">
                {validationData?.summary?.totalQuestions || 0}
              </div>
              <div className="text-sm text-neutral-600">Total Questions</div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body text-center">
              <div className="text-2xl font-bold text-success-600 mb-2">
                {validationData?.summary?.validQuestions || 0}
              </div>
              <div className="text-sm text-neutral-600">Valid Questions</div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body text-center">
              <div className="text-2xl font-bold text-warning-600 mb-2">
                {validationData?.summary?.flaggedQuestions || 0}
              </div>
              <div className="text-sm text-neutral-600">Flagged for Review</div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body text-center">
              <div className={`text-2xl font-bold mb-2 ${getConfidenceColor(validationData?.summary?.averageConfidence || 0)}`}>
                {validationData?.summary?.averageConfidence || 0}%
              </div>
              <div className="text-sm text-neutral-600">Avg Confidence</div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        {validationData?.categoryBreakdown && (
          <div className="card mb-12">
            <div className="card-body">
              <h2 className="h3 mb-6">Category Distribution</h2>
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(validationData.categoryBreakdown).map(([category, count]) => (
                  <div key={category} className="bg-neutral-50 rounded-lg p-4">
                    <div className="font-semibold text-neutral-800">{category}</div>
                    <div className="text-2xl font-bold text-primary-600">{count}</div>
                    <div className="text-sm text-neutral-500">questions</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Flagged Questions */}
        <div className="card">
          <div className="card-body">
            <h2 className="h2 mb-6">
              Flagged Questions ({flaggedQuestions.length})
              {flaggedQuestions.length === 0 && (
                <span className="text-success-600 ml-2">🎉 All Clear!</span>
              )}
            </h2>

            {flaggedQuestions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="h3 text-success-600 mb-4">No Issues Found!</h3>
                <p className="body-lg text-neutral-600 mb-6">
                  All questions passed validation against BPS/HCPC guidelines with high confidence scores.
                </p>
                <Link to="/sjt" className="btn btn-primary">
                  Try SJT Practice Test
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {flaggedQuestions.map((question, index) => (
                  <div 
                    key={question.id || index} 
                    className={`border rounded-lg p-6 cursor-pointer transition-all hover:border-primary-300 ${
                      selectedQuestion === question.id ? 'border-primary-500 bg-primary-50' : 'border-neutral-200'
                    }`}
                    onClick={() => setSelectedQuestion(selectedQuestion === question.id ? null : question.id)}
                  >
                    {/* Question Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="h4 mb-2">Question {question.id}</h3>
                        <div className="flex items-center space-x-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            {question.category}
                          </span>
                          {question.confidenceScore && (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConfidenceColor(question.confidenceScore)}`}>
                              {question.confidenceScore}% confidence
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${getSeverityColor(question.issues)}`}>
                          {question.issues?.length || 0} issue{question.issues?.length !== 1 ? 's' : ''}
                        </span>
                        <svg 
                          className={`w-5 h-5 text-neutral-400 transform transition-transform ${
                            selectedQuestion === question.id ? 'rotate-180' : ''
                          }`}
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {/* Issues Summary */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-error-700 mb-2">Issues Identified:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-error-600">
                        {question.issues?.map((issue, i) => (
                          <li key={i}>{issue}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Expanded Details */}
                    {selectedQuestion === question.id && (
                      <div className="border-t pt-6 mt-6">
                        {/* Recommendations */}
                        {question.recommendations && question.recommendations.length > 0 && (
                          <div className="mb-6">
                            <h4 className="font-semibold text-warning-700 mb-3">Recommendations:</h4>
                            <ul className="list-disc list-inside space-y-2 text-sm text-warning-600">
                              {question.recommendations.map((rec, i) => (
                                <li key={i}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex space-x-4 pt-4">
                          <button className="btn btn-sm btn-outline">
                            Mark as Reviewed
                          </button>
                          <button className="btn btn-sm btn-primary">
                            Edit Question
                          </button>
                          <button className="btn btn-sm btn-outline text-error-600 border-error-300 hover:bg-error-50">
                            Remove Question
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions Panel */}
        <div className="card mt-8">
          <div className="card-body">
            <h3 className="h3 mb-4">Next Steps</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">If All Questions Look Good:</h4>
                <div className="space-y-3">
                  <button className="btn btn-success w-full">
                    Integrate Questions into App
                  </button>
                  <p className="text-sm text-neutral-600">
                    This will replace the current questions with the validated ones.
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Need More Review:</h4>
                <div className="space-y-3">
                  <button className="btn btn-outline w-full">
                    Export for Manual Review
                  </button>
                  <button className="btn btn-outline w-full">
                    Re-run Validation
                  </button>
                  <p className="text-sm text-neutral-600">
                    Export flagged questions for expert clinical psychologist review.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Validation Metadata */}
        {validationData?.generatedAt && (
          <div className="mt-8 p-4 bg-neutral-100 rounded-lg text-sm text-neutral-600">
            <strong>Validation Report Generated:</strong> {new Date(validationData.generatedAt).toLocaleString()}
            <br />
            <strong>Guidelines Used:</strong> {validationData.guidelinesUsed?.join(', ') || 'BPS/HCPC Standards'}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionValidation;