import React from 'react';
import { Link } from 'react-router-dom';

function ProfilePage() {
  const styles = {
    container: { minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    card: { backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '3rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'center', width: '100%', maxWidth: '400px' },
    avatar: { width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#2575fc', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' },
    btn: { backgroundColor: 'transparent', border: '1px solid #fff', color: '#fff', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', textDecoration: 'none', display: 'inline-block', marginTop: '2rem' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.avatar}>T</div>
        <h2>Traveler Name</h2>
        <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>traveler@example.com</p>
        
        <Link style={styles.btn} to="/dashboard">Back to Dashboard</Link>
      </div>
    </div>
  );
}

export default ProfilePage;
