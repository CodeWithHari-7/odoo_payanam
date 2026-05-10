import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import TripsPage from './pages/TripsPage';
import HistoryPage from './pages/HistoryPage';
import AppLayout from './components/AppLayout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* Protected/Private Routes inside AppLayout */}
        <Route path="/dashboard" element={<AppLayout><DashboardPage /></AppLayout>} />
        <Route path="/trips" element={<AppLayout><TripsPage /></AppLayout>} />
        <Route path="/profile" element={<AppLayout><ProfilePage /></AppLayout>} />
        <Route path="/history" element={<AppLayout><HistoryPage /></AppLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
