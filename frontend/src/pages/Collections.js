import React, { useState, useEffect } from 'react';
import api from '../api';

function Collections() {
  const [collections, setCollections] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    targetAmount: '',
    savedAmount: '',
    icon: '💰',
    description: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
     const res = await api.get('/collections');
      setCollections(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     await api.post('/collections', form);
      setMessage('Collection created successfully!');
      setShowForm(false);
      setForm({ name: '', targetAmount: '', savedAmount: '', icon: '💰', description: '' });
      fetchCollections();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error creating collection.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/collections/${id}`);
      fetchCollections();
    } catch (err) {
      console.error(err);
    }
  };

  const formatAmount = (amount) =>
    Number(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const icons = ['💰', '✈️', '🛡️', '🎁', '💻', '🏠', '🚗', '📚', '🏥', '🎯'];

  return (
    <div>
      <div className="topbar">
        <div>
          <h1>Collections</h1>
          <p>Track your savings goals</p>
        </div>
        <button className="btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '➕ New Collection'}
        </button>
      </div>

      {message && (
        <p style={{ marginBottom: '1rem', color: message.includes('Error') ? '#ef4444' : '#10b981', background: message.includes('Error') ? '#fef0f0' : '#e8faf0', padding: '0.75rem 1rem', borderRadius: '10px' }}>
          {message}
        </p>
      )}

      {showForm && (
        <div className="form-card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#1a1a2e' }}>Create New Collection</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Icon</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {icons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setForm({ ...form, icon })}
                    style={{
                      width: '40px', height: '40px', fontSize: '1.2rem',
                      border: form.icon === icon ? '2px solid #4f46e5' : '1px solid #e8e8e8',
                      borderRadius: '8px', cursor: 'pointer', background: form.icon === icon ? '#f0f2ff' : 'white'
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Collection Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Travel Fund" required />
            </div>
            <div className="form-group">
              <label>Target Amount (RWF)</label>
              <input type="number" name="targetAmount" value={form.targetAmount} onChange={handleChange} placeholder="e.g. 200000" required />
            </div>
            <div className="form-group">
              <label>Already Saved (RWF)</label>
              <input type="number" name="savedAmount" value={form.savedAmount} onChange={handleChange} placeholder="e.g. 50000" />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input type="text" name="description" value={form.description} onChange={handleChange} placeholder="Optional description" />
            </div>
            <button type="submit" className="btn">Create Collection</button>
          </form>
        </div>
      )}

      {collections.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '16px', color: '#aaa' }}>
          <p style={{ fontSize: '3rem' }}>📁</p>
          <p>No collections yet. Create your first one!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          {collections.map((col) => {
            const progress = Math.min(Math.round((col.savedAmount / col.targetAmount) * 100), 100);
            return (
              <div key={col._id} style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f0f2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                      {col.icon}
                    </div>
                    <div>
                      <p style={{ fontWeight: '700', fontSize: '0.95rem', color: '#1a1a2e' }}>{col.name}</p>
                      <p style={{ fontSize: '0.78rem', color: '#aaa' }}>{col.description}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(col._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: '1.1rem' }}>🗑️</button>
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <p style={{ fontSize: '1.3rem', fontWeight: '700', color: '#1a1a2e' }}>{formatAmount(col.savedAmount)} <span style={{ fontSize: '0.8rem', color: '#aaa' }}>RWF</span></p>
                  <p style={{ fontSize: '0.8rem', color: '#aaa' }}>Target: {formatAmount(col.targetAmount)} RWF</p>
                </div>
                <div style={{ background: '#f0f2f5', borderRadius: '10px', height: '8px', marginBottom: '0.5rem' }}>
                  <div style={{ width: `${progress}%`, background: progress >= 100 ? '#10b981' : '#4f46e5', borderRadius: '10px', height: '8px', transition: 'width 0.3s' }} />
                </div>
                <p style={{ fontSize: '0.8rem', color: '#4f46e5', fontWeight: '600' }}>{progress}% complete</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Collections;