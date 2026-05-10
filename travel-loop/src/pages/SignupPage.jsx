import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './LoginPage.css'; // Reusing the login page styles for consistency

function SignupPage() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username
          }
        }
      });

      if (authError) throw new Error(authError.message);

      if (data?.user && !data?.session) {
        setSuccessMsg('Account created! Please check your email for a verification link.');
      } else {
        setSuccessMsg('Account created successfully! Redirecting to login...');
      }
      
      setTimeout(() => {
        navigate('/login');
      }, 4000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-overlay"></div>

      <div className="login-card">
        <h2>Create Account</h2>
        <p>Join Traveloop AI to start planning with friends.</p>

        {error && (
          <div style={{ color: '#ff6b6b', backgroundColor: 'rgba(255, 107, 107, 0.1)', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid rgba(255, 107, 107, 0.3)' }}>
            {error}
          </div>
        )}

        {successMsg && (
          <div style={{ color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            {successMsg}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <input type="text" name="username" placeholder="travel_lover99" value={formData.username} onChange={handleChange} required disabled={loading} />
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input type="email" name="email" placeholder="explorer@traveloop.ai" value={formData.email} onChange={handleChange} required disabled={loading} />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required disabled={loading} />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <div className="login-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
