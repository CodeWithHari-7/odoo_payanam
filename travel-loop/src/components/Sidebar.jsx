import React from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, Map, User, LogOut, Settings, Clock } from 'lucide-react';
import './Sidebar.css';

function Sidebar() {
  return (
    <aside className="sidebar-nav">
      <div className="sidebar-logo">
        <Compass size={28} color="#38BDF8" />
        <h2>Traveloop</h2>
      </div>
      
      <div className="sidebar-menu">
        <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Compass size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/trips" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Map size={20} />
          <span>My Trips</span>
        </NavLink>
        <NavLink to="/profile" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <User size={20} />
          <span>Profile</span>
        </NavLink>
        <NavLink to="/history" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Clock size={20} />
          <span>History</span>
        </NavLink>
      </div>

      <div className="sidebar-footer">
        <button className="nav-item">
          <Settings size={20} />
          <span>Settings</span>
        </button>
        <button className="nav-item logout">
          <LogOut size={20} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
