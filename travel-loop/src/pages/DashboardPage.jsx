import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { 
  MapPin, Calendar, Users, Activity, TrendingUp, 
  Compass, CreditCard, ChevronRight, Share2, 
  Navigation, Clock, MoreHorizontal
} from 'lucide-react';
import './DashboardPage.css';

const expenseData = [
  { name: 'Flights', value: 400, color: '#38BDF8' },
  { name: 'Hotels', value: 300, color: '#7C3AED' },
  { name: 'Food', value: 200, color: '#4FD1C5' },
  { name: 'Activities', value: 150, color: '#EC4899' },
];

const heroImages = [
  '/hero_bg.png', // 1. Default
  'https://images.unsplash.com/photo-1542051812-09c735237887?auto=format&fit=crop&q=80&w=2000', // 2. Tokyo
  'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=2000', // 3. Paris
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=2000', // 4. Mountain Lake
  'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=2000', // 5. Tropical Beach
  'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&q=80&w=2000', // 6. Alps
  'https://images.unsplash.com/photo-1512453979436-5a524022aa70?auto=format&fit=crop&q=80&w=2000', // 7. City Nightscape
  'https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&q=80&w=2000', // 8. European Architecture
  'https://images.unsplash.com/photo-1504150558240-6b4e7e4aa5fb?auto=format&fit=crop&q=80&w=2000', // 9. Desert Dunes
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2000', // 10. Epic Road Trip
  'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&q=80&w=2000', // 11. Venice Canals
  'https://images.unsplash.com/photo-1492666673288-3c4b665df191?auto=format&fit=crop&q=80&w=2000', // 12. Island Aerial
  'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&q=80&w=2000', // 13. London City
  'https://images.unsplash.com/photo-1496412705062-a5e3cf7ec024?auto=format&fit=crop&q=80&w=2000', // 14. Classic Italy
  'https://images.unsplash.com/photo-1436491865332-7a61a3518cdb?auto=format&fit=crop&q=80&w=2000', // 15. Santorini Greece
  'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&q=80&w=2000', // 16. Dubai Skyline
  'https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&q=80&w=2000', // 17. Machu Picchu
  'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=2000', // 18. Rome Colosseum
  'https://images.unsplash.com/photo-1502602220436-dbf281ce100a?auto=format&fit=crop&q=80&w=2000', // 19. Kyoto Japan
  'https://images.unsplash.com/photo-1518398046578-8cca57782e17?auto=format&fit=crop&q=80&w=2000'  // 20. Maldives Ocean
];

function DashboardPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="cinematic-dashboard">
      
      {/* 1. HERO BANNER SECTION */}
      <section className="hero-banner-container">
        <AnimatePresence>
          <motion.div 
            key={currentImageIndex}
            className="hero-banner-bg"
            style={{ backgroundImage: `url(${heroImages[currentImageIndex]})` }}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </AnimatePresence>
        <div className="hero-overlay" />
        
        <div className="hero-content">
          <motion.div 
            className="hero-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1>Oahu Expedition 2026</h1>
            <div className="hero-meta">
              <div className="hero-meta-item">
                <MapPin size={18} />
                <span>Honolulu, Hawaii</span>
              </div>
              <div className="hero-meta-item">
                <Calendar size={18} />
                <span>Oct 12 - Oct 20</span>
              </div>
              <div className="hero-collaborators">
                <div className="collab-avatar">S</div>
                <div className="collab-avatar">M</div>
                <div className="collab-avatar">A</div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="hero-actions"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <button className="btn-cinematic btn-secondary-cine">
              <Share2 size={18} /> Share Trip
            </button>
            <Link to="/trips" className="btn-cinematic btn-primary-cine" style={{textDecoration: 'none'}}>
              <Navigation size={18} /> Open Itinerary
            </Link>
          </motion.div>
        </div>
      </section>

      {/* MAIN DASHBOARD LAYOUT */}
      <main className="dashboard-grid-container">
        
        {/* LEFT COLUMN */}
        <div className="grid-left">
          
          {/* 2. QUICK STATS SECTION */}
          <section className="quick-stats">
            {[
              { title: 'Trips Created', value: '4', icon: <Compass />, colorClass: 'icon-blue' },
              { title: 'Budget Remaining', value: '$1,240', icon: <CreditCard />, colorClass: 'icon-teal' },
              { title: 'Countries Visiting', value: '2', icon: <MapPin />, colorClass: 'icon-purple' },
              { title: 'Upcoming Activities', value: '12', icon: <Activity />, colorClass: 'icon-pink' }
            ].map((stat, idx) => (
              <motion.div 
                className="stat-card" 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + (idx * 0.1) }}
              >
                <div className={`stat-icon ${stat.colorClass}`}>
                  {stat.icon}
                </div>
                <div className="stat-info">
                  <p>{stat.title}</p>
                  <h3>{stat.value}</h3>
                </div>
              </motion.div>
            ))}
          </section>

          {/* 3. MAP SECTION */}
          <motion.section 
            className="map-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="map-placeholder-bg" />
            <div className="map-marker marker-1" />
            <div className="map-marker marker-2" />
            
            <div className="map-route">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                <path 
                  d="M 30 60 Q 50 20 70 30" 
                  fill="none" 
                  strokeWidth="0.5" 
                  className="route-line"
                />
              </svg>
            </div>

            <div className="map-card-overlay">
              <h4>Current Route</h4>
              <p>Waikiki Beach → Diamond Head</p>
            </div>
          </motion.section>

          {/* 4. ITINERARY TIMELINE */}
          <motion.section 
            className="timeline-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="section-title">
              <Calendar size={24} /> Itinerary Timeline
            </div>
            
            <div className="timeline-line" />
            
            {[
              { time: 'Day 1 • 09:00 AM', title: 'Arrival at HNL Airport', desc: 'Pick up rental car and drive to Airbnb in Waikiki.' },
              { time: 'Day 1 • 02:00 PM', title: 'Beach Afternoon', desc: 'Relaxing at Waikiki beach, surfing lessons.' },
              { time: 'Day 1 • 07:30 PM', title: 'Welcome Dinner', desc: 'Reservation at Duke\'s Waikiki for the group.' }
            ].map((item, idx) => (
              <motion.div 
                className="timeline-item" 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1 + (idx * 0.2) }}
              >
                <div className="timeline-icon">
                  <Clock size={18} />
                </div>
                <div className="timeline-content">
                  <div className="timeline-time">{item.time}</div>
                  <h4 className="timeline-title">{item.title}</h4>
                  <p className="timeline-desc">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.section>

        </div>

        {/* RIGHT COLUMN */}
        <div className="grid-right">
          
          {/* 5. EXPENSE ANALYTICS */}
          <motion.section 
            className="analytics-container"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="section-title">
              <TrendingUp size={24} /> Budget Analytics
            </div>
            
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', color: '#0f172a', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}
                    itemStyle={{ color: '#0f172a' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="chart-center-text">
                <h3>$1,050</h3>
                <p>Spent Total</p>
              </div>
            </div>

            <div className="budget-progress">
              <div className="progress-header">
                <span>Total Budget</span>
                <span style={{ color: '#38BDF8' }}>65% Used</span>
              </div>
              <div className="progress-bar-bg">
                <motion.div 
                  className="progress-bar-fill"
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  transition={{ duration: 1, delay: 1 }}
                />
              </div>
            </div>
          </motion.section>

          {/* 6. GROUP ACTIVITY SECTION */}
          <motion.section 
            className="activity-feed"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <div className="section-title">
              <Users size={24} /> Group Activity
            </div>
            
            <div className="activity-item">
              <div className="activity-avatar" style={{background: '#38BDF8'}}>M</div>
              <div className="activity-details">
                <p><span>Mike</span> voted for <b>Shark Cage Diving</b></p>
                <div className="activity-time">2 hours ago</div>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-avatar" style={{background: '#7C3AED'}}>S</div>
              <div className="activity-details">
                <p><span>Sarah</span> added an expense: <b>Rental Car</b> ($400)</p>
                <div className="activity-time">5 hours ago</div>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-avatar" style={{background: '#4FD1C5'}}>A</div>
              <div className="activity-details">
                <p><span>Alex</span> joined the Oahu Expedition trip.</p>
                <div className="activity-time">1 day ago</div>
              </div>
            </div>
            
            <button className="btn-view-all">
              View All Activity
            </button>
          </motion.section>

        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
