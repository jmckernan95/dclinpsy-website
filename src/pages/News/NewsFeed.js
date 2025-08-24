/**
 * News Feed Page
 * Psychology news aggregator with RSS feed integration and fallbacks
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { newsSources, newsCategories, fallbackNews, getActiveNewsSources, getNewsByCategory, sortNewsByDate } from '../../data/news-sources';
import { fetchRSSFeed, clearRSSCache, getCacheStatus } from '../../utils/rss-parser';
import NewsCard from '../../components/News/NewsCard';
import SourceFilter from '../../components/News/SourceFilter';
import RefreshButton from '../../components/News/RefreshButton';

const NewsFeed = () => {
  const { isLoggedIn } = useAuth();
  
  // State management
  const [allArticles, setAllArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedSources, setSelectedSources] = useState(new Set()); // Empty = all sources
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);
  const [cacheStatus, setCacheStatus] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  // Load initial news data
  useEffect(() => {
    loadNews();
  }, []);

  // Apply filters when articles or filters change
  useEffect(() => {
    applyFilters();
  }, [allArticles, selectedCategory, selectedSources]);

  /**
   * Load news from all sources
   */
  const loadNews = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);
    setRefreshing(forceRefresh);

    try {
      const activeSources = getActiveNewsSources();
      const articlePromises = [];

      // Clear cache if force refresh
      if (forceRefresh) {
        clearRSSCache();
      }

      // Fetch from each source
      for (const source of activeSources) {
        const promise = fetchRSSFeed(source.rssUrl, source.id)
          .then(articles => 
            articles.map(article => ({
              ...article,
              source: source.name,
              sourceId: source.id,
              category: source.category
            }))
          )
          .catch(error => {
            console.warn(`Failed to load from ${source.name}:`, error);
            return []; // Return empty array on error
          });
        
        articlePromises.push(promise);
      }

      // Wait for all sources (with timeout)
      const results = await Promise.allSettled(articlePromises);
      const allFetchedArticles = results
        .filter(result => result.status === 'fulfilled')
        .flatMap(result => result.value);

      // Use fallback news if no articles loaded
      if (allFetchedArticles.length === 0) {
        console.warn('No articles loaded from RSS feeds, using fallback news');
        setAllArticles(fallbackNews);
        setError('Unable to load live news feeds. Showing recent news.');
      } else {
        // Combine fetched articles with fallback if needed
        const combinedArticles = allFetchedArticles.length < 5 
          ? [...allFetchedArticles, ...fallbackNews.slice(0, 10 - allFetchedArticles.length)]
          : allFetchedArticles;
        
        setAllArticles(sortNewsByDate(combinedArticles));
      }

      setLastUpdated(new Date());
      
      // Update cache status
      const status = getCacheStatus(activeSources);
      setCacheStatus(status);

    } catch (error) {
      console.error('Error loading news:', error);
      setError('Failed to load news. Please try again later.');
      setAllArticles(fallbackNews); // Use fallback on error
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  /**
   * Apply category and source filters
   */
  const applyFilters = useCallback(() => {
    let filtered = [...allArticles];

    // Apply category filter
    filtered = getNewsByCategory(filtered, selectedCategory);

    // Apply source filter
    if (selectedSources.size > 0) {
      filtered = filtered.filter(article => 
        selectedSources.has(article.sourceId) || selectedSources.has(article.source)
      );
    }

    setFilteredArticles(filtered);
  }, [allArticles, selectedCategory, selectedSources]);

  /**
   * Handle source filter change
   */
  const handleSourceToggle = (sourceId) => {
    const newSelection = new Set(selectedSources);
    if (newSelection.has(sourceId)) {
      newSelection.delete(sourceId);
    } else {
      newSelection.add(sourceId);
    }
    setSelectedSources(newSelection);
  };

  /**
   * Handle refresh
   */
  const handleRefresh = () => {
    loadNews(true);
  };

  /**
   * Handle clear cache
   */
  const handleClearCache = () => {
    clearRSSCache();
    setCacheStatus({});
    loadNews(true);
  };

  /**
   * Format last updated time
   */
  const formatLastUpdated = () => {
    if (!lastUpdated) return 'Never';
    
    const now = new Date();
    const diffMs = now - lastUpdated;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    
    return lastUpdated.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <span>→</span>
            <span className="text-gray-800">Psychology News</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Psychology News
              </h1>
              <p className="text-lg text-gray-600">
                Latest news and updates from psychology and mental health organizations
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <RefreshButton 
                onRefresh={handleRefresh}
                isRefreshing={refreshing}
                lastUpdated={formatLastUpdated()}
              />
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>
                <strong>{filteredArticles.length}</strong> articles
              </span>
              <span>•</span>
              <span>
                Last updated: <strong>{formatLastUpdated()}</strong>
              </span>
              {error && (
                <>
                  <span>•</span>
                  <span className="text-orange-600">
                    ⚠️ {error}
                  </span>
                </>
              )}
            </div>
            
            {isLoggedIn && (
              <div className="mt-2 sm:mt-0">
                <button
                  onClick={handleClearCache}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Clear Cache
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Category Filter */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Categories</h3>
              <div className="space-y-2">
                {newsCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition ${
                      selectedCategory === category
                        ? 'bg-blue-100 text-blue-800 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Source Filter */}
            <SourceFilter
              sources={newsSources}
              selectedSources={selectedSources}
              onSourceToggle={handleSourceToggle}
              cacheStatus={cacheStatus}
            />

            {/* News Info */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">📰 About News Feed</h3>
              <div className="text-xs text-gray-600 space-y-2">
                <p>
                  News is automatically updated from trusted psychology and mental health sources.
                </p>
                <p>
                  <strong>Refresh interval:</strong> 15 minutes
                </p>
                <p>
                  <strong>Sources:</strong> BPS, APA, NHS, Psychology Today, and more
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Loading State */}
            {isLoading && !refreshing && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading latest psychology news...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && allArticles.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📰</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Unable to Load News</h3>
                <p className="text-gray-600 mb-4">
                  We're having trouble connecting to news sources. Please try again later.
                </p>
                <button
                  onClick={() => loadNews(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* News Articles */}
            {!isLoading && filteredArticles.length > 0 && (
              <div className="space-y-6">
                {filteredArticles.map((article, index) => (
                  <NewsCard
                    key={article.id || `${article.source}-${index}`}
                    article={article}
                    isFirst={index === 0}
                  />
                ))}
              </div>
            )}

            {/* No Results */}
            {!isLoading && filteredArticles.length === 0 && allArticles.length > 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Articles Found</h3>
                <p className="text-gray-600 mb-4">
                  No articles match your current filters. Try selecting different categories or sources.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All Categories');
                    setSelectedSources(new Set());
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Stay Informed</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Keep up with the latest developments in psychology, mental health policy, and research 
              that may impact your training and career development.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">🔄</div>
              <h3 className="font-semibold text-gray-800 mb-1">Auto-Updated</h3>
              <p className="text-sm text-gray-600">News refreshes automatically every 15 minutes</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🏛️</div>
              <h3 className="font-semibold text-gray-800 mb-1">Trusted Sources</h3>
              <p className="text-sm text-gray-600">Content from BPS, APA, NHS, and leading organizations</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📱</div>
              <h3 className="font-semibold text-gray-800 mb-1">Mobile Friendly</h3>
              <p className="text-sm text-gray-600">Read news on any device with responsive design</p>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/blog"
                className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition"
              >
                Read Expert Articles
              </Link>
              <Link
                to="/practice"
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                Practice SJT Questions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsFeed;