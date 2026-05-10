import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, Navigation, Utensils, Star, Loader, Coffee, ChefHat, Shield, AlertTriangle } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './FoodPage.css';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

const foodImages = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80&w=800"
];

function FoodPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [locationName, setLocationName] = useState('');

  const generateFood = async (promptQuery, displayLocation) => {
    setIsGenerating(true);
    setError('');
    setRestaurants([]);
    setLocationName(displayLocation);
    setStatus('AI Chef is curating local flavors...');

    try {
      if (!apiKey) {
        throw new Error("API Key is missing in .env file.");
      }

      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash-latest",
      }, { apiVersion: 'v1' });

      const prompt = `
        You are a Michelin-star culinary expert and travel concierge. Recommend 4 premium restaurants, cafes, or authentic local food experiences for: ${promptQuery}.
        Return ONLY a JSON object in this structure (no markdown code blocks):
        {
          "restaurants": [
            {
              "name": "[Restaurant Name]",
              "cuisine": "[e.g. Italian Fusion / Traditional Indian]",
              "rating": 4.9,
              "priceLevel": "[e.g. ₹₹₹]",
              "description": "[Mouth-watering 2-sentence description of the vibe and taste]",
              "specialties": ["Signature Dish 1", "Signature Dish 2"]
            }
          ]
        }
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(cleanJson);
      
      setRestaurants(parsedData.restaurants || []);
      setStatus('');
    } catch (err) {
      console.error("Gemini Gen Error:", err);
      setError(err.message || "Failed to find dining spots. Check your connection or API key.");
    } finally {
      setIsGenerating(false);
      setStatus('');
    }
  };

  const handleManualSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    generateFood(`the city of ${searchQuery}`, searchQuery);
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
        setStatus('Location found! Searching local tastes...');
        generateFood(`latitude ${lat} and longitude ${lng}`, 'Your Current Location');
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
    <div className="food-page-container">
      {/* HERO SECTION */}
      <section className="food-hero">
        <div className="food-hero-bg" />
        <div className="food-hero-overlay" />
        <div className="food-hero-content">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1>Culinary Adventures</h1>
            <p>From street food to fine dining, discover the best tastes near you with AI.</p>
            
            <div className="food-search-card">
              <form onSubmit={handleManualSearch} className="food-search-bar">
                <Search size={20} color="#64748b" />
                <input 
                  type="text" 
                  placeholder="Where do you want to eat? (e.g. Rome)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="btn-search-food" disabled={isGenerating}>Search</button>
              </form>
              
              <div className="search-divider"><span>OR</span></div>
              
              <button type="button" className="btn-food-near-me" onClick={handleSearchNearby} disabled={isGenerating}>
                <Navigation size={18} /> {isGenerating ? status || 'Processing...' : 'Find Food Near Me'}
              </button>
            </div>
            
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="food-error">
                <AlertTriangle size={18}/> <strong>Error:</strong> {error}
              </motion.div>
            )}

            {status && !error && (
              <div className="food-status">
                <Loader size={18} className="spin" /> {status}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* RESULTS SECTION */}
      <section className="food-results">
        {isGenerating ? (
           <div className="food-loading">
             <Loader size={48} className="spin" />
             <h2>Consulting our AI Chef...</h2>
             <p>{status}</p>
           </div>
        ) : restaurants.length > 0 ? (
          <>
            <div className="results-header">
              <h2><ChefHat size={24} color="#f97316"/> Tastes of {locationName}</h2>
              <span className="results-count">{restaurants.length} curated spots</span>
            </div>
            
            <div className="food-grid">
              {restaurants.map((res, index) => (
                <motion.div 
                  className="food-card" 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="food-img-wrapper" style={{ background: 'linear-gradient(135deg, #ffedd5, #ffddd2)' }}>
                    <img 
                      src={foodImages[index % foodImages.length]} 
                      alt={res.name}
                      onError={(e) => { 
                        e.target.style.display = 'none'; 
                        e.target.parentElement.style.background = 'linear-gradient(135deg, #f97316, #fbbf24)';
                      }}
                    />
                    <div className="food-price-badge">{res.priceLevel}</div>
                  </div>
                  
                  <div className="food-card-body">
                    <div className="food-meta">
                      <div className="food-rating">
                        <Star size={16} fill="#fbbf24" color="#fbbf24" />
                        <span>{res.rating}</span>
                      </div>
                      <span className="cuisine-type">{res.cuisine}</span>
                    </div>
                    <h3>{res.name}</h3>
                    <p>{res.description}</p>
                    
                    <div className="food-specialties">
                      {res.specialties && res.specialties.map((spec, i) => (
                        <span key={i} className="spec-badge">
                          <Utensils size={12} /> {spec}
                        </span>
                      ))}
                    </div>
                    
                    <button className="btn-view-menu">View AI Details</button>
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

export default FoodPage;
