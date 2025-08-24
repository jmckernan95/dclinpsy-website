/**
 * Blog List Page
 * Main blog interface with categories, search, and article listing
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { blogArticles, getCategories, getFeaturedArticles, searchArticles, getRecentArticles } from '../../data/blog-articles';
import ArticleCard from '../../components/Blog/ArticleCard';
import CategoryFilter from '../../components/Blog/CategoryFilter';

const BlogList = () => {
  const { isLoggedIn } = useAuth();
  
  // State management
  const [filteredArticles, setFilteredArticles] = useState(blogArticles);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [bookmarkedArticles, setBookmarkedArticles] = useState(new Set());
  const [readArticles, setReadArticles] = useState(new Set());

  // Load user preferences
  useEffect(() => {
    try {
      const savedBookmarks = localStorage.getItem('blog-bookmarks');
      const savedReadArticles = localStorage.getItem('blog-read-articles');
      
      if (savedBookmarks) {
        setBookmarkedArticles(new Set(JSON.parse(savedBookmarks)));
      }
      
      if (savedReadArticles) {
        setReadArticles(new Set(JSON.parse(savedReadArticles)));
      }
    } catch (error) {
      console.error('Error loading blog preferences:', error);
    }
  }, []);

  // Filter and sort articles
  useEffect(() => {
    let articles = [...blogArticles];
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      articles = articles.filter(article => article.category === selectedCategory);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      articles = searchArticles(searchQuery);
      // Re-apply category filter after search if needed
      if (selectedCategory !== 'all') {
        articles = articles.filter(article => article.category === selectedCategory);
      }
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'recent':
        articles.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'popular':
        articles.sort((a, b) => b.views - a.views);
        break;
      case 'title':
        articles.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'reading-time':
        articles.sort((a, b) => a.readingTime - b.readingTime);
        break;
      default:
        break;
    }
    
    setFilteredArticles(articles);
  }, [selectedCategory, searchQuery, sortBy]);

  // Handle bookmark toggle
  const handleBookmarkToggle = (articleId) => {
    if (!isLoggedIn) {
      alert('Please log in to bookmark articles');
      return;
    }
    
    const newBookmarks = new Set(bookmarkedArticles);
    if (newBookmarks.has(articleId)) {
      newBookmarks.delete(articleId);
    } else {
      newBookmarks.add(articleId);
    }
    
    setBookmarkedArticles(newBookmarks);
    
    try {
      localStorage.setItem('blog-bookmarks', JSON.stringify(Array.from(newBookmarks)));
    } catch (error) {
      console.error('Error saving bookmarks:', error);
    }
  };

  // Mark article as read
  const markAsRead = (articleId) => {
    const newReadArticles = new Set(readArticles);
    newReadArticles.add(articleId);
    setReadArticles(newReadArticles);
    
    try {
      localStorage.setItem('blog-read-articles', JSON.stringify(Array.from(newReadArticles)));
    } catch (error) {
      console.error('Error saving read articles:', error);
    }
  };

  const categories = getCategories();
  const featuredArticles = getFeaturedArticles();
  const recentArticles = getRecentArticles(3);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <span>→</span>
            <span className="text-gray-800">Blog & Resources</span>
          </nav>

          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Blog & Resources
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Tips, advice, and insights for aspiring and current clinical psychology trainees
            </p>
          </div>
        </div>

        {/* Featured Articles Banner */}
        {featuredArticles.length > 0 && !searchQuery && selectedCategory === 'all' && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredArticles.map((article) => (
                <div key={article.id} className="relative">
                  <ArticleCard
                    article={article}
                    isBookmarked={bookmarkedArticles.has(article.id)}
                    isRead={readArticles.has(article.id)}
                    onBookmark={() => handleBookmarkToggle(article.id)}
                    onRead={() => markAsRead(article.id)}
                    featured={true}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                      Featured
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Search Articles</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute right-3 top-2.5 text-gray-400">
                  🔍
                </div>
              </div>
            </div>

            {/* Categories */}
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              articleCounts={blogArticles}
            />

            {/* Sort Options */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="title">Title (A-Z)</option>
                <option value="reading-time">Reading Time</option>
              </select>
            </div>

            {/* Quick Stats */}
            {isLoggedIn && (
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Reading Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Articles Read:</span>
                    <span className="font-semibold">{readArticles.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bookmarked:</span>
                    <span className="font-semibold">{bookmarkedArticles.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Progress:</span>
                    <span className="font-semibold">
                      {Math.round((readArticles.size / blogArticles.length) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Articles */}
            {!searchQuery && selectedCategory === 'all' && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Articles</h3>
                <div className="space-y-3">
                  {recentArticles.map((article) => (
                    <Link
                      key={article.id}
                      to={`/blog/${article.slug}`}
                      onClick={() => markAsRead(article.id)}
                      className="block p-3 hover:bg-gray-50 rounded-lg transition"
                    >
                      <h4 className="font-medium text-gray-800 text-sm line-clamp-2 mb-1">
                        {article.title}
                      </h4>
                      <div className="flex items-center text-xs text-gray-500 space-x-2">
                        <span>{new Date(article.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{article.readingTime} min read</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {searchQuery ? `Search Results for "${searchQuery}"` : 
                   selectedCategory !== 'all' ? `${selectedCategory} Articles` : 'All Articles'}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
                </p>
              </div>

              {(searchQuery || selectedCategory !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Articles Grid */}
            {filteredArticles.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {filteredArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    isBookmarked={bookmarkedArticles.has(article.id)}
                    isRead={readArticles.has(article.id)}
                    onBookmark={() => handleBookmarkToggle(article.id)}
                    onRead={() => markAsRead(article.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No articles found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery ? 
                    `No articles match your search for "${searchQuery}"` :
                    `No articles in the ${selectedCategory} category`
                  }
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  View All Articles
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Continue Your Learning Journey</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Complement your reading with hands-on practice using our SJT scenarios and statistics learning modules.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/practice"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Practice SJT Questions
            </Link>
            <Link
              to="/statistics/theory"
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
            >
              Learn Statistics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogList;