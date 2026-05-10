import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './HistoryPage.css';

function HistoryPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('searchHistory');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('searchHistory');
    setHistory([]);
  };

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="history-page-container">
      <header className="history-header">
        <div className="header-title">
          <Clock size={28} className="header-icon" />
          <h1>Search History</h1>
        </div>
        {history.length > 0 && (
          <button onClick={clearHistory} className="btn-clear-history">
            <Trash2 size={18} /> Clear All
          </button>
        )}
      </header>

      <main className="history-content">
        {history.length === 0 ? (
          <div className="empty-history">
            <MapPin size={48} className="empty-icon" />
            <h3>No searches yet</h3>
            <p>Start planning your next trip on the dashboard to see your history here.</p>
            <Link to="/dashboard" className="btn-primary" style={{textDecoration: 'none'}}>Go to Dashboard</Link>
          </div>
        ) : (
          <div className="history-grid">
            {history.map((item, idx) => (
              <div key={idx} className="history-card">
                <div className="history-card-icon">
                  <MapPin size={20} />
                </div>
                <div className="history-card-details">
                  <h3>{item.name}</h3>
                  <p className="history-full-name">{item.fullName}</p>
                  <p className="history-time">{formatDate(item.timestamp)}</p>
                </div>
                <button className="btn-revisit">
                  <ArrowRight size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default HistoryPage;
