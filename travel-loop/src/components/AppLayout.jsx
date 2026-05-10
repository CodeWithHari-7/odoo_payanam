import React from 'react';
import Sidebar from './Sidebar';
import './AppLayout.css';

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content-area">
        {children}
      </main>
    </div>
  );
}

export default AppLayout;
