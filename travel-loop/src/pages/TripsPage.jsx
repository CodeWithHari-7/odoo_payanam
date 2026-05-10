import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowLeft, Navigation, Calendar, Sparkles, Compass, Play, Crosshair, AlertCircle, Map } from 'lucide-react';
import './TripsPage.css';

// --- MOCK DATABASE ---
const mockTripData = {
  japan: {
    heroImage: 'https://images.unsplash.com/photo-1542051812-09c735237887?auto=format&fit=crop&q=80&w=2000',
    days: [
      {
        title: "Day 1: Arrival & Exploring Shinjuku",
        date: "Oct 5, 2026",
        activities: [
          { time: "02:00 PM", title: "Arrive at Narita Airport", desc: "Take the Narita Express directly to Shinjuku Station. Grab Suica cards.", location: "Narita International Airport" },
          { time: "04:30 PM", title: "Check-in at Hotel Gracery", desc: "Settle into rooms, freshen up after the long flight. Relax for an hour.", location: "Hotel Gracery Shinjuku" },
          { time: "07:00 PM", title: "Dinner at Omoide Yokocho", desc: "Experience classic Japanese street food in Memory Lane. Try Yakitori.", location: "Shinjuku City" }
        ]
      },
      {
        title: "Day 2: Culture & Crossing",
        date: "Oct 6, 2026",
        activities: [
          { time: "09:00 AM", title: "Meiji Shrine", desc: "Walk through the forested park to experience Tokyo's most famous Shinto shrine.", location: "Shibuya City" },
          { time: "12:30 PM", title: "Shibuya Scramble & Lunch", desc: "Cross the busiest intersection in the world. Sushi lunch at Uobei nearby.", location: "Shibuya Crossing" }
        ]
      }
    ],
    recommendations: [
      { title: "Kyoto Bullet Train Day Trip (Guided)", match: "98% Match", price: "120", image: "https://images.unsplash.com/photo-1502602220436-dbf281ce100a?auto=format&fit=crop&q=80&w=600", type: "play" },
      { title: "Best Hidden Ramen Spots in Shinjuku", match: "Local Guide • 4.9 ★", price: "45", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=600", type: "compass" },
      { title: "Mount Fuji Panoramic Ropeway Experience", match: "Trending • Book Fast", price: "85", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600", type: "compass" },
      { title: "teamLab Planets Tokyo Interactive Exhibit", match: "Must See • 4.8 ★", price: "35", image: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&q=80&w=600", type: "compass" }
    ]
  },
  france: {
    heroImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=2000',
    days: [
      {
        title: "Day 1: Bonjour Paris",
        date: "Nov 12, 2026",
        activities: [
          { time: "11:00 AM", title: "Arrive at CDG Airport", desc: "Take the RER B train into central Paris. Buy a Navigo pass.", location: "Charles de Gaulle Airport" },
          { time: "02:00 PM", title: "Check-in at Le Meurice", desc: "Drop off bags and enjoy the view of the Tuileries Garden.", location: "1st Arrondissement" },
          { time: "05:30 PM", title: "Eiffel Tower Sunset", desc: "Head to Trocadéro for the best sunset view, then see the lights sparkle at 7 PM.", location: "Champ de Mars" }
        ]
      },
      {
        title: "Day 2: Art & History",
        date: "Nov 13, 2026",
        activities: [
          { time: "09:30 AM", title: "The Louvre Museum", desc: "Early entry to see the Mona Lisa and Winged Victory with fewer crowds.", location: "Musée du Louvre" },
          { time: "01:00 PM", title: "Café de Flore Lunch", desc: "Classic Parisian lunch in Saint-Germain-des-Prés.", location: "6th Arrondissement" }
        ]
      }
    ],
    recommendations: [
      { title: "Palace of Versailles Skip-the-Line", match: "Traveloop AI • 95% Match", price: "65", image: "https://images.unsplash.com/photo-1509305717900-84f40c786d82?auto=format&fit=crop&q=80&w=600", type: "play" },
      { title: "Seine River Dinner Cruise", match: "Romantic • 4.8 ★", price: "110", image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=600", type: "compass" },
      { title: "Montmartre Cheese & Wine Tasting", match: "Foodie Pick • 4.9 ★", price: "85", image: "https://images.unsplash.com/photo-1511690656956-5ea59f333333?auto=format&fit=crop&q=80&w=600", type: "compass" },
      { title: "Disneyland Paris 1-Day Ticket", match: "Family • Book Fast", price: "95", image: "https://images.unsplash.com/photo-1505996025642-12f5a0beed19?auto=format&fit=crop&q=80&w=600", type: "play" }
    ]
  },
  default: {
    heroImage: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=2000',
    days: [
      {
        title: "Day 1: Arrival & Relaxation",
        date: "Trip Start",
        activities: [
          { time: "03:00 PM", title: "Hotel Check-in", desc: "Arrive at your accommodation, unpack, and get settled in.", location: "City Center" },
          { time: "06:00 PM", title: "Explore Local Area", desc: "Take a walk around the neighborhood to get your bearings.", location: "Downtown" },
          { time: "08:00 PM", title: "Welcome Dinner", desc: "Enjoy a highly-rated local restaurant to start your trip right.", location: "Local Restaurant" }
        ]
      },
      {
        title: "Day 2: City Highlights",
        date: "Next Day",
        activities: [
          { time: "10:00 AM", title: "Main Attraction Visit", desc: "Visit the most famous landmark in the city.", location: "Historic Center" },
          { time: "02:00 PM", title: "Shopping & Cafes", desc: "Browse local boutiques and enjoy coffee culture.", location: "Shopping District" }
        ]
      }
    ],
    recommendations: [
      { title: "Guided City Walking Tour", match: "Traveloop AI • 90% Match", price: "35", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600", type: "compass" },
      { title: "Local Food Tasting Experience", match: "Foodie Pick • 4.7 ★", price: "60", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=600", type: "play" },
      { title: "Museum Fast-Track Pass", match: "Trending • Time Saver", price: "25", image: "https://images.unsplash.com/photo-1518998053401-a414909a1ccb?auto=format&fit=crop&q=80&w=600", type: "compass" },
      { title: "Sunset Boat Cruise", match: "Relaxing • 4.8 ★", price: "45", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=600", type: "compass" }
    ]
  }
};

function TripsPage() {
  const navigate = useNavigate();
  const [location, setLocation] = useState({ country: '', state: '', area: '' });
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loadingLoc, setLoadingLoc] = useState(false);
  const [showTrips, setShowTrips] = useState(false); // NEW STATE to toggle the itinerary

  // Derive the active trip data based on the country input
  const activeTripKey = useMemo(() => {
    const c = location.country.toLowerCase();
    if (c.includes('japan')) return 'japan';
    if (c.includes('france') || c.includes('paris')) return 'france';
    return 'default';
  }, [location.country]);

  const activeTrip = mockTripData[activeTripKey];

  // Debounced API fetch for suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if ((location.state || location.area) && !location.country) {
        setError('Please enter a Country first.');
        setSuggestions([]);
        return;
      } else {
        setError('');
      }

      if (!location.country && !location.state && !location.area) {
        setSuggestions([]);
        return;
      }

      setLoadingLoc(true);
      try {
        const params = new URLSearchParams();
        if (location.country) params.append('country', location.country);
        if (location.state) params.append('state', location.state);
        if (location.area) params.append('area', location.area);

        const res = await fetch(`http://localhost:5000/api/locations/suggest?${params.toString()}`);
        const data = await res.json();
        if (res.ok) {
          setSuggestions(data.slice(0, 5));
        }
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      } finally {
        setLoadingLoc(false);
      }
    };

    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 600);

    return () => clearTimeout(timer);
  }, [location.country, location.state, location.area]);

  const handleLocationChange = (e) => {
    setLocation({ ...location, [e.target.name]: e.target.value });
  };

  const selectSuggestion = (sug) => {
    const addr = sug.address || {};
    setLocation({
      country: addr.country || location.country,
      state: addr.state || addr.region || location.state,
      area: addr.city || addr.town || addr.village || addr.suburb || location.area
    });
    setSuggestions([]);
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoadingLoc(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await fetch(`http://localhost:5000/api/locations/reverse?lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        
        if (data.address) {
          setLocation({
            country: data.address.country || '',
            state: data.address.state || data.address.region || '',
            area: data.address.city || data.address.town || data.address.village || data.address.county || ''
          });
          setError('');
        } else {
          setError('Could not identify current location details.');
        }
      } catch (err) {
        setError('Failed to fetch current location details from API');
      } finally {
        setLoadingLoc(false);
      }
    }, () => {
      setError('Unable to retrieve your location. Please check browser permissions.');
      setLoadingLoc(false);
    });
  };

  const handleSelectDestination = () => {
    if (!location.country) {
      setError("Please select or enter a Country first.");
      return;
    }
    setShowTrips(true);
    // Smooth scroll down to the suggestions
    setTimeout(() => {
      window.scrollTo({ top: window.innerHeight - 80, behavior: 'smooth' });
    }, 150);
  };

  const handleSaveLocation = () => {
    if (!location.country) {
      setError("Please select or enter a location to save.");
      return;
    }
    localStorage.setItem('savedTripLocation', JSON.stringify(location));
    navigate('/dashboard');
  };

  return (
    <div className="trips-page-container">
      {/* Header */}
      <header className="trips-header">
        <h1><Navigation size={26} color="#0284c7" fill="#0284c7" /> Traveloop Plan</h1>
      </header>

      {/* Cinematic Trip Hero Banner with Location Setter */}
      <div className="trip-hero">
        <motion.div 
          key={activeTripKey} /* Forces re-animation when background changes */
          className="trip-hero-bg"
          style={{ backgroundImage: `url(${activeTrip.heroImage})` }}
          initial={{ scale: 1.1, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <div className="trip-hero-overlay"></div>
        <div className="trip-hero-content">
          
          {/* LOCATION SETTER UI */}
          <motion.div 
            className="location-setter-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="location-setter-header">
              <h2><Map size={28} /> Set Your Destination</h2>
              <div className="header-actions" style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn-current-location" onClick={useCurrentLocation} disabled={loadingLoc}>
                  <Crosshair size={18} /> {loadingLoc ? 'Locating...' : 'Use Current Location'}
                </button>
                <button 
                  className="btn-current-location" 
                  style={{ background: '#38BDF8', color: '#0B1020', border: 'none', fontWeight: 'bold' }} 
                  onClick={handleSaveLocation}
                >
                  Save Trip
                </button>
              </div>
            </div>

            <div className="location-inputs-wrapper">
              <div className="location-inputs">
                <div className="loc-input-group">
                  <label>Country *</label>
                  <input 
                    type="text" 
                    name="country" 
                    placeholder="e.g. Japan" 
                    value={location.country}
                    onChange={handleLocationChange}
                  />
                </div>
                <div className="loc-input-group">
                  <label>State / Region</label>
                  <input 
                    type="text" 
                    name="state" 
                    placeholder="e.g. Tokyo" 
                    value={location.state}
                    onChange={handleLocationChange}
                    className={error ? 'error-border' : ''}
                  />
                </div>
                <div className="loc-input-group">
                  <label>Area / City</label>
                  <input 
                    type="text" 
                    name="area" 
                    placeholder="e.g. Shinjuku" 
                    value={location.area}
                    onChange={handleLocationChange}
                    className={error ? 'error-border' : ''}
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div className="location-error" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                  <AlertCircle size={20} /> {error}
                </motion.div>
              )}

              {/* Loading Indicator */}
              {loadingLoc && !error && (
                <div style={{ color: '#fff', marginTop: '10px', fontSize: '0.9rem' }}>
                  <Sparkles size={14} style={{ display: 'inline', animation: 'spin 2s linear infinite' }} /> Fetching locations...
                </div>
              )}

              {/* Suggestions Dropdown */}
              {suggestions.length > 0 && !error && !loadingLoc && (
                <motion.div className="suggestions-dropdown" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                  {suggestions.map((sug, idx) => (
                    <div key={idx} className="suggestion-item" onClick={() => selectSuggestion(sug)}>
                      <MapPin className="sug-icon" size={20} />
                      <div className="sug-text">
                        <p className="sug-title">{sug.name || sug.display_name.split(',')[0]}</p>
                        <p className="sug-desc">{sug.display_name}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* NEW: Select Destination Button */}
            <motion.button 
              className="btn-select-dest" 
              onClick={handleSelectDestination}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Navigation size={20} fill="#fff" /> Show Trip Suggestions
            </motion.button>

          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showTrips && (
          <motion.div 
            className="page-layout"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.6 }}
          >
            
            {/* Main Content (Left Column) - DYNAMIC RENDERING */}
            <div className="main-content">
              {activeTrip.days.map((day, dayIndex) => (
                <motion.div 
                  key={`${activeTripKey}-day-${dayIndex}`}
                  className="day-card"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="day-header">
                    <h3>{day.title}</h3>
                    <span className="day-date"><Calendar size={16} /> {day.date}</span>
                  </div>
                  
                  <div className="activity-list">
                    {day.activities.map((act, actIndex) => (
                      <div className="activity-row" key={actIndex}>
                        <div className="activity-time">{act.time}</div>
                        <div className="timeline-dot"></div>
                        <div className="activity-details">
                          <h4 className="activity-title">{act.title}</h4>
                          <p className="activity-desc">{act.desc}</p>
                          <div className="activity-location"><MapPin size={14} /> {act.location}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Sidebar Suggestions (Right Column - YouTube Style) - DYNAMIC RENDERING */}
            <aside className="sidebar">
              <h3 className="suggestion-header"><Sparkles size={22} /> AI Recommendations</h3>
              
              <div className="suggestion-list">
                {activeTrip.recommendations.map((rec, index) => (
                  <motion.div 
                    key={`${activeTripKey}-rec-${index}`}
                    className="suggestion-card" 
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="thumbnail-wrapper">
                      <img src={rec.image} alt={rec.title} className="suggestion-thumbnail" />
                      <div className="thumbnail-overlay">
                        <div className="play-icon">
                          {rec.type === 'play' ? <Play size={16} fill="#0f172a" /> : <Compass size={16} />}
                        </div>
                      </div>
                    </div>
                    <div className="suggestion-info">
                      <h4 className="suggestion-title">{rec.title}</h4>
                      <p className="suggestion-meta">{rec.match}</p>
                      <span className="suggestion-badge">From ${rec.price}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </aside>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TripsPage;
