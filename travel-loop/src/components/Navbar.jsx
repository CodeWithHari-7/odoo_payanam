import React from 'react';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">Traveloop AI</div>
      <div className="nav-links">
        <button>Features</button>
        <button>Pricing</button>
        <button>Login</button>
        <button className="btn-primary">Sign Up Free</button>
      </div>
    </nav>
  );
}

export default Navbar;
