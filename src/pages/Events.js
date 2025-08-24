/**
 * Events Page - Psychology Events Near You
 * Comprehensive events aggregation for UK psychology community
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  UK_CITIES, 
  EVENT_CATEGORIES, 
  curatedEvents, 
  ORGANIZATION_LINKS,
  generateEventbriteLink,
  generateMeetupLink,
  formatEventDate,
  isEventUpcoming,
  filterEventsByLocation 
} from '../data/events-data';
import EventCard from '../components/Events/EventCard';
import LocationSelector from '../components/Events/LocationSelector';
import EventFilters from '../components/Events/EventFilters';
import ExternalSearchLinks from '../components/Events/ExternalSearchLinks';

const Events = () => {
  const { isLoggedIn } = useAuth();
  
  // State management
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFormat, setSelectedFormat] = useState(''); // all, virtual, in-person
  const [selectedPrice, setSelectedPrice] = useState(''); // all, free, paid
  const [dateRange, setDateRange] = useState('upcoming'); // upcoming, this-week, this-month
  const [activeTab, setActiveTab] = useState('curated'); // curated, university, organizations, external
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  // Load user preferences from localStorage
  useEffect(() => {
    try {
      const savedCity = localStorage.getItem('events-selected-city');
      const savedPreferences = localStorage.getItem('events-preferences');
      
      if (savedCity) {
        setSelectedCity(savedCity);
      }
      
      if (savedPreferences) {
        const prefs = JSON.parse(savedPreferences);
        setSelectedCategory(prefs.category || '');
        setSelectedFormat(prefs.format || '');
        setSelectedPrice(prefs.price || '');
        setDateRange(prefs.dateRange || 'upcoming');
      }
    } catch (error) {
      console.error('Error loading event preferences:', error);
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    if (selectedCity) {
      localStorage.setItem('events-selected-city', selectedCity);
    }
    
    const preferences = {
      category: selectedCategory,
      format: selectedFormat,
      price: selectedPrice,
      dateRange: dateRange
    };
    localStorage.setItem('events-preferences', JSON.stringify(preferences));
  }, [selectedCity, selectedCategory, selectedFormat, selectedPrice, dateRange]);

  // Load events based on active tab
  useEffect(() => {
    loadEvents();
  }, [activeTab, selectedCity]);

  // Filter events when filters change
  useEffect(() => {
    applyFilters();
  }, [events, selectedCategory, selectedFormat, selectedPrice, dateRange, selectedCity]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      let loadedEvents = [];
      
      switch (activeTab) {
        case 'curated':
          loadedEvents = [...curatedEvents];
          break;
        case 'university':
          // In a real implementation, this would fetch from RSS feeds
          // For now, we'll show a subset of curated events marked as university events
          loadedEvents = curatedEvents.filter(event => 
            event.tags && event.tags.includes('university')
          );
          break;
        case 'organizations':
          // Placeholder - would fetch from organization RSS feeds
          loadedEvents = curatedEvents.filter(event => 
            event.organization.includes('British Psychological Society') ||
            event.organization.includes('NHS') ||
            event.organization.includes('Mental Health')
          );
          break;
        default:
          loadedEvents = [...curatedEvents];
      }
      
      setEvents(loadedEvents);
    } catch (error) {
      console.error('Error loading events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...events];

    // Filter by location
    if (selectedCity) {
      filtered = filterEventsByLocation(filtered, selectedCity);
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    // Filter by format
    if (selectedFormat === 'virtual') {
      filtered = filtered.filter(event => event.isVirtual);
    } else if (selectedFormat === 'in-person') {
      filtered = filtered.filter(event => !event.isVirtual);
    }

    // Filter by price
    if (selectedPrice === 'free') {
      filtered = filtered.filter(event => event.isFree);
    } else if (selectedPrice === 'paid') {
      filtered = filtered.filter(event => !event.isFree);
    }

    // Filter by date range
    const now = new Date();
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const oneMonthFromNow = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

    filtered = filtered.filter(event => {
      const eventDate = new Date(event.startDate);
      
      switch (dateRange) {
        case 'this-week':
          return eventDate >= now && eventDate <= oneWeekFromNow;
        case 'this-month':
          return eventDate >= now && eventDate <= oneMonthFromNow;
        case 'upcoming':
        default:
          return isEventUpcoming(event.startDate);
      }
    });

    // Sort by date (upcoming first) and featured status
    filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(a.startDate) - new Date(b.startDate);
    });

    setFilteredEvents(filtered);
  };

  const handleLocationSelect = (cityId) => {
    setSelectedCity(cityId);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedFormat('');
    setSelectedPrice('');
    setDateRange('upcoming');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedCategory) count++;
    if (selectedFormat) count++;
    if (selectedPrice) count++;
    if (dateRange !== 'upcoming') count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <span>→</span>
            <span className="text-gray-800">Psychology Events</span>
          </nav>

          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              📅 Psychology Events Near You
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-6">
              Discover conferences, workshops, training sessions, and networking events 
              across the UK psychology community. Connect, learn, and grow your professional network.
            </p>
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 max-w-3xl mx-auto">
              <p className="text-yellow-800">
                <span className="font-medium">🚧 Beta Feature:</span> This events aggregator combines curated listings 
                with publicly available information. Always verify details on the organiser's website.
              </p>
            </div>
          </div>
        </div>

        {/* Location Selector */}
        <LocationSelector
          cities={UK_CITIES}
          selectedCity={selectedCity}
          onCitySelect={handleLocationSelect}
          userLocation={userLocation}
        />

        {/* Event Source Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'curated', label: 'Curated Events', icon: '⭐' },
                { id: 'university', label: 'University Events', icon: '🎓' },
                { id: 'organizations', label: 'Organizations', icon: '🏢' },
                { id: 'external', label: 'External Search', icon: '🔍' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Filters */}
        {activeTab !== 'external' && (
          <EventFilters
            categories={EVENT_CATEGORIES}
            selectedCategory={selectedCategory}
            selectedFormat={selectedFormat}
            selectedPrice={selectedPrice}
            dateRange={dateRange}
            onCategoryChange={setSelectedCategory}
            onFormatChange={setSelectedFormat}
            onPriceChange={setSelectedPrice}
            onDateRangeChange={setDateRange}
            onClearFilters={clearFilters}
            activeFiltersCount={getActiveFiltersCount()}
          />
        )}

        {/* Content based on active tab */}
        {activeTab === 'external' ? (
          <ExternalSearchLinks
            selectedCity={selectedCity}
            cities={UK_CITIES}
            organizationLinks={ORGANIZATION_LINKS}
            generateEventbriteLink={generateEventbriteLink}
            generateMeetupLink={generateMeetupLink}
          />
        ) : (
          <div className="space-y-6">
            {/* Results Summary */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-2 sm:mb-0">
                  <span className="text-gray-600">
                    {loading ? 'Loading...' : `${filteredEvents.length} events found`}
                  </span>
                  {selectedCity && (
                    <span className="text-gray-500 ml-2">
                      near {UK_CITIES.find(c => c.id === selectedCity)?.name}
                    </span>
                  )}
                </div>
                
                {getActiveFiltersCount() > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear {getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''}
                  </button>
                )}
              </div>
            </div>

            {/* Events List */}
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
                    <div className="h-4 bg-gray-300 rounded mb-4"></div>
                    <div className="h-6 bg-gray-300 rounded mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-4"></div>
                    <div className="h-8 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
            ) : filteredEvents.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    categories={EVENT_CATEGORIES}
                    userCity={selectedCity}
                    cities={UK_CITIES}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  No events found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or location to find more events.
                </p>
                <div className="space-y-2">
                  <button
                    onClick={clearFilters}
                    className="block w-full sm:w-auto sm:inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition mx-auto"
                  >
                    Clear All Filters
                  </button>
                  <button
                    onClick={() => setActiveTab('external')}
                    className="block w-full sm:w-auto sm:inline-block px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition mx-auto sm:ml-3"
                  >
                    Search External Sites
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            📚 Event Resources & Tips
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">🎯 For Students</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Attend free university seminars</li>
                <li>• Join student psychology societies</li>
                <li>• Network at careers fairs</li>
                <li>• Participate in research conferences</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">💼 For Professionals</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Maintain CPD requirements</li>
                <li>• Attend specialist training</li>
                <li>• Join professional networks</li>
                <li>• Present your research</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">🎓 For Applicants</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Show commitment to field</li>
                <li>• Gain current knowledge</li>
                <li>• Meet potential supervisors</li>
                <li>• Build professional portfolio</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;