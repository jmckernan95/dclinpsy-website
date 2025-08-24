/**
 * RSS Parser Utility
 * Handles RSS feed fetching and parsing with fallback mechanisms
 */

import { rssProxyServices, CACHE_DURATION, MAX_ARTICLES_PER_SOURCE } from '../data/news-sources';

/**
 * Fetch RSS feed through proxy services
 * @param {string} rssUrl - The RSS feed URL
 * @param {string} sourceId - Source identifier for caching
 * @returns {Promise<Array>} - Parsed news articles
 */
export const fetchRSSFeed = async (rssUrl, sourceId) => {
  // Check cache first
  const cachedData = getCachedFeed(sourceId);
  if (cachedData) {
    return cachedData;
  }

  // Try each proxy service
  for (const proxy of rssProxyServices) {
    try {
      const articles = await fetchThroughProxy(rssUrl, proxy, sourceId);
      if (articles && articles.length > 0) {
        // Cache successful result
        cacheFeed(sourceId, articles);
        return articles;
      }
    } catch (error) {
      console.warn(`Failed to fetch through ${proxy.name}:`, error);
      continue; // Try next proxy
    }
  }

  // If all proxies fail, return empty array
  console.error(`All RSS proxy services failed for ${sourceId}`);
  return [];
};

/**
 * Fetch RSS through a specific proxy service
 * @param {string} rssUrl - RSS feed URL
 * @param {Object} proxy - Proxy service configuration
 * @param {string} sourceId - Source identifier
 * @returns {Promise<Array>} - Parsed articles
 */
const fetchThroughProxy = async (rssUrl, proxy, sourceId) => {
  const proxyUrl = `${proxy.url}${encodeURIComponent(rssUrl)}`;
  
  const response = await fetch(proxyUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json, application/rss+xml, application/xml, text/xml',
    },
    timeout: 10000 // 10 second timeout
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  const content = proxy.parseFunction(data);

  // Handle different response formats
  if (typeof content === 'string') {
    // Raw XML content - parse it
    return parseXMLContent(content, sourceId);
  } else if (content.items && Array.isArray(content.items)) {
    // Already parsed JSON format (RSS2JSON)
    return formatArticles(content.items, sourceId);
  } else {
    throw new Error('Unexpected response format');
  }
};

/**
 * Parse XML RSS content
 * @param {string} xmlContent - Raw XML content
 * @param {string} sourceId - Source identifier
 * @returns {Array} - Parsed articles
 */
const parseXMLContent = (xmlContent, sourceId) => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, 'application/xml');
    
    // Check for parsing errors
    if (xmlDoc.querySelector('parsererror')) {
      throw new Error('XML parsing error');
    }

    const items = xmlDoc.querySelectorAll('item, entry'); // Support RSS and Atom
    const articles = [];

    items.forEach((item, index) => {
      if (index >= MAX_ARTICLES_PER_SOURCE) return; // Limit articles per source

      try {
        const article = {
          id: `${sourceId}-${Date.now()}-${index}`,
          title: getTextContent(item, 'title'),
          description: getTextContent(item, 'description, summary, content'),
          url: getTextContent(item, 'link, guid') || getAttribute(item, 'link', 'href'),
          publishDate: getTextContent(item, 'pubDate, published, updated'),
          source: sourceId,
          imageUrl: extractImageUrl(item),
          isFallback: false
        };

        // Only add if we have minimum required data
        if (article.title && article.url) {
          articles.push(article);
        }
      } catch (itemError) {
        console.warn(`Error parsing article ${index} from ${sourceId}:`, itemError);
      }
    });

    return articles;
  } catch (error) {
    console.error(`Error parsing XML for ${sourceId}:`, error);
    return [];
  }
};

/**
 * Format articles from JSON RSS response
 * @param {Array} items - RSS items array
 * @param {string} sourceId - Source identifier
 * @returns {Array} - Formatted articles
 */
const formatArticles = (items, sourceId) => {
  return items.slice(0, MAX_ARTICLES_PER_SOURCE).map((item, index) => ({
    id: `${sourceId}-${Date.now()}-${index}`,
    title: item.title || 'Untitled',
    description: cleanDescription(item.description || item.content || ''),
    url: item.link || item.guid || '#',
    publishDate: item.pubDate || item.published || new Date().toISOString(),
    source: sourceId,
    imageUrl: extractImageFromContent(item.description || item.content || ''),
    isFallback: false
  }));
};

