import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Bell, Lock, User, Shield, Save, Palette } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './SettingsPage.css';

function SettingsPage() {
  const { t, language, changeLanguage } = useLanguage();
  const [currency, setCurrency] = useState('INR');

  return (
    <div className="settings-page-container">
      <div className="settings-header">
        <h1>{t('navSettings') || 'Settings & Preferences'}</h1>
        <p>Manage your Traveloop experience and account preferences.</p>
      </div>

      <div className="settings-content">
        {/* PREFERENCES CARD */}
        <motion.div 
          className="settings-card" 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="settings-section-header">
            <Globe size={24} className="icon-blue" />
            <h2>App Preferences</h2>
          </div>
          <div className="settings-form">
            <div className="settings-form-group">
              <label>Interface Language</label>
              <div className="custom-select-wrapper">
                <select value={language} onChange={(e) => changeLanguage(e.target.value)}>
                  <option value="en">English (US)</option>
                  <option value="ta">Tamil (தமிழ்)</option>
                </select>
              </div>
            </div>
            <div className="settings-form-group">
              <label>Default Currency</label>
              <div className="custom-select-wrapper">
                <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option value="INR">Indian Rupee (₹)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="JPY">Japanese Yen (¥)</option>
                </select>
              </div>
            </div>
            <div className="settings-form-group">
              <label>Temperature Unit</label>
              <div className="custom-select-wrapper">
                <select defaultValue="celsius">
                  <option value="celsius">Celsius (°C)</option>
                  <option value="fahrenheit">Fahrenheit (°F)</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* NOTIFICATIONS CARD */}
        <motion.div 
          className="settings-card" 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
        >
          <div className="settings-section-header">
            <Bell size={24} className="icon-purple" />
            <h2>Notifications</h2>
          </div>
          <div className="settings-toggles">
            <div className="toggle-group">
              <div className="toggle-info">
                <h4>Push Notifications</h4>
                <p>Receive alerts for upcoming trips, flight changes, and AI suggestions.</p>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="toggle-separator" />
            <div className="toggle-group">
              <div className="toggle-info">
                <h4>Email Newsletter</h4>
                <p>Weekly travel inspiration, curated destinations, and updates.</p>
              </div>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="toggle-separator" />
            <div className="toggle-group">
              <div className="toggle-info">
                <h4>Group Activity Alerts</h4>
                <p>Get notified when friends vote or add expenses to shared trips.</p>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </motion.div>

        {/* SECURITY CARD */}
        <motion.div 
          className="settings-card" 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
        >
          <div className="settings-section-header">
            <Shield size={24} className="icon-teal" />
            <h2>Account Security</h2>
          </div>
          <div className="settings-form">
            <div className="settings-form-group">
              <label>Email Address</label>
              <input type="email" defaultValue="user@example.com" disabled className="input-disabled" />
              <span className="input-help">Contact support to change your email address.</span>
            </div>
            <div className="settings-form-group">
              <label>Password</label>
              <button className="btn-secondary-outline">Change Password</button>
            </div>
          </div>
        </motion.div>
        
        <div className="settings-actions">
           <button className="btn-save-settings">
             <Save size={18} /> Save Preferences
           </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
