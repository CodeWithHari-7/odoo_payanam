import React from 'react';

function Hero() {
  return (
    <main className="hero">
      <h1>
        Collaborative Travel Planning <br/> Powered by <span>AI</span>
      </h1>
      <p>
        Build your perfect itinerary, manage expenses, and explore the world seamlessly with your friends and intelligent AI companions.
      </p>
      <div className="hero-buttons">
        <button className="btn-large btn-explore">Start Planning</button>
        <button className="btn-large btn-demo">Watch Demo</button>
      </div>
    </main>
  );
}

export default Hero;