/**
 * Get text content from XML element
 * @param {Element} parent - Parent XML element
 * @param {string} selectors - CSS selector string
 * @returns {string} - Text content
 */
const getTextContent = (parent, selectors) => {
  const selectorList = selectors.split(',').map(s => s.trim());
  
  for (const selector of selectorList) {
    const element = parent.querySelector(selector);
    if (element) {
      return element.textContent?.trim() || '';
    }
  }
  
  return '';
};

/**
 * Get attribute from XML element
 * @param {Element} parent - Parent XML element
 * @param {string} selector - CSS selector
 * @param {string} attribute - Attribute name
 * @returns {string} - Attribute value
 */
const getAttribute = (parent, selector, attribute) => {
  const element = parent.querySelector(selector);
  return element?.getAttribute(attribute) || '';
};

/**
 * Extract image URL from RSS item
 * @param {Element} item - RSS item element
 * @returns {string|null} - Image URL or null
 */
const extractImageUrl = (item) => {
  // Try different image sources
  const imageSelectors = [
    'media\\:thumbnail',
    'media\\:content[type*="image"]',
    'enclosure[type*="image"]',
    'image',
    'media\\:group media\\:content'
  ];

  for (const selector of imageSelectors) {
    const element = item.querySelector(selector);
    if (element) {
      return element.getAttribute('url') || element.getAttribute('href') || null;
    }
  }

  // Try extracting from description HTML
  const description = getTextContent(item, 'description, content');
  return extractImageFromContent(description);
};

/**
 * Extract image URL from HTML content
 * @param {string} content - HTML content
 * @returns {string|null} - Image URL or null
 */
const extractImageFromContent = (content) => {
  if (!content) return null;
  
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
  return imgMatch ? imgMatch[1] : null;
};

/**
 * Clean HTML from description
 * @param {string} description - Raw description
 * @returns {string} - Cleaned description
 */
const cleanDescription = (description) => {
  if (!description) return '';
  
  return description
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&[^;]+;/g, ' ') // Remove HTML entities
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
    .substring(0, 300) + (description.length > 300 ? '...' : ''); // Limit length
};

/**
 * Cache feed data
 * @param {string} sourceId - Source identifier
 * @param {Array} articles - Articles to cache
 */
const cacheFeed = (sourceId, articles) => {
  try {
    const cacheData = {
      timestamp: Date.now(),
      articles: articles
    };
    
    localStorage.setItem(`rss-cache-${sourceId}`, JSON.stringify(cacheData));
  } catch (error) {
    console.warn(`Failed to cache feed for ${sourceId}:`, error);
  }
};

/**
 * Get cached feed data
 * @param {string} sourceId - Source identifier
 * @returns {Array|null} - Cached articles or null
 */
const getCachedFeed = (sourceId) => {
  try {
    const cached = localStorage.getItem(`rss-cache-${sourceId}`);
    if (!cached) return null;

    const cacheData = JSON.parse(cached);
    const isExpired = Date.now() - cacheData.timestamp > CACHE_DURATION;
    
    if (isExpired) {
      localStorage.removeItem(`rss-cache-${sourceId}`);
      return null;
    }

    return cacheData.articles;
  } catch (error) {
    console.warn(`Failed to read cache for ${sourceId}:`, error);
    return null;
  }
};

/**
 * Clear all RSS caches
 */
export const clearRSSCache = () => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('rss-cache-')) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn('Failed to clear RSS cache:', error);
  }
};

/**
 * Get cache status for all sources
 * @param {Array} sources - News sources
 * @returns {Object} - Cache status by source ID
 */
export const getCacheStatus = (sources) => {
  const status = {};
  
  sources.forEach(source => {
    try {
      const cached = localStorage.getItem(`rss-cache-${source.id}`);
      if (cached) {
        const cacheData = JSON.parse(cached);
        const age = Date.now() - cacheData.timestamp;
        const isExpired = age > CACHE_DURATION;
        
        status[source.id] = {
          cached: true,
          age: age,
          expired: isExpired,
          articleCount: cacheData.articles?.length || 0
        };
      } else {
        status[source.id] = {
          cached: false,
          age: 0,
          expired: true,
          articleCount: 0
        };
      }
    } catch (error) {
      status[source.id] = {
        cached: false,
        age: 0,
        expired: true,
        articleCount: 0,
        error: error.message
      };
    }
  });
  
  return status;
};

const rssParser = {
  fetchRSSFeed,
  clearRSSCache,
  getCacheStatus
};

export default rssParser;