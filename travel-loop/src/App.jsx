import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import TripsPage from './pages/TripsPage';
import HistoryPage from './pages/HistoryPage';
import HotelsPage from './pages/HotelsPage';
import FoodPage from './pages/FoodPage';
import AIChatPage from './pages/AIChatPage';
import SettingsPage from './pages/SettingsPage';
import AppLayout from './components/AppLayout';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* Protected/Private Routes inside AppLayout */}
        <Route path="/dashboard" element={<AppLayout><DashboardPage /></AppLayout>} />
        <Route path="/trips" element={<AppLayout><TripsPage /></AppLayout>} />
        <Route path="/hotels" element={<AppLayout><HotelsPage /></AppLayout>} />
        <Route path="/food" element={<AppLayout><FoodPage /></AppLayout>} />
        <Route path="/profile" element={<AppLayout><ProfilePage /></AppLayout>} />
        <Route path="/history" element={<AppLayout><HistoryPage /></AppLayout>} />
        <Route path="/ai-chat" element={<AppLayout><AIChatPage /></AppLayout>} />
        <Route path="/settings" element={<AppLayout><SettingsPage /></AppLayout>} />
      </Routes>
    </Router>
    </LanguageProvider>
  );
}

export default App;
