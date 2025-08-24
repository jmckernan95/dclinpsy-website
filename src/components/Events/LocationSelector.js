/**
 * Location Selector Component
 * Allows users to select their city to find nearby events
 */

import React, { useState, useEffect } from 'react';

const LocationSelector = ({ cities, selectedCity, onCitySelect, userLocation }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [detectedLocation, setDetectedLocation] = useState(null);

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group cities by region
  const groupedCities = filteredCities.reduce((acc, city) => {
    if (!acc[city.region]) {
      acc[city.region] = [];
    }
    acc[city.region].push(city);
    return acc;
  }, {});

  // Get user's location
  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setDetectedLocation({ lat: latitude, lng: longitude });
          
          // Find nearest city
          const nearestCity = findNearestCity(latitude, longitude);
          if (nearestCity) {
            onCitySelect(nearestCity.id);
            setDetectedLocation({ ...detectedLocation, city: nearestCity.name });
          }
        },
        (error) => {
          console.log('Location access denied or error:', error);
        }
      );
    }
  };

  const findNearestCity = (lat, lng) => {
    let minDistance = Infinity;
    let nearestCity = null;

    cities.forEach(city => {
      if (city.coordinates) {
        const distance = calculateDistance(lat, lng, city.coordinates.lat, city.coordinates.lng);
        if (distance < minDistance) {
          minDistance = distance;
          nearestCity = city;
        }
      }
    });

    return nearestCity;
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3958.756; // Radius of Earth in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const selectedCityData = cities.find(city => city.id === selectedCity);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            📍 Find Events Near You
          </h2>
          <p className="text-gray-600">
            Select your location to discover psychology events in your area
          </p>
        </div>
        
        <button
          onClick={requestLocation}
          className="mt-4 md:mt-0 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm font-medium"
        >
          🎯 Use My Location
        </button>
      </div>

      {/* Current Selection Display */}
      {selectedCity ? (
        <div className="mb-6">
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="text-green-600 text-xl">✅</div>
              <div>
                <div className="font-medium text-green-800">
                  {selectedCityData?.name}
                </div>
                <div className="text-sm text-green-600">
                  {selectedCityData?.region}
                </div>
              </div>
              {detectedLocation && detectedLocation.city === selectedCityData?.name && (
                <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Auto-detected
                </div>
              )}
            </div>
            <button
              onClick={() => onCitySelect('')}
              className="text-green-600 hover:text-green-800 text-sm font-medium"
            >
              Change
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="text-gray-400 text-xl">📍</div>
            <div>
              <div className="font-medium text-gray-700">No location selected</div>
              <div className="text-sm text-gray-500">
                Events from all UK locations will be shown
              </div>
            </div>
          </div>
        </div>
      )}

      {/* City Selection */}
      {(!selectedCity || isExpanded) && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search cities or regions..."
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">🔍</span>
            </div>
          </div>

          {/* Popular Cities Quick Select */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Popular Cities</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {['london', 'manchester', 'birmingham', 'edinburgh', 'cardiff', 'bristol'].map(cityId => {
                const city = cities.find(c => c.id === cityId);
                if (!city) return null;
                
                return (
                  <button
                    key={cityId}
                    onClick={() => {
                      onCitySelect(cityId);
                      setIsExpanded(false);
                    }}
                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition text-center"
                  >
                    {city.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* All Cities Grouped by Region */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">All Cities</h4>
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
              {Object.entries(groupedCities).map(([region, regionCities]) => (
                <div key={region}>
                  <div className="sticky top-0 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-200">
                    {region}
                  </div>
                  {regionCities.map(city => (
                    <button
                      key={city.id}
                      onClick={() => {
                        onCitySelect(city.id);
                        setIsExpanded(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition"
                    >
                      <div className="font-medium text-gray-800">{city.name}</div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {selectedCity && (
            <div className="flex justify-center">
              <button
                onClick={() => setIsExpanded(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium"
              >
                Collapse Selection
              </button>
            </div>
          )}
        </div>
      )}

      {selectedCity && !isExpanded && (
        <div className="flex justify-center">
          <button
            onClick={() => setIsExpanded(true)}
            className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Change Location
          </button>
        </div>
      )}

      {/* Location Privacy Note */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
        <span className="font-medium">🔒 Privacy:</span> Your location preference is stored locally on your device 
        and is not shared with any external services.
      </div>
    </div>
  );
};

export default LocationSelector;