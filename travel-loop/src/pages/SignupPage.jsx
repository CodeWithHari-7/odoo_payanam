import React from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css'; // Reusing the login page styles for consistency

function SignupPage() {
  return (
    <div className="login-page">
      <div className="login-overlay"></div>

      <div className="login-card">
        <h2>Create Account</h2>
        <p>Join Traveloop AI to start planning with friends.</p>

        <form className="login-form">
          <div className="input-group">
            <label>Username</label>
            <input type="text" placeholder="travel_lover99" required />
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input type="email" placeholder="explorer@traveloop.ai" required />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" required />
          </div>

          <button type="button" className="btn-login">Sign Up</button>
        </form>

        <div className="login-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
