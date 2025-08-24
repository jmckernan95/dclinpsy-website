/**
 * Event Card Component
 * Individual event display with all details and actions
 */

import React from 'react';
import { formatEventDate, calculateDistance } from '../../data/events-data';

const EventCard = ({ event, categories, userCity, cities }) => {
  const category = categories.find(cat => cat.id === event.category);
  const userCityData = cities.find(c => c.id === userCity);
  
  // Calculate distance if both locations have coordinates
  const getDistance = () => {
    if (!event.coordinates || !userCityData?.coordinates) return null;
    
    const distance = calculateDistance(
      userCityData.coordinates.lat,
      userCityData.coordinates.lng,
      event.coordinates.lat,
      event.coordinates.lng
    );
    
    return Math.round(distance);
  };

  const distance = getDistance();

  const handleSaveToCalendar = () => {
    const startDate = new Date(`${event.startDate}T${event.time || '09:00'}`);
    const endDate = event.endDate 
      ? new Date(`${event.endDate}T${event.time ? 
          `${parseInt(event.time.split(':')[0]) + 1}:${event.time.split(':')[1]}` : '17:00'}`
        )
      : new Date(startDate.getTime() + 3 * 60 * 60 * 1000); // Default 3-hour duration

    const formatDateForCalendar = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${formatDateForCalendar(startDate)}/${formatDateForCalendar(endDate)}&details=${encodeURIComponent(`${event.description}\n\nOrganised by: ${event.organization}\n\nMore info: ${event.link}`)}&location=${encodeURIComponent(`${event.venue || ''}, ${event.location}`)}`;
    
    window.open(calendarUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `${event.description}\n\nDate: ${formatEventDate(event.startDate)}\nLocation: ${event.location}`,
        url: event.link
      }).catch(err => console.log('Error sharing:', err));
    } else {
      // Fallback: copy to clipboard
      const shareText = `${event.title}\n\n${event.description}\n\nDate: ${formatEventDate(event.startDate)}\nLocation: ${event.location}\n\nMore info: ${event.link}`;
      
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText).then(() => {
          alert('Event details copied to clipboard!');
        });
      }
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden ${
      event.featured ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''
    }`}>
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            {category && (
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>
                <span className="mr-1">{category.icon}</span>
                {category.name}
              </span>
            )}
            {event.featured && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                ⭐ Featured
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            {/* Format badges */}
            {event.isVirtual && (
              <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                💻 Virtual
              </span>
            )}
            {event.isHybrid && (
              <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-purple-100 text-purple-800">
                🔗 Hybrid
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 leading-tight line-clamp-2">
          {event.title}
        </h3>

        {/* Date and Location */}
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <span className="mr-2">📅</span>
            <span className="font-medium">{formatEventDate(event.startDate)}</span>
            {event.time && (
              <span className="ml-2 text-gray-500">at {event.time}</span>
            )}
          </div>
          
          <div className="flex items-center">
            <span className="mr-2">{event.isVirtual ? '💻' : '📍'}</span>
            <span>
              {event.isVirtual ? 'Online Event' : event.venue || event.location}
              {!event.isVirtual && event.location && event.venue && (
                <span className="text-gray-500">, {event.location}</span>
              )}
            </span>
            {distance && !event.isVirtual && (
              <span className="ml-2 text-gray-500">({distance} miles away)</span>
            )}
          </div>
          
          <div className="flex items-center">
            <span className="mr-2">🏢</span>
            <span className="text-gray-700">{event.organization}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
          {event.description}
        </p>

        {/* Price and Tags */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${
              event.isFree 
                ? 'bg-green-100 text-green-800' 
                : 'bg-orange-100 text-orange-800'
            }`}>
              {event.isFree ? '🆓 Free' : `💷 ${event.price}`}
            </span>
          </div>
          
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {event.tags.slice(0, 2).map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                >
                  {tag}
                </span>
              ))}
              {event.tags.length > 2 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                  +{event.tags.length - 2} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 pb-6">
        <div className="flex flex-col space-y-2">
          {/* Primary action - More Info */}
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-4 py-2 bg-blue-600 text-white text-center font-medium rounded-lg hover:bg-blue-700 transition"
          >
            More Information
          </a>
          
          {/* Secondary actions */}
          <div className="flex space-x-2">
            <button
              onClick={handleSaveToCalendar}
              className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 text-center text-sm font-medium rounded hover:bg-gray-200 transition"
              title="Add to Google Calendar"
            >
              📅 Save to Calendar
            </button>
            
            <button
              onClick={handleShare}
              className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 text-center text-sm font-medium rounded hover:bg-gray-200 transition"
              title="Share event"
            >
              📤 Share
            </button>
          </div>
        </div>
      </div>

      {/* Multi-day event indicator */}
      {event.endDate && event.endDate !== event.startDate && (
        <div className="px-6 pb-2">
          <div className="bg-blue-50 border border-blue-200 rounded p-2 text-sm text-blue-800">
            <span className="font-medium">Multi-day event:</span> {formatEventDate(event.startDate)} - {formatEventDate(event.endDate)}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCard;