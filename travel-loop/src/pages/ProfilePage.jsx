import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Settings, Bell, Shield, LogOut, Camera, ChevronRight, Compass, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './ProfilePage.css';

function ProfilePage() {
  const { t, language, toggleLanguage } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('');
  const [locationLoading, setLocationLoading] = useState(true);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          
          const city = data.address.city || data.address.town || data.address.village || data.address.county;
          const state = data.address.state || data.address.country;
          
          if (city && state) {
            setCurrentLocation(`${city}, ${state}`);
          } else {
            setCurrentLocation(t('livesIn'));
          }
        } catch (error) {
          console.error("Error fetching location:", error);
          setCurrentLocation(t('livesIn'));
        } finally {
          setLocationLoading(false);
        }
      }, (error) => {
        console.error("Geolocation error:", error);
        setCurrentLocation(t('livesIn'));
        setLocationLoading(false);
      });
    } else {
      setCurrentLocation(t('livesIn'));
      setLocationLoading(false);
    }
  }, [language, t]);

  const handleLangToggle = () => {
    toggleLanguage(language === 'en' ? 'ta' : 'en');
  };
  return (
    <div className="profile-page-container">
      <div className="profile-content-wrapper">
        
        {/* Profile Header Card */}
        <div className="profile-header-card">
          <div className="profile-cover-photo">
            <button className="btn-edit-cover"><Camera size={16} /> {t('editCover')}</button>
          </div>
          <div className="profile-info-section">
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar">T</div>
              <button className="btn-edit-avatar"><Camera size={14} /></button>
            </div>
            
            <div className="profile-details">
              <h1>Traveler Name</h1>
              <p className="profile-email">traveler@example.com</p>
              <div className="profile-badges">
                <span className="badge badge-pro">Pro Traveler</span>
                <span className="badge"><MapPin size={12} /> 14 Countries</span>
              </div>
            </div>
            
            <div className="profile-actions">
              <Link to="/dashboard" className="btn-secondary-outline">{t('btnDashboard')}</Link>
              <button className="btn-primary">{t('editProfile')}</button>
            </div>
          </div>
        </div>

        <div className="profile-grid">
          {/* Left Column: Stats & About */}
          <div className="profile-left-col">
            <div className="profile-card">
              <h3>{t('travelStats')}</h3>
              <div className="stats-grid">
                <div className="stat-box">
                  <span className="stat-value">24</span>
                  <span className="stat-label">{t('statTrips')}</span>
                </div>
                <div className="stat-box">
                  <span className="stat-value">12k</span>
                  <span className="stat-label">{t('statMiles')}</span>
                </div>
                <div className="stat-box">
                  <span className="stat-value">142</span>
                  <span className="stat-label">{t('statPlaces')}</span>
                </div>
              </div>
            </div>

            <div className="profile-card">
              <h3>{t('aboutMe')}</h3>
              <p className="about-text">
                {t('aboutText')}
              </p>
              <div className="about-meta">
                <div className="meta-item">
                  <MapPin size={16} /> {locationLoading ? t('locating') : currentLocation}
                </div>
                <div className="meta-item">
                  <Calendar size={16} /> {t('joined')}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Settings & Preferences */}
          <div className="profile-right-col">
            <div className="profile-card">
              <h3>{t('accountSettings')}</h3>
              <div className="settings-list">
                
                {/* General Preferences acts as Language Toggle */}
                <div className="settings-item" onClick={handleLangToggle}>
                  <div className="settings-item-left">
                    <div className="settings-icon-wrapper"><Settings size={18} /></div>
                    <div className="settings-text">
                      <h4>{t('genPref')} <span style={{fontSize:'0.8em', color:'#0284c7', marginLeft:'5px'}}>({language === 'en' ? 'English' : 'தமிழ்'})</span></h4>
                      <p>{t('langDesc')}</p>
                    </div>
                  </div>
                  <Globe size={18} className="settings-chevron" style={{color: '#0284c7'}} />
                </div>

                <div className="settings-item">
                  <div className="settings-item-left">
                    <div className="settings-icon-wrapper" style={{color: '#7C3AED', background: '#f5f3ff'}}><Bell size={18} /></div>
                    <div className="settings-text">
                      <h4>{t('notifications')}</h4>
                      <p>{t('notifDesc')}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="settings-chevron" />
                </div>

                <div className="settings-item">
                  <div className="settings-item-left">
                    <div className="settings-icon-wrapper" style={{color: '#0d9488', background: '#f0fdfa'}}><Shield size={18} /></div>
                    <div className="settings-text">
                      <h4>{t('privacy')}</h4>
                      <p>{t('privacyDesc')}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="settings-chevron" />
                </div>
                
                <div className="settings-item">
                  <div className="settings-item-left">
                    <div className="settings-icon-wrapper" style={{color: '#38BDF8', background: '#f0f9ff'}}><Compass size={18} /></div>
                    <div className="settings-text">
                      <h4>{t('travelPref')}</h4>
                      <p>{t('travelPrefDesc')}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="settings-chevron" />
                </div>
              </div>
              
              <button className="btn-logout-full">
                <LogOut size={18} /> {t('signOut')}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProfilePage;
