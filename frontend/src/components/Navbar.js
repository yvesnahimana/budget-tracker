import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar({ darkMode, setDarkMode, user, handleLogout }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isActive = (path) => location.pathname === path ? 'active' : '';

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <button className="hamburger-btn" onClick={() => setMobileOpen(true)}>
        ☰
      </button>

      <div className={`sidebar-overlay ${mobileOpen ? 'active' : ''}`} onClick={closeMobile} />

      <div className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">BT</div>
          <div>
            <h2>Budget Tracker</h2>
          </div>
        </div>

        <div className="sidebar-profile">
          <div className="profile-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <p>{user?.name}</p>
            <span>⭐ Premium Plan</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li><Link to="/" className={isActive('/')} onClick={closeMobile}><span className="nav-icon">🏠</span> Dashboard</Link></li>
            <li><Link to="/transactions" className={isActive('/transactions')} onClick={closeMobile}><span className="nav-icon">💳</span> Transactions</Link></li>
            <li><Link to="/add" className={isActive('/add')} onClick={closeMobile}><span className="nav-icon">➕</span> Add Transaction</Link></li>
            <li><Link to="/collections" className={isActive('/collections')} onClick={closeMobile}><span className="nav-icon">📁</span> Collections</Link></li>
            <li><Link to="/budgets" className={isActive('/budgets')} onClick={closeMobile}><span className="nav-icon">💰</span> Budgets</Link></li>
            <li><Link to="/reports" className={isActive('/reports')} onClick={closeMobile}><span className="nav-icon">📊</span> Reports</Link></li>
            <li><Link to="/goals" className={isActive('/goals')} onClick={closeMobile}><span className="nav-icon">🎯</span> Goals</Link></li>
            <li><Link to="/bills" className={isActive('/bills')} onClick={closeMobile}><span className="nav-icon">🔔</span> Bills & Reminders</Link></li>
            <li><Link to="/settings" className={isActive('/settings')} onClick={closeMobile}><span className="nav-icon">⚙️</span> Settings</Link></li>
          </ul>
        </nav>

        <div className="sidebar-bottom">
          <div className="dark-mode-toggle">
            <span>🌙 Dark Mode</span>
            <div
              className={`toggle-switch ${darkMode ? 'on' : ''}`}
              onClick={() => setDarkMode(!darkMode)}
            />
          </div>
          <button onClick={handleLogout} className="upgrade-btn" style={{ background: '#ef4444' }}>
            🚪 Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default Navbar;