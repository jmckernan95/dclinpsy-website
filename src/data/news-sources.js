/**
 * News Sources Configuration
 * RSS feeds and news sources for psychology news aggregation
 */

// RSS Feed Sources for Psychology News
export const newsSources = [
  {
    id: 'psychology-today',
    name: 'Psychology Today',
    description: 'Latest psychology news and research updates',
    rssUrl: 'https://www.psychologytoday.com/us/rss/blog.xml',
    category: 'General Psychology',
    logoUrl: 'https://www.psychologytoday.com/sites/all/themes/psychologytoday/logo.png',
    color: 'bg-blue-100 text-blue-800',
    priority: 1,
    active: true
  },
  {
    id: 'bps-news',
    name: 'British Psychological Society',
    description: 'Official BPS news and professional updates',
    rssUrl: 'https://www.bps.org.uk/rss.xml',
    category: 'Professional News',
    logoUrl: '/assets/bps-logo.png',
    color: 'bg-green-100 text-green-800',
    priority: 1,
    active: true
  },
  {
    id: 'apa-news',
    name: 'American Psychological Association',
    description: 'APA news, research, and policy updates',
    rssUrl: 'https://www.apa.org/news/rss/releases.xml',
    category: 'Research & Policy',
    logoUrl: '/assets/apa-logo.png',
    color: 'bg-purple-100 text-purple-800',
    priority: 2,
    active: true
  },
  {
    id: 'science-daily-psych',
    name: 'Science Daily - Psychology',
    description: 'Latest psychology research from universities',
    rssUrl: 'https://www.sciencedaily.com/rss/mind_brain/psychology.xml',
    category: 'Research',
    logoUrl: '/assets/sciencedaily-logo.png',
    color: 'bg-orange-100 text-orange-800',
    priority: 2,
    active: true
  },
  {
    id: 'nhs-mental-health',
    name: 'NHS Mental Health News',
    description: 'NHS mental health service updates and policy',
    rssUrl: 'https://www.england.nhs.uk/news/feed/',
    category: 'NHS & Policy',
    logoUrl: '/assets/nhs-logo.png',
    color: 'bg-blue-100 text-blue-800',
    priority: 3,
    active: true
  },
  {
    id: 'mind-charity',
    name: 'Mind Charity',
    description: 'Mental health awareness and advocacy news',
    rssUrl: 'https://www.mind.org.uk/news-campaigns/news/feed/',
    category: 'Mental Health',
    logoUrl: '/assets/mind-logo.png',
    color: 'bg-pink-100 text-pink-800',
    priority: 3,
    active: true
  }
];

// Categories for filtering
export const newsCategories = [
  'All Categories',
  'General Psychology',
  'Professional News',
  'Research & Policy',
  'Research',
  'NHS & Policy',
  'Mental Health'
];

// RSS-to-JSON proxy services (for CORS handling)
export const rssProxyServices = [
  {
    name: 'AllOrigins',
    url: 'https://api.allorigins.win/get?url=',
    parseFunction: (data) => data.contents
  },
  {
    name: 'RSS2JSON',
    url: 'https://api.rss2json.com/v1/api.json?rss_url=',
    parseFunction: (data) => data
  },
  {
    name: 'CORS Anywhere (Backup)',
    url: 'https://cors-anywhere.herokuapp.com/',
    parseFunction: (data) => data
  }
];

// Fallback news data (used when RSS feeds fail)
export const fallbackNews = [
  {
    id: 'fallback-1',
    title: 'NHS Announces New Mental Health Training Initiative',
    description: 'The NHS has launched a comprehensive training program to enhance mental health services across England, focusing on early intervention and community-based care.',
    url: 'https://www.england.nhs.uk/mental-health/',
    source: 'NHS England',
    category: 'NHS & Policy',
    publishDate: new Date().toISOString(),
    imageUrl: null,
    isFallback: true
  },
  {
    id: 'fallback-2',
    title: 'BPS Updates Guidelines for Clinical Psychology Practice',
    description: 'The British Psychological Society has released updated practice guidelines emphasizing digital therapy delivery and cultural competency in clinical work.',
    url: 'https://www.bps.org.uk/guideline/clinical-psychology-practice-guidelines',
    source: 'British Psychological Society',
    category: 'Professional News',
    publishDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    imageUrl: null,
    isFallback: true
  },
  {
    id: 'fallback-3',
    title: 'Research Shows Benefits of Digital Mental Health Interventions',
    description: 'A new meta-analysis published in Clinical Psychology Review demonstrates the effectiveness of app-based cognitive behavioral therapy for anxiety and depression.',
    url: 'https://www.sciencedirect.com/journal/clinical-psychology-review',
    source: 'Science Daily',
    category: 'Research',
    publishDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    imageUrl: null,
    isFallback: true
  },
  {
    id: 'fallback-4',
    title: 'Psychology Today: Managing Stress During Clinical Training',
    description: 'Expert advice on maintaining wellbeing during demanding psychology training programs, including self-care strategies and supervisor support.',
    url: 'https://www.psychologytoday.com/gb/blog/training-stress',
    source: 'Psychology Today',
    category: 'General Psychology',
    publishDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    imageUrl: null,
    isFallback: true
  },
  {
    id: 'fallback-5',
    title: 'Mind Charity Launches University Mental Health Campaign',
    description: 'Mind has partnered with universities across the UK to improve mental health support for students, including psychology trainees facing academic pressures.',
    url: 'https://www.mind.org.uk/news-campaigns/',
    source: 'Mind Charity',
    category: 'Mental Health',
    publishDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    imageUrl: null,
    isFallback: true
  },
  {
    id: 'fallback-6',
    title: 'APA Publishes New Research on Therapy Effectiveness',
    description: 'The American Psychological Association releases comprehensive data showing long-term benefits of psychological interventions compared to medication-only treatments.',
    url: 'https://www.apa.org/science/about/psa/2024/therapy-effectiveness',
    source: 'American Psychological Association',
    category: 'Research & Policy',
    publishDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    imageUrl: null,
    isFallback: true
  }
];

// Helper functions
export const getActiveNewsSources = () => {
  return newsSources.filter(source => source.active);
};

export const getNewsByCategory = (news, category) => {
  if (category === 'All Categories') return news;
  return news.filter(item => item.category === category);
};

export const getSourceById = (id) => {
  return newsSources.find(source => source.id === id);
};

export const sortNewsByDate = (news) => {
  return [...news].sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
};

// Cache duration (15 minutes)
export const CACHE_DURATION = 15 * 60 * 1000;

// Maximum articles to store per source
export const MAX_ARTICLES_PER_SOURCE = 10;

// Default refresh interval (30 minutes)
export const DEFAULT_REFRESH_INTERVAL = 30 * 60 * 1000;

const newsModule = {
  newsSources,
  newsCategories,
  rssProxyServices,
  fallbackNews,
  getActiveNewsSources,
  getNewsByCategory,
  getSourceById,
  sortNewsByDate,
  CACHE_DURATION,
  MAX_ARTICLES_PER_SOURCE,
  DEFAULT_REFRESH_INTERVAL
};

export default newsModule;