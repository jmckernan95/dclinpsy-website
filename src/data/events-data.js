/**
 * Psychology Events Data
 * Curated events, RSS feeds, and external sources for UK psychology community
 */

// Major UK cities for location selection
export const UK_CITIES = [
  { id: 'london', name: 'London', region: 'Greater London', coordinates: { lat: 51.5074, lng: -0.1278 } },
  { id: 'manchester', name: 'Manchester', region: 'Greater Manchester', coordinates: { lat: 53.4808, lng: -2.2426 } },
  { id: 'birmingham', name: 'Birmingham', region: 'West Midlands', coordinates: { lat: 52.4862, lng: -1.8904 } },
  { id: 'edinburgh', name: 'Edinburgh', region: 'Scotland', coordinates: { lat: 55.9533, lng: -3.1883 } },
  { id: 'cardiff', name: 'Cardiff', region: 'Wales', coordinates: { lat: 51.4816, lng: -3.1791 } },
  { id: 'bristol', name: 'Bristol', region: 'South West England', coordinates: { lat: 51.4545, lng: -2.5879 } },
  { id: 'leeds', name: 'Leeds', region: 'West Yorkshire', coordinates: { lat: 53.8008, lng: -1.5491 } },
  { id: 'liverpool', name: 'Liverpool', region: 'Merseyside', coordinates: { lat: 53.4084, lng: -2.9916 } },
  { id: 'newcastle', name: 'Newcastle upon Tyne', region: 'North East England', coordinates: { lat: 54.9783, lng: -1.6178 } },
  { id: 'glasgow', name: 'Glasgow', region: 'Scotland', coordinates: { lat: 55.8642, lng: -4.2518 } },
  { id: 'sheffield', name: 'Sheffield', region: 'South Yorkshire', coordinates: { lat: 53.3811, lng: -1.4701 } },
  { id: 'nottingham', name: 'Nottingham', region: 'Nottinghamshire', coordinates: { lat: 52.9548, lng: -1.1581 } },
  { id: 'coventry', name: 'Coventry', region: 'West Midlands', coordinates: { lat: 52.4068, lng: -1.5197 } },
  { id: 'leicester', name: 'Leicester', region: 'Leicestershire', coordinates: { lat: 52.6369, lng: -1.1398 } },
  { id: 'southampton', name: 'Southampton', region: 'Hampshire', coordinates: { lat: 50.9097, lng: -1.4044 } },
  { id: 'brighton', name: 'Brighton', region: 'East Sussex', coordinates: { lat: 50.8225, lng: -0.1372 } }
];

// Event categories
export const EVENT_CATEGORIES = [
  { id: 'conference', name: 'Conference', icon: '🎪', color: 'bg-blue-100 text-blue-800' },
  { id: 'lecture', name: 'Lecture', icon: '📚', color: 'bg-green-100 text-green-800' },
  { id: 'workshop', name: 'Workshop', icon: '🔨', color: 'bg-purple-100 text-purple-800' },
  { id: 'seminar', name: 'Seminar', icon: '💡', color: 'bg-orange-100 text-orange-800' },
  { id: 'training', name: 'Training', icon: '🎯', color: 'bg-red-100 text-red-800' },
  { id: 'support', name: 'Support Group', icon: '🤝', color: 'bg-pink-100 text-pink-800' },
  { id: 'career', name: 'Career Event', icon: '💼', color: 'bg-indigo-100 text-indigo-800' },
  { id: 'student', name: 'Student Event', icon: '🎓', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'cpd', name: 'CPD', icon: '📈', color: 'bg-teal-100 text-teal-800' },
  { id: 'book', name: 'Book Launch', icon: '📖', color: 'bg-gray-100 text-gray-800' }
];

// Curated major psychology events
export const curatedEvents = [
  {
    id: 1,
    title: "BPS Annual Conference 2024",
    startDate: "2024-07-10",
    endDate: "2024-07-12",
    time: "09:00",
    location: "Brighton",
    venue: "Brighton Centre",
    category: "conference",
    description: "The British Psychological Society's flagship annual conference featuring keynote speakers, research presentations, and networking opportunities across all areas of psychology. Join leading psychologists, researchers, and practitioners for three days of cutting-edge science and professional development.",
    link: "https://www.bps.org.uk/events/annual-conference",
    organization: "British Psychological Society",
    isVirtual: false,
    isHybrid: true,
    isFree: false,
    price: "£245-£395",
    coordinates: { lat: 50.8225, lng: -0.1372 },
    tags: ['research', 'networking', 'professional-development', 'all-areas'],
    featured: true
  },
  {
    id: 2,
    title: "Mental Health First Aid Training",
    startDate: "2024-06-15",
    endDate: "2024-06-15",
    time: "09:30",
    location: "London",
    venue: "UCL Psychology Department",
    category: "training",
    description: "Comprehensive Mental Health First Aid training accredited by Mental Health First Aid England. Learn to recognise signs of mental health issues, provide initial support, and guide people towards appropriate help.",
    link: "https://mhfaengland.org/",
    organization: "Mental Health First Aid England",
    isVirtual: false,
    isHybrid: false,
    isFree: false,
    price: "£200",
    coordinates: { lat: 51.5074, lng: -0.1278 },
    tags: ['training', 'mental-health', 'certification', 'support'],
    featured: false
  },
  {
    id: 3,
    title: "Clinical Psychology Research Methods Workshop",
    startDate: "2024-06-20",
    endDate: "2024-06-20",
    time: "10:00",
    location: "Edinburgh",
    venue: "University of Edinburgh",
    category: "workshop",
    description: "Intensive workshop on advanced research methods in clinical psychology, including mixed methods approaches, single-case experimental designs, and systematic reviews. Suitable for researchers, practitioners, and doctoral students.",
    link: "https://www.ed.ac.uk/psychology",
    organization: "University of Edinburgh",
    isVirtual: false,
    isHybrid: true,
    isFree: true,
    price: "Free",
    coordinates: { lat: 55.9533, lng: -3.1883 },
    tags: ['research-methods', 'clinical', 'university', 'students'],
    featured: true
  },
  {
    id: 4,
    title: "Cognitive Behavioural Therapy: Latest Developments",
    startDate: "2024-07-05",
    endDate: "2024-07-05",
    time: "14:00",
    location: "Manchester",
    venue: "Manchester University",
    category: "seminar",
    description: "Professional seminar exploring recent advances in CBT techniques, third-wave therapies, and digital CBT interventions. Includes case study presentations and interactive discussions.",
    link: "https://www.manchester.ac.uk/psychology",
    organization: "University of Manchester",
    isVirtual: false,
    isHybrid: false,
    isFree: false,
    price: "£85",
    coordinates: { lat: 53.4808, lng: -2.2426 },
    tags: ['cbt', 'therapy', 'clinical', 'continuing-education'],
    featured: false
  },
  {
    id: 5,
    title: "Psychology Careers Fair 2024",
    startDate: "2024-06-30",
    endDate: "2024-06-30",
    time: "11:00",
    location: "Birmingham",
    venue: "Birmingham Conference Centre",
    category: "career",
    description: "Annual careers fair for psychology students and graduates. Meet employers from NHS trusts, private practice, research institutions, and third sector organisations. Includes CV workshops and mock interviews.",
    link: "https://www.psychologycareersfair.co.uk",
    organization: "Psychology Careers Network",
    isVirtual: false,
    isHybrid: false,
    isFree: true,
    price: "Free",
    coordinates: { lat: 52.4862, lng: -1.8904 },
    tags: ['careers', 'students', 'networking', 'employment'],
    featured: true
  },
  {
    id: 6,
    title: "Psychological Trauma and PTSD: New Approaches",
    startDate: "2024-07-18",
    endDate: "2024-07-19",
    time: "09:00",
    location: "London",
    venue: "Royal College of Physicians",
    category: "training",
    description: "Two-day intensive training on evidence-based approaches to trauma treatment, including EMDR, trauma-focused CBT, and narrative therapy. Suitable for qualified practitioners and advanced trainees.",
    link: "https://www.trauma-training.org.uk",
    organization: "UK Trauma Training Institute",
    isVirtual: false,
    isHybrid: true,
    isFree: false,
    price: "£450",
    coordinates: { lat: 51.5074, lng: -0.1278 },
    tags: ['trauma', 'ptsd', 'therapy', 'advanced-training'],
    featured: false
  },
  {
    id: 7,
    title: "Digital Mental Health: Technology in Practice",
    startDate: "2024-08-10",
    endDate: "2024-08-10",
    time: "13:00",
    location: "Virtual",
    venue: "Online Platform",
    category: "seminar",
    description: "Virtual seminar exploring the role of technology in mental health care, including apps, AI, and virtual reality applications. Discussions on ethics, effectiveness, and future directions.",
    link: "https://www.digitalmentalhealth.org.uk",
    organization: "Digital Mental Health Network",
    isVirtual: true,
    isHybrid: false,
    isFree: true,
    price: "Free",
    coordinates: null,
    tags: ['digital-health', 'technology', 'innovation', 'virtual'],
    featured: true
  },
  {
    id: 8,
    title: "Neuropsychology Assessment Workshop",
    startDate: "2024-07-25",
    endDate: "2024-07-25",
    time: "10:00",
    location: "Leeds",
    venue: "Leeds University Psychology Department",
    category: "workshop",
    description: "Practical workshop on neuropsychological assessment techniques, test interpretation, and report writing. Hands-on experience with common assessment tools and case study reviews.",
    link: "https://www.leeds.ac.uk/psychology",
    organization: "University of Leeds",
    isVirtual: false,
    isHybrid: false,
    isFree: false,
    price: "£150",
    coordinates: { lat: 53.8008, lng: -1.5491 },
    tags: ['neuropsychology', 'assessment', 'practical', 'clinical'],
    featured: false
  }
];

// University RSS feeds by city
export const UNIVERSITY_RSS_FEEDS = {
  london: [
    {
      name: 'UCL Psychology Events',
      url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.ucl.ac.uk/psychology/events/rss',
      fallback: 'https://www.ucl.ac.uk/psychology/events'
    },
    {
      name: 'King\'s College London Psychology',
      url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.kcl.ac.uk/psychology/events/rss',
      fallback: 'https://www.kcl.ac.uk/psychology/events'
    },
    {
      name: 'Imperial College Psychology',
      url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.imperial.ac.uk/psychology/events/rss',
      fallback: 'https://www.imperial.ac.uk/psychology/events'
    }
  ],
  manchester: [
    {
      name: 'University of Manchester Psychology',
      url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.manchester.ac.uk/psychology/events/rss',
      fallback: 'https://www.manchester.ac.uk/psychology/events'
    }
  ],
  birmingham: [
    {
      name: 'University of Birmingham Psychology',
      url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.birmingham.ac.uk/psychology/events/rss',
      fallback: 'https://www.birmingham.ac.uk/psychology/events'
    }
  ],
  edinburgh: [
    {
      name: 'University of Edinburgh Psychology',
      url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.ed.ac.uk/psychology/events/rss',
      fallback: 'https://www.ed.ac.uk/psychology/events'
    }
  ],
  cardiff: [
    {
      name: 'Cardiff University Psychology',
      url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.cardiff.ac.uk/psychology/events/rss',
      fallback: 'https://www.cardiff.ac.uk/psychology/events'
    }
  ],
  leeds: [
    {
      name: 'University of Leeds Psychology',
      url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.leeds.ac.uk/psychology/events/rss',
      fallback: 'https://www.leeds.ac.uk/psychology/events'
    }
  ]
};

// External search link generators
export const generateEventbriteLink = (city, keywords = 'psychology mental health clinical') => {
  const cityName = UK_CITIES.find(c => c.id === city)?.name || city;
  return `https://www.eventbrite.co.uk/d/united-kingdom--${cityName.toLowerCase()}/events/?q=${encodeURIComponent(keywords)}&mode=search`;
};

export const generateMeetupLink = (city) => {
  const cityName = UK_CITIES.find(c => c.id === city)?.name || city;
  return `https://www.meetup.com/find/?keywords=psychology&location=gb--${cityName.toLowerCase()}`;
};

// Organization event pages
export const ORGANIZATION_LINKS = {
  bps: {
    name: 'British Psychological Society',
    eventsUrl: 'https://www.bps.org.uk/events',
    description: 'Professional conferences, training, and CPD events'
  },
  mind: {
    name: 'Mind',
    eventsUrl: 'https://www.mind.org.uk/get-involved/events/',
    description: 'Mental health awareness and fundraising events'
  },
  samaritans: {
    name: 'Samaritans',
    eventsUrl: 'https://www.samaritans.org/support-us/events/',
    description: 'Volunteer training and community events'
  },
  mentalHealthFoundation: {
    name: 'Mental Health Foundation',
    eventsUrl: 'https://www.mentalhealth.org.uk/events',
    description: 'Research events and awareness campaigns'
  },
  nhsEngland: {
    name: 'NHS England Psychology',
    eventsUrl: 'https://www.england.nhs.uk/mental-health/adults/iapt/events/',
    description: 'NHS psychology service events and training'
  }
};

// Utility functions
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 3958.756; // Radius of Earth in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const formatEventDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const eventDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  const diffDays = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 0 && diffDays <= 7) return `In ${diffDays} days`;
  if (diffDays < 0 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;
  
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};

export const isEventUpcoming = (dateString) => {
  const eventDate = new Date(dateString);
  const now = new Date();
  return eventDate >= now;
};

export const filterEventsByLocation = (events, userCity, maxDistance = 50) => {
  if (!userCity) return events;
  
  const userCityData = UK_CITIES.find(c => c.id === userCity);
  if (!userCityData) return events;
  
  return events.filter(event => {
    if (event.isVirtual) return true; // Always include virtual events
    if (event.location.toLowerCase() === userCityData.name.toLowerCase()) return true;
    
    if (event.coordinates && userCityData.coordinates) {
      const distance = calculateDistance(
        userCityData.coordinates.lat,
        userCityData.coordinates.lng,
        event.coordinates.lat,
        event.coordinates.lng
      );
      return distance <= maxDistance;
    }
    
    return false;
  });
};

export default {
  UK_CITIES,
  EVENT_CATEGORIES,
  curatedEvents,
  UNIVERSITY_RSS_FEEDS,
  ORGANIZATION_LINKS,
  generateEventbriteLink,
  generateMeetupLink,
  calculateDistance,
  formatEventDate,
  isEventUpcoming,
  filterEventsByLocation
};