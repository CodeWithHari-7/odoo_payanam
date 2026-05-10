import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Features from './Features';

function LandingPage() {
  return (
    <div className="landing-page">
      <div className="landing-overlay"></div>
      <div className="content-wrapper">
        <Navbar />
        <Hero />
        <Features />
      </div>
    </div>
  );
}

export default LandingPage;
