import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar({ darkMode, setDarkMode, user, handleLogout }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="sidebar">
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
          <li><Link to="/" className={isActive('/')}><span className="nav-icon">🏠</span> Dashboard</Link></li>
          <li><Link to="/transactions" className={isActive('/transactions')}><span className="nav-icon">💳</span> Transactions</Link></li>
          <li><Link to="/add" className={isActive('/add')}><span className="nav-icon">➕</span> Add Transaction</Link></li>
          <li><Link to="/collections" className={isActive('/collections')}><span className="nav-icon">📁</span> Collections</Link></li>
          <li><Link to="/budgets" className={isActive('/budgets')}><span className="nav-icon">💰</span> Budgets</Link></li>
          <li><Link to="/reports" className={isActive('/reports')}><span className="nav-icon">📊</span> Reports</Link></li>
          <li><Link to="/goals" className={isActive('/goals')}><span className="nav-icon">🎯</span> Goals</Link></li>
          <li><Link to="/bills" className={isActive('/bills')}><span className="nav-icon">🔔</span> Bills & Reminders</Link></li>
          <li><Link to="/settings" className={isActive('/settings')}><span className="nav-icon">⚙️</span> Settings</Link></li>
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
  );
}

export default Navbar;