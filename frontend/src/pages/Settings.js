import React, { useState } from 'react';
import api from '../api';

function Settings() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currency: 'RWF',
    language: 'English',
  });
  const [message, setMessage] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setMessage('Settings saved successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleClearTransactions = async () => {
    try {
      const res = await api.get('/transactions');
      await Promise.all(
        res.data.map(t => api.delete(`/transactions/${t._id}`))
      );
      setMessage('All transactions cleared successfully!');
      setShowClearConfirm(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error clearing transactions.');
    }
  };

  return (
    <div>
      <div className="topbar">
        <div>
          <h1>Settings</h1>
          <p>Manage your account and preferences</p>
        </div>
      </div>

      {message && (
        <p style={{ marginBottom: '1rem', color: message.includes('Error') ? '#ef4444' : '#10b981', background: message.includes('Error') ? '#fef0f0' : '#e8faf0', padding: '0.75rem 1rem', borderRadius: '10px' }}>
          {message}
        </p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #f0f0f0' }}>
          <h3 style={{ marginBottom: '1.5rem', color: '#1a1a2e', fontSize: '1rem', fontWeight: '700' }}>👤 Profile Settings</h3>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" value={profile.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" value={profile.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Currency</label>
              <select name="currency" value={profile.currency} onChange={handleChange}>
                <option value="RWF">RWF — Rwandan Franc</option>
                <option value="USD">USD — US Dollar</option>
                <option value="EUR">EUR — Euro</option>
                <option value="GBP">GBP — British Pound</option>
                <option value="KES">KES — Kenyan Shilling</option>
                <option value="UGX">UGX — Ugandan Shilling</option>
                <option value="TZS">TZS — Tanzanian Shilling</option>
              </select>
            </div>
            <div className="form-group">
              <label>Language</label>
              <select name="language" value={profile.language} onChange={handleChange}>
                <option value="English">English</option>
                <option value="French">French (Français)</option>
                <option value="Kinyarwanda">Kinyarwanda</option>
                <option value="Swahili">Swahili</option>
              </select>
            </div>
            <button type="submit" className="btn">💾 Save Settings</button>
          </form>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #f0f0f0' }}>
            <h3 style={{ marginBottom: '1rem', color: '#1a1a2e', fontSize: '1rem', fontWeight: '700' }}>📊 App Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {[
                { label: 'App Name', value: 'Budget Tracker' },
                { label: 'Version', value: '1.0.0' },
                { label: 'Built with', value: 'MERN Stack' },
                { label: 'Database', value: 'MongoDB' },
                { label: 'Backend', value: 'Node.js + Express' },
                { label: 'Frontend', value: 'React.js' },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f5f5f5' }}>
                  <span style={{ fontSize: '0.85rem', color: '#aaa' }}>{item.label}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#1a1a2e' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #fef0f0' }}>
            <h3 style={{ marginBottom: '0.5rem', color: '#ef4444', fontSize: '1rem', fontWeight: '700' }}>⚠️ Danger Zone</h3>
            <p style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '1rem' }}>
              These actions cannot be undone. Please be careful.
            </p>
            {!showClearConfirm ? (
              <button
                onClick={() => setShowClearConfirm(true)}
                style={{ padding: '0.75rem 1.5rem', background: '#fef0f0', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}>
                🗑️ Clear All Transactions
              </button>
            ) : (
              <div style={{ background: '#fef0f0', padding: '1rem', borderRadius: '10px' }}>
                <p style={{ fontSize: '0.85rem', color: '#ef4444', marginBottom: '1rem', fontWeight: '600' }}>
                  Are you sure? This will delete ALL your transactions permanently!
                </p>
                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  <button onClick={handleClearTransactions}
                    style={{ padding: '0.6rem 1.2rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                    Yes, Delete All
                  </button>
                  <button onClick={() => setShowClearConfirm(false)}
                    style={{ padding: '0.6rem 1.2rem', background: 'white', color: '#666', border: '1px solid #e8e8e8', borderRadius: '8px', cursor: 'pointer' }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;