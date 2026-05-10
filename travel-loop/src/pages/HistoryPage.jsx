import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Trash2, ArrowRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './HistoryPage.css';

function HistoryPage() {
  const { t } = useLanguage();
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredHistory = history.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="history-page-container">
      <header className="history-header">
        <div className="header-title">
          <Clock size={28} className="header-icon" />
          <h1>{t('navHistory')}</h1>
        </div>
        {history.length > 0 && (
          <button onClick={clearHistory} className="btn-clear-history">
            <Trash2 size={18} /> {t('clearAll')}
          </button>
        )}
      </header>

      {history.length > 0 && (
        <div className="history-search-wrapper">
          <div className="history-search-box">
            <Search size={20} className="search-icon-h" />
            <input 
              type="text" 
              placeholder="Search your past destinations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="history-search-input"
            />
          </div>
        </div>
      )}

      <main className="history-content">
        {history.length === 0 ? (
          <div className="empty-history">
            <MapPin size={48} className="empty-icon" />
            <h3>{t('noSearches')}</h3>
            <p>Start planning your next trip on the dashboard to see your history here.</p>
            <Link to="/dashboard" className="btn-primary" style={{textDecoration: 'none'}}>{t('goToDashboard')}</Link>
          </div>
        ) : (
          <div className="history-grid">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((item, idx) => (
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
              ))
            ) : (
              <div className="no-search-results">
                <Search size={32} className="empty-icon" />
                <h4>No matching history found</h4>
                <p>Try a different search term.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default HistoryPage;
