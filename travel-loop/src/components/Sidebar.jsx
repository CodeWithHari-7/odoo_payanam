import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Compass, Map, User, LogOut, Settings, Clock, MessageSquare, Building, Utensils } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../supabaseClient';
import './Sidebar.css';

function Sidebar() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <aside className="sidebar-nav">
      <div className="sidebar-logo">
        <Compass size={28} color="#38BDF8" />
        <h2>Traveloop</h2>
      </div>
      
      <div className="sidebar-menu">
        <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Compass size={20} />
          <span>{t('navDashboard')}</span>
        </NavLink>
        <NavLink to="/trips" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Map size={20} />
          <span>{t('navMyTrips')}</span>
        </NavLink>
        <NavLink to="/hotels" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Building size={20} />
          <span>Hotels</span>
        </NavLink>
        <NavLink to="/food" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Utensils size={20} />
          <span>Food</span>
        </NavLink>
        <NavLink to="/profile" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <User size={20} />
          <span>{t('navProfile')}</span>
        </NavLink>
        <NavLink to="/history" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Clock size={20} />
          <span>{t('navHistory')}</span>
        </NavLink>
        <NavLink to="/ai-chat" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <MessageSquare size={20} />
          <span>{t('navAIChat')}</span>
        </NavLink>
      </div>

      <div className="sidebar-footer">
        <NavLink to="/settings" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Settings size={20} />
          <span>{t('navSettings')}</span>
        </NavLink>
        <button className="nav-item logout" onClick={handleLogout}>
          <LogOut size={20} />
          <span>{t('navLogOut')}</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
