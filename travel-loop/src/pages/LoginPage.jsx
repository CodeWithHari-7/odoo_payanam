import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './LoginPage.css';

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (data.session) {
        localStorage.setItem('token', data.session.access_token);
        navigate('/trips'); // Redirect to trips upon successful login
      }
      
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
        <h2>Welcome Back</h2>
        <p>Log in to continue your journey with Traveloop AI.</p>
        
        {error && (
          <div style={{ color: '#ff6b6b', backgroundColor: 'rgba(255, 107, 107, 0.1)', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid rgba(255, 107, 107, 0.3)' }}>
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" name="email" placeholder="explorer@traveloop.ai" required value={formData.email} onChange={handleChange} />
          </div>
          
          <div className="input-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="••••••••" required value={formData.password} onChange={handleChange} />
          </div>
          
          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div className="login-footer">
          Don't have an account? <Link to="/signup">Sign up free</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
