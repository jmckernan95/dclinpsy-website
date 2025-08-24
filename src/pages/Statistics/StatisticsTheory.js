/**
 * Statistics Theory Page
 * Educational interface for learning statistics concepts
 */

import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { statisticsTopics } from '../../data/statistics-topics';
import TopicCard from '../../components/Statistics/TopicCard';
import TopicViewer from '../../components/Statistics/TopicViewer';

const StatisticsTheory = () => {
  const { topicSlug } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [completedTopics, setCompletedTopics] = useState(new Set());
  const [bookmarkedTopics, setBookmarkedTopics] = useState(new Set());

  // Load progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('statistics-theory-progress');
      if (saved) {
        const progress = JSON.parse(saved);
        setCompletedTopics(new Set(progress.completed || []));
        setBookmarkedTopics(new Set(progress.bookmarked || []));
      }
    } catch (error) {
      console.error('Error loading statistics progress:', error);
    }
  }, []);

  // Handle topic selection from URL
  useEffect(() => {
    if (topicSlug) {
      const topic = statisticsTopics.find(t => t.slug === topicSlug);
      if (topic) {
        setSelectedTopic(topic);
      } else {
        navigate('/statistics/theory');
      }
    } else {
      setSelectedTopic(null);
    }
  }, [topicSlug, navigate]);

  // Save progress to localStorage
  const saveProgress = (completed, bookmarked) => {
    try {
      const progress = {
        completed: Array.from(completed),
        bookmarked: Array.from(bookmarked),
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('statistics-theory-progress', JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving statistics progress:', error);
    }
  };

  const handleTopicComplete = (topicId) => {
    const newCompleted = new Set(completedTopics);
    newCompleted.add(topicId);
    setCompletedTopics(newCompleted);
    saveProgress(newCompleted, bookmarkedTopics);
  };

  const handleTopicBookmark = (topicId) => {
    const newBookmarked = new Set(bookmarkedTopics);
    if (newBookmarked.has(topicId)) {
      newBookmarked.delete(topicId);
    } else {
      newBookmarked.add(topicId);
    }
    setBookmarkedTopics(newBookmarked);
    saveProgress(completedTopics, newBookmarked);
  };

  const getProgressStats = () => {
    const total = statisticsTopics.length;
    const completed = completedTopics.size;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  };

  if (selectedTopic) {
    return (
      <TopicViewer
        topic={selectedTopic}
        isCompleted={completedTopics.has(selectedTopic.id)}
        isBookmarked={bookmarkedTopics.has(selectedTopic.id)}
        onComplete={() => handleTopicComplete(selectedTopic.id)}
        onBookmark={() => handleTopicBookmark(selectedTopic.id)}
        onBack={() => navigate('/statistics/theory')}
      />
    );
  }

  const { total, completed, percentage } = getProgressStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <span>→</span>
            <Link to="/statistics" className="hover:text-blue-600">Statistics</Link>
            <span>→</span>
            <span className="text-gray-800">Theory</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Statistics Theory
              </h1>
              <p className="text-lg text-gray-600">
                Master statistical concepts essential for psychological research
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <Link
                to="/statistics/test"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <span className="mr-2">🧪</span>
                Take Practice Test
              </Link>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        {isLoggedIn && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Your Progress</h2>
              <span className="text-sm text-gray-500">{completed}/{total} topics completed</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{percentage}%</div>
                <div className="text-sm text-gray-500">Complete</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{completed}</div>
                <div className="text-sm text-gray-500">Finished</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{bookmarkedTopics.size}</div>
                <div className="text-sm text-gray-500">Bookmarked</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">{total - completed}</div>
                <div className="text-sm text-gray-500">Remaining</div>
              </div>
            </div>
          </div>
        )}

        {/* Topics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statisticsTopics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              isCompleted={completedTopics.has(topic.id)}
              isBookmarked={bookmarkedTopics.has(topic.id)}
              onBookmark={() => handleTopicBookmark(topic.id)}
            />
          ))}
        </div>

        {/* Study Tips */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📚 Study Tips</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="text-blue-600">💡</div>
                <div>
                  <h4 className="font-medium text-gray-800">Start with Basics</h4>
                  <p className="text-sm text-gray-600">Master descriptive statistics before moving to inferential methods</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-blue-600">🔢</div>
                <div>
                  <h4 className="font-medium text-gray-800">Practice with Real Data</h4>
                  <p className="text-sm text-gray-600">Apply concepts to psychology research examples</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="text-blue-600">📖</div>
                <div>
                  <h4 className="font-medium text-gray-800">Understand Assumptions</h4>
                  <p className="text-sm text-gray-600">Learn when and why to use different statistical tests</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-blue-600">🎯</div>
                <div>
                  <h4 className="font-medium text-gray-800">Focus on Interpretation</h4>
                  <p className="text-sm text-gray-600">Understand what results mean in practical terms</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              to="/statistics/test"
              className="flex items-center justify-center p-4 border-2 border-green-200 rounded-lg hover:border-green-400 transition"
            >
              <div className="text-center">
                <div className="text-2xl mb-2">🧪</div>
                <div className="font-medium text-gray-800">Practice Test</div>
                <div className="text-sm text-gray-500">Test your knowledge</div>
              </div>
            </Link>
            
            {bookmarkedTopics.size > 0 && (
              <button
                onClick={() => {
                  const firstBookmarked = Array.from(bookmarkedTopics)[0];
                  const topic = statisticsTopics.find(t => t.id === firstBookmarked);
                  if (topic) navigate(`/statistics/theory/${topic.slug}`);
                }}
                className="flex items-center justify-center p-4 border-2 border-orange-200 rounded-lg hover:border-orange-400 transition"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🔖</div>
                  <div className="font-medium text-gray-800">Bookmarked</div>
                  <div className="text-sm text-gray-500">Continue reading</div>
                </div>
              </button>
            )}
            
            <Link
              to="/practice"
              className="flex items-center justify-center p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 transition"
            >
              <div className="text-center">
                <div className="text-2xl mb-2">🎯</div>
                <div className="font-medium text-gray-800">SJT Practice</div>
                <div className="text-sm text-gray-500">Clinical scenarios</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsTheory;