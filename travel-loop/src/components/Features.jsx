import React from 'react';

function Features() {
  return (
    <section className="features">
      <div className="feature-card">
        <div className="feature-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z"/>
          </svg>
        </div>
        <h3>AI Itineraries</h3>
        <p>Generate personalized day-by-day travel routes based on your group's preferences in seconds.</p>
      </div>
      
      <div className="feature-card">
        <div className="feature-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="6" width="20" height="12" rx="2"/>
            <circle cx="12" cy="12" r="2"/>
            <path d="M6 12H6.01M18 12H18.01"/>
          </svg>
        </div>
        <h3>Expense Splitting</h3>
        <p>Log expenses on the go. Our algorithm automatically calculates who owes what so you don't have to.</p>
      </div>

      <div className="feature-card">
        <div className="feature-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87"/>
            <path d="M16 3.13a4 4 0 010 7.75"/>
          </svg>
        </div>
        <h3>Live Collaboration</h3>
        <p>Invite friends to vote on activities, add notes, and build the ultimate trip together in real-time.</p>
      </div>
    </section>
  );
}

export default Features;
