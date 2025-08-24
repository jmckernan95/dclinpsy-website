/**
 * Article View Page
 * Individual article reading interface with table of contents and related articles
 */

import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getArticleBySlug, getArticlesByCategory } from '../../data/blog-articles';

const ArticleView = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [tableOfContents, setTableOfContents] = useState([]);
  const [activeSection, setActiveSection] = useState('');

  // Load article and related content
  useEffect(() => {
    const foundArticle = getArticleBySlug(slug);
    if (foundArticle) {
      setArticle(foundArticle);
      
      // Get related articles from same category
      const related = getArticlesByCategory(foundArticle.category)
        .filter(a => a.id !== foundArticle.id)
        .slice(0, 3);
      setRelatedArticles(related);
      
      // Generate table of contents from article content
      generateTableOfContents(foundArticle.content);
      
      // Mark as read
      markAsRead(foundArticle.id);
    } else {
      navigate('/blog');
    }
  }, [slug, navigate]);

  // Load bookmark status
  useEffect(() => {
    if (article && isLoggedIn) {
      try {
        const bookmarks = JSON.parse(localStorage.getItem('blog-bookmarks') || '[]');
        setIsBookmarked(bookmarks.includes(article.id));
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      }
    }
  }, [article, isLoggedIn]);

  // Reading progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const articleElement = document.getElementById('article-content');
      if (articleElement) {
        const scrollTop = window.pageYOffset;
        const docHeight = articleElement.offsetHeight;
        const winHeight = window.innerHeight;
        const scrollPercent = scrollTop / (docHeight - winHeight);
        setReadingProgress(Math.min(100, Math.max(0, scrollPercent * 100)));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [article]);

  const generateTableOfContents = (content) => {
    const headings = [];
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      if (line.startsWith('## ')) {
        const title = line.substring(3).trim();
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        headings.push({
          id,
          title,
          level: 2
        });
      } else if (line.startsWith('### ')) {
        const title = line.substring(4).trim();
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        headings.push({
          id,
          title,
          level: 3
        });
      }
    });
    
    setTableOfContents(headings);
  };

  const markAsRead = (articleId) => {
    try {
      const readArticles = JSON.parse(localStorage.getItem('blog-read-articles') || '[]');
      if (!readArticles.includes(articleId)) {
        readArticles.push(articleId);
        localStorage.setItem('blog-read-articles', JSON.stringify(readArticles));
      }
    } catch (error) {
      console.error('Error saving read status:', error);
    }
  };

  const handleBookmarkToggle = () => {
    if (!isLoggedIn) {
      alert('Please log in to bookmark articles');
      return;
    }
    
    try {
      const bookmarks = JSON.parse(localStorage.getItem('blog-bookmarks') || '[]');
      let newBookmarks;
      
      if (isBookmarked) {
        newBookmarks = bookmarks.filter(id => id !== article.id);
      } else {
        newBookmarks = [...bookmarks, article.id];
      }
      
      localStorage.setItem('blog-bookmarks', JSON.stringify(newBookmarks));
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error saving bookmark:', error);
    }
  };

  const formatContent = (content) => {
    return content
      .split('\n')
      .map((line, index) => {
        // Headers with IDs for navigation
        if (line.startsWith('# ')) {
          const title = line.substring(2).trim();
          const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          return <h1 key={index} id={id} className="text-3xl font-bold text-gray-800 mb-6 mt-8">{title}</h1>;
        }
        if (line.startsWith('## ')) {
          const title = line.substring(3).trim();
          const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          return <h2 key={index} id={id} className="text-2xl font-semibold text-gray-800 mb-4 mt-8">{title}</h2>;
        }
        if (line.startsWith('### ')) {
          const title = line.substring(4).trim();
          const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          return <h3 key={index} id={id} className="text-xl font-semibold text-gray-800 mb-3 mt-6">{title}</h3>;
        }
        if (line.startsWith('#### ')) {
          return <h4 key={index} className="text-lg font-semibold text-gray-800 mb-2 mt-4">{line.substring(5)}</h4>;
        }
        
        // Bold text and formatting
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={index} className="font-bold text-gray-800 mb-2">{line.slice(2, -2)}</p>;
        }
        
        // Lists
        if (line.startsWith('- **') && line.includes('**:')) {
          const parts = line.split('**');
          if (parts.length >= 3) {
            return (
              <li key={index} className="mb-2">
                <span className="font-semibold text-gray-800">{parts[1]}</span>
                <span className="text-gray-700">: {parts[2].substring(1)}</span>
              </li>
            );
          }
        }
        if (line.startsWith('- ')) {
          return <li key={index} className="text-gray-700 mb-1">{line.substring(2)}</li>;
        }
        if (line.startsWith('• ')) {
          return <li key={index} className="text-gray-700 mb-1">{line.substring(2)}</li>;
        }
        
        // Code blocks
        if (line.startsWith('```')) {
          return <div key={index} className="bg-gray-100 p-4 rounded-lg my-4 font-mono text-sm">{line}</div>;
        }
        
        // Quotes or emphasized text
        if (line.startsWith('*"') && line.endsWith('"*')) {
          return (
            <blockquote key={index} className="border-l-4 border-blue-400 pl-4 italic text-gray-700 my-4">
              {line.slice(2, -2)}
            </blockquote>
          );
        }
        
        // Regular paragraphs
        if (line.trim() && !line.startsWith('#') && !line.startsWith('**') && !line.startsWith('---')) {
          return <p key={index} className="text-gray-700 mb-4 leading-relaxed">{line}</p>;
        }
        
        // Dividers
        if (line.startsWith('---')) {
          return <hr key={index} className="my-8 border-gray-200" />;
        }
        
        // Empty lines for spacing
        return <div key={index} className="mb-2"></div>;
      });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Article URL copied to clipboard!');
    }
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Article Not Found</h2>
          <p className="text-gray-600 mb-4">The article you're looking for doesn't exist.</p>
          <Link
            to="/blog"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div
          className="h-1 bg-blue-600 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        ></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span>→</span>
          <Link to="/blog" className="hover:text-blue-600">Blog</Link>
          <span>→</span>
          <span className="text-gray-800">{article.category}</span>
        </nav>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Table of Contents Sidebar */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-8">
              {tableOfContents.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Table of Contents</h3>
                  <nav className="space-y-2">
                    {tableOfContents.map((heading, index) => (
                      <a
                        key={index}
                        href={`#${heading.id}`}
                        className={`block text-sm hover:text-blue-600 transition ${
                          heading.level === 3 ? 'ml-4 text-gray-600' : 'text-gray-700'
                        }`}
                      >
                        {heading.title}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* Article Actions */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Article Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleBookmarkToggle}
                    className={`w-full px-4 py-2 rounded-lg font-medium transition ${
                      isBookmarked
                        ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    disabled={!isLoggedIn}
                  >
                    {isBookmarked ? '🔖 Bookmarked' : '🔖 Bookmark'}
                  </button>
                  
                  <button
                    onClick={handleShare}
                    className="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium transition"
                  >
                    📤 Share Article
                  </button>
                  
                  <Link
                    to="/blog"
                    className="block w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition text-center"
                  >
                    ← Back to Blog
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <article className="bg-white rounded-lg shadow-lg">
              {/* Article Header */}
              <div className="px-6 py-8 border-b border-gray-200">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {article.category}
                  </span>
                  {article.featured && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                      Featured
                    </span>
                  )}
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  {article.title}
                </h1>
                
                <p className="text-xl text-gray-600 mb-6">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>By {article.author}</span>
                    <span>•</span>
                    <span>{new Date(article.date).toLocaleDateString('en-GB', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                    <span>•</span>
                    <span>{article.readingTime} min read</span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      👁️ {article.views.toLocaleString()}
                    </span>
                    <span className="flex items-center">
                      👍 {article.likes}
                    </span>
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <div id="article-content" className="px-6 py-8">
                <div className="prose prose-lg max-w-none">
                  {formatContent(article.content)}
                </div>
              </div>

              {/* Article Footer */}
              <div className="px-6 py-6 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Mobile actions */}
                  <div className="flex lg:hidden space-x-2">
                    <button
                      onClick={handleBookmarkToggle}
                      className={`px-3 py-2 rounded-lg font-medium transition ${
                        isBookmarked
                          ? 'bg-orange-200 text-orange-800'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                      disabled={!isLoggedIn}
                    >
                      🔖
                    </button>
                    <button
                      onClick={handleShare}
                      className="px-3 py-2 bg-blue-200 text-blue-800 rounded-lg font-medium transition"
                    >
                      📤
                    </button>
                  </div>
                </div>
              </div>
            </article>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Articles</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedArticles.map((relatedArticle) => (
                    <Link
                      key={relatedArticle.id}
                      to={`/blog/${relatedArticle.slug}`}
                      className="bg-white rounded-lg shadow-lg hover:shadow-xl transition p-6"
                    >
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                          {relatedArticle.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                        {relatedArticle.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {relatedArticle.excerpt}
                      </p>
                      <div className="text-xs text-gray-500">
                        {relatedArticle.readingTime} min read • {new Date(relatedArticle.date).toLocaleDateString()}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Call to Action */}
            <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to Practice?</h2>
              <p className="text-gray-600 mb-6">
                Apply what you've learned with our interactive practice modules.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/practice"
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                  SJT Practice
                </Link>
                <Link
                  to="/statistics/theory"
                  className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                >
                  Statistics Learning
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleView;