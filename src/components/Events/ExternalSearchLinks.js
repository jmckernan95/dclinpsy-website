/**
 * External Search Links Component
 * Provides smart links to external event platforms and organizations
 */

import React from 'react';

const ExternalSearchLinks = ({ 
  selectedCity, 
  cities, 
  organizationLinks, 
  generateEventbriteLink, 
  generateMeetupLink 
}) => {
  const selectedCityData = cities.find(c => c.id === selectedCity);
  
  const searchPlatforms = [
    {
      name: 'Eventbrite',
      description: 'Popular event platform with psychology, mental health, and professional development events',
      icon: '🎫',
      color: 'bg-orange-100 text-orange-800',
      getLink: () => generateEventbriteLink(selectedCity),
      keywords: ['psychology', 'mental health', 'clinical', 'therapy', 'counselling']
    },
    {
      name: 'Meetup',
      description: 'Local psychology groups, support networks, and professional meetups',
      icon: '👥',
      color: 'bg-red-100 text-red-800',
      getLink: () => generateMeetupLink(selectedCity),
      keywords: ['psychology groups', 'support networks', 'professional meetups']
    },
    {
      name: 'Facebook Events',
      description: 'Local psychology events, university societies, and community groups',
      icon: '👥',
      color: 'bg-blue-100 text-blue-800',
      getLink: () => `https://www.facebook.com/events/search/?q=psychology%20${selectedCityData?.name || 'UK'}`,
      keywords: ['local events', 'university societies', 'community groups']
    },
    {
      name: 'LinkedIn Events',
      description: 'Professional psychology networking events and career development',
      icon: '💼',
      color: 'bg-blue-100 text-blue-800',
      getLink: () => `https://www.linkedin.com/events/search/?keywords=psychology&location=${selectedCityData?.name || 'United Kingdom'}`,
      keywords: ['professional networking', 'career development', 'business events']
    }
  ];

  const universityResources = [
    {
      name: 'University Psychology Departments',
      description: 'Most UK universities host regular seminars, guest lectures, and research presentations',
      icon: '🎓',
      links: [
        { name: 'Cambridge Psychology', url: 'https://www.psychol.cam.ac.uk/seminars' },
        { name: 'Oxford Psychology', url: 'https://www.psy.ox.ac.uk/news-and-events/events' },
        { name: 'UCL Psychology', url: 'https://www.ucl.ac.uk/psychology/events' },
        { name: 'Edinburgh Psychology', url: 'https://www.ed.ac.uk/psychology/events' },
        { name: 'Manchester Psychology', url: 'https://www.manchester.ac.uk/psychology/events' }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Location Context */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-2xl">🔍</span>
          <div>
            <h3 className="text-lg font-semibold text-blue-800">
              External Event Search
            </h3>
            <p className="text-blue-700">
              {selectedCity 
                ? `Search for psychology events near ${selectedCityData?.name}`
                : 'Search for psychology events across the UK'
              }
            </p>
          </div>
        </div>
        
        {!selectedCity && (
          <div className="bg-yellow-100 border border-yellow-300 rounded p-3 text-sm text-yellow-800">
            💡 <strong>Tip:</strong> Select a location above for more targeted search results.
          </div>
        )}
      </div>

      {/* Event Search Platforms */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          🎪 Event Platforms
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          {searchPlatforms.map((platform, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${platform.color}`}>
                  <span className="text-2xl">{platform.icon}</span>
                </div>
                
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    {platform.name}
                  </h4>
                  <p className="text-gray-600 mb-4">
                    {platform.description}
                  </p>
                  
                  <div className="mb-4">
                    <div className="text-sm text-gray-500 mb-2">Search terms:</div>
                    <div className="flex flex-wrap gap-1">
                      {platform.keywords.map((keyword, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <a
                    href={platform.getLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                  >
                    Search on {platform.name}
                    <span className="ml-2">🔗</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Professional Organizations */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          🏢 Professional Organizations
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(organizationLinks).map(([key, org]) => (
            <div key={key} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
              <div className="text-center">
                <div className="text-3xl mb-3">🏢</div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  {org.name}
                </h4>
                <p className="text-gray-600 mb-4 text-sm">
                  {org.description}
                </p>
                <a
                  href={org.eventsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
                >
                  View Events
                  <span className="ml-2">🔗</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* University Resources */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          🎓 University Psychology Departments
        </h3>
        {universityResources.map((resource, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-start space-x-4 mb-6">
              <div className="p-3 rounded-lg bg-purple-100 text-purple-800">
                <span className="text-2xl">{resource.icon}</span>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  {resource.name}
                </h4>
                <p className="text-gray-600">
                  {resource.description}
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resource.links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition"
                >
                  <span className="font-medium text-gray-800">{link.name}</span>
                  <span className="text-blue-600">🔗</span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Search Tips */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-800 mb-4">
          💡 Search Tips for Better Results
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-green-800 mb-2">Effective Keywords:</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• "clinical psychology" + your specialty</li>
              <li>• "mental health training"</li>
              <li>• "psychology conference" + year</li>
              <li>• "CBT workshop" or "therapy training"</li>
              <li>• "psychology CPD" for continuing education</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-green-800 mb-2">What to Look For:</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Accreditation and CPD points</li>
              <li>• Speaker credentials and expertise</li>
              <li>• Certificate of attendance offered</li>
              <li>• Early bird discounts available</li>
              <li>• Virtual attendance options</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Event Submission Call-to-Action */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <div className="text-4xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Know of an Event We're Missing?
        </h3>
        <p className="text-gray-600 mb-4">
          Help us build a comprehensive directory of psychology events across the UK.
        </p>
        <a
          href="mailto:help@example.com?subject=Event Submission - DClinPsy Prep Hub&body=Event Title:%0D%0ADate:%0D%0ALocation:%0D%0AOrganizer:%0D%0ADescription:%0D%0ALink:"
          className="inline-flex items-center px-6 py-3 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition"
        >
          Submit an Event
          <span className="ml-2">📤</span>
        </a>
      </div>
    </div>
  );
};

export default ExternalSearchLinks;