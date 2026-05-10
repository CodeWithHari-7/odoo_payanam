import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, Navigation, Building, Star, Loader, Wifi, Coffee, Shield, AlertTriangle } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './HotelsPage.css';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

const hotelImages = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1542314831-c6a4d1409e1c?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=800"
];

function HotelsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [hotels, setHotels] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [locationName, setLocationName] = useState('');

  const generateHotels = async (promptQuery, displayLocation) => {
    setIsGenerating(true);
    setError('');
    setHotels([]);
    setLocationName(displayLocation);
    setStatus('AI is scouting luxury stays...');

    try {
      if (!apiKey) {
        throw new Error("API Key is missing in .env file.");
      }

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-latest",
      }, { apiVersion: 'v1' });

      const prompt = `
        You are a luxury travel concierge. Recommend 4 premium hotels or lodgings for: ${promptQuery}.
        Return ONLY a JSON object in this structure (no markdown code blocks):
        {
          "hotels": [
            {
              "name": "[Hotel Name]",
              "rating": 4.8,
              "price": "[e.g. ₹12,000 / night]",
              "description": "[Compelling 2-sentence description emphasizing luxury]",
              "amenities": ["Spa", "Pool", "Free WiFi"]
            }
          ]
        }
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      // Clean potential markdown formatting
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(cleanJson);

      setHotels(parsedData.hotels || []);
      setStatus('');
    } catch (err) {
      console.error("Gemini Gen Error:", err);
      setError(err.message || "Failed to find hotels. Check your connection or API key.");
    } finally {
      setIsGenerating(false);
      setStatus('');
    }
  };

  const handleManualSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    generateHotels(`the city of ${searchQuery}`, searchQuery);
  };

  const handleSearchNearby = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setIsGenerating(true);
    setError('');
    setStatus('Requesting browser location permission...');

    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setStatus('Location found! Sending to AI...');
        generateHotels(`latitude ${lat} and longitude ${lng}`, 'Your Current Location');
      },
      (geoError) => {
        setIsGenerating(false);
        setStatus('');
        if (geoError.code === 1) {
          setError("Location access denied. Please type a city manually above.");
        } else if (geoError.code === 3) {
          setError("Location request timed out. Please try again or type a city.");
        } else {
          setError("Geolocation error. Please type a city manually.");
        }
      },
      geoOptions
    );
  };

  return (
    <div className="hotels-page-container">
      {/* HERO SECTION */}
      <section className="hotels-hero">
        <div className="hotels-hero-bg" />
        <div className="hotels-hero-overlay" />
        <div className="hotels-hero-content">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1>Find Premium Stays</h1>
            <p>Discover handpicked luxury hotels curated by AI, wherever you are.</p>

            <div className="hotels-search-card">
              <form onSubmit={handleManualSearch} className="hotels-search-bar">
                <Search size={20} color="#64748b" />
                <input
                  type="text"
                  placeholder="Where do you want to stay? (e.g. Kyoto)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="btn-search-hotels" disabled={isGenerating}>Search</button>
              </form>

              <div className="search-divider"><span>OR</span></div>

              <button type="button" className="btn-near-me" onClick={handleSearchNearby} disabled={isGenerating}>
                <Navigation size={18} /> {isGenerating ? status || 'Processing...' : 'Find Hotels Near Me'}
              </button>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hotels-error">
                <AlertTriangle size={18} /> <strong>Error:</strong> {error}
              </motion.div>
            )}

            {status && !error && (
              <div className="hotels-status">
                <Loader size={18} className="spin" /> {status}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* RESULTS SECTION */}
      <section className="hotels-results">
        {isGenerating ? (
          <div className="hotels-loading">
            <Loader size={48} className="spin" />
            <h2>Scouting the best suites...</h2>
            <p>{status}</p>
          </div>
        ) : hotels.length > 0 ? (
          <>
            <div className="results-header">
              <h2><Building size={24} color="#0ea5e9" /> Stays near {locationName}</h2>
              <span className="results-count">{hotels.length} curated options</span>
            </div>

            <div className="hotels-grid">
              {hotels.map((hotel, index) => (
                <motion.div
                  className="hotel-card"
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="hotel-img-wrapper" style={{ background: 'linear-gradient(135deg, #e0e7ff, #f3e8ff)' }}>
                    <img
                      src={hotelImages[index % hotelImages.length]}
                      alt={hotel.name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.style.background = 'linear-gradient(135deg, #0ea5e9, #8b5cf6)';
                      }}
                    />
                    <div className="hotel-price-badge">{hotel.price}</div>
                  </div>

                  <div className="hotel-card-body">
                    <div className="hotel-rating">
                      <Star size={16} fill="#fbbf24" color="#fbbf24" />
                      <span>{hotel.rating} Excellent</span>
                    </div>
                    <h3>{hotel.name}</h3>
                    <p>{hotel.description}</p>

                    <div className="hotel-amenities">
                      {hotel.amenities && hotel.amenities.map((amenity, i) => (
                        <span key={i} className="amenity-badge">{amenity}</span>
                      ))}
                    </div>

                    <button className="btn-book-hotel">Reserve Suite</button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        ) : null}
      </section>
    </div>
  );
}

export default HotelsPage;
