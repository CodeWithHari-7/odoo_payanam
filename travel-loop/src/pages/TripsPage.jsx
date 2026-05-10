import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowLeft, Navigation, Calendar, Sparkles, Compass, Play, Crosshair, AlertCircle, Map } from 'lucide-react';
import './TripsPage.css';

function TripsPage() {
  const [location, setLocation] = useState({ country: '', state: '', area: '' });
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loadingLoc, setLoadingLoc] = useState(false);

  // Debounced API fetch for suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      // VALIDATION: Cannot enter State or Area if Country is empty
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
          setSuggestions(data.slice(0, 5)); // Limit to top 5 suggestions
        }
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      } finally {
        setLoadingLoc(false);
      }
    };

    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 600); // 600ms debounce to avoid spamming the free API

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

  return (
    <div className="trips-page-container">
      {/* Header with Dashboard Button */}
      <header className="trips-header">
        <h1><Navigation size={26} color="#0284c7" fill="#0284c7" /> Traveloop AI Plan</h1>
        <Link to="/dashboard" className="btn-dashboard">
          <ArrowLeft size={18} /> Dashboard
        </Link>
      </header>

      {/* Cinematic Trip Hero Banner with Location Setter */}
      <div className="trip-hero">
        <motion.div 
          className="trip-hero-bg"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
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
              <button className="btn-current-location" onClick={useCurrentLocation} disabled={loadingLoc}>
                <Crosshair size={18} /> {loadingLoc ? 'Locating...' : 'Use Current Location'}
              </button>
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
            
          </motion.div>

        </div>
      </div>

      <div className="page-layout">
        
        {/* Main Content (Left Column) */}
        <div className="main-content">
          
          {/* Day 1 */}
          <motion.div 
            className="day-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="day-header">
              <h3>Day 1: Arrival & Exploring Shinjuku</h3>
              <span className="day-date"><Calendar size={16} /> Oct 5, 2026</span>
            </div>
            
            <div className="activity-list">
              <div className="activity-row">
                <div className="activity-time">02:00 PM</div>
                <div className="timeline-dot"></div>
                <div className="activity-details">
                  <h4 className="activity-title">Arrive at Narita Airport</h4>
                  <p className="activity-desc">Take the Narita Express directly to Shinjuku Station. Grab Suica cards.</p>
                  <div className="activity-location"><MapPin size={14} /> Narita International Airport</div>
                </div>
              </div>
              
              <div className="activity-row">
                <div className="activity-time">04:30 PM</div>
                <div className="timeline-dot"></div>
                <div className="activity-details">
                  <h4 className="activity-title">Check-in at Hotel Gracery</h4>
                  <p className="activity-desc">Settle into rooms, freshen up after the long flight. Relax for an hour.</p>
                  <div className="activity-location"><MapPin size={14} /> Hotel Gracery Shinjuku</div>
                </div>
              </div>

              <div className="activity-row">
                <div className="activity-time">07:00 PM</div>
                <div className="timeline-dot"></div>
                <div className="activity-details">
                  <h4 className="activity-title">Dinner at Omoide Yokocho</h4>
                  <p className="activity-desc">Experience classic Japanese street food in Memory Lane. Try Yakitori.</p>
                  <div className="activity-location"><MapPin size={14} /> Shinjuku City</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Day 2 */}
          <motion.div 
            className="day-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="day-header">
              <h3>Day 2: Culture & Crossing</h3>
              <span className="day-date"><Calendar size={16} /> Oct 6, 2026</span>
            </div>
            
            <div className="activity-list">
              <div className="activity-row">
                <div className="activity-time">09:00 AM</div>
                <div className="timeline-dot"></div>
                <div className="activity-details">
                  <h4 className="activity-title">Meiji Shrine</h4>
                  <p className="activity-desc">Walk through the forested park to experience Tokyo's most famous Shinto shrine.</p>
                  <div className="activity-location"><MapPin size={14} /> Shibuya City</div>
                </div>
              </div>
              
              <div className="activity-row">
                <div className="activity-time">12:30 PM</div>
                <div className="timeline-dot"></div>
                <div className="activity-details">
                  <h4 className="activity-title">Shibuya Scramble & Lunch</h4>
                  <p className="activity-desc">Cross the busiest intersection in the world. Sushi lunch at Uobei nearby.</p>
                  <div className="activity-location"><MapPin size={14} /> Shibuya Crossing</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar Suggestions (Right Column - YouTube Style) */}
        <aside className="sidebar">
          <h3 className="suggestion-header"><Sparkles size={22} /> AI Recommendations</h3>
          
          <div className="suggestion-list">
            
            <motion.div className="suggestion-card" whileHover={{ scale: 1.02 }}>
              <div className="thumbnail-wrapper">
                <img src="https://images.unsplash.com/photo-1502602220436-dbf281ce100a?auto=format&fit=crop&q=80&w=600" alt="Kyoto" className="suggestion-thumbnail" />
                <div className="thumbnail-overlay"><div className="play-icon"><Play size={16} fill="#0f172a" /></div></div>
              </div>
              <div className="suggestion-info">
                <h4 className="suggestion-title">Kyoto Bullet Train Day Trip (Guided)</h4>
                <p className="suggestion-meta">Traveloop AI • 98% Match</p>
                <span className="suggestion-badge">From $120</span>
              </div>
            </motion.div>

            <motion.div className="suggestion-card" whileHover={{ scale: 1.02 }}>
              <div className="thumbnail-wrapper">
                <img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=600" alt="Ramen" className="suggestion-thumbnail" />
                <div className="thumbnail-overlay"><div className="play-icon"><Compass size={16} /></div></div>
              </div>
              <div className="suggestion-info">
                <h4 className="suggestion-title">Best Hidden Ramen Spots in Shinjuku</h4>
                <p className="suggestion-meta">Local Guide • 4.9 ★</p>
                <span className="suggestion-badge">From $45</span>
              </div>
            </motion.div>

            <motion.div className="suggestion-card" whileHover={{ scale: 1.02 }}>
              <div className="thumbnail-wrapper">
                <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600" alt="Mountain" className="suggestion-thumbnail" />
                <div className="thumbnail-overlay"><div className="play-icon"><Compass size={16} /></div></div>
              </div>
              <div className="suggestion-info">
                <h4 className="suggestion-title">Mount Fuji Panoramic Ropeway Experience</h4>
                <p className="suggestion-meta">Trending • Book Fast</p>
                <span className="suggestion-badge">From $85</span>
              </div>
            </motion.div>

            <motion.div className="suggestion-card" whileHover={{ scale: 1.02 }}>
              <div className="thumbnail-wrapper">
                <img src="https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&q=80&w=600" alt="TeamLab" className="suggestion-thumbnail" />
                <div className="thumbnail-overlay"><div className="play-icon"><Compass size={16} /></div></div>
              </div>
              <div className="suggestion-info">
                <h4 className="suggestion-title">teamLab Planets Tokyo Interactive Exhibit</h4>
                <p className="suggestion-meta">Must See • 4.8 ★</p>
                <span className="suggestion-badge">From $35</span>
              </div>
            </motion.div>

          </div>
        </aside>

      </div>
    </div>
  );
}

export default TripsPage;
