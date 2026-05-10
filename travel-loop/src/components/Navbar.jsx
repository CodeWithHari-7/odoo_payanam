import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" style={{ textDecoration: 'none' }}>
        <div className="logo">Traveloop AI</div>
      </Link>
      <div className="nav-links">

        <Link to="/login">
          <button>Login</button>
        </Link>
        <Link to="/signup">
          <button className="btn-primary">Sign Up Free</button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
