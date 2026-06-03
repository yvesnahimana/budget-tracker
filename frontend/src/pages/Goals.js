import React, { useState, useEffect } from 'react';
import api from '../api';

function Goals() {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    targetAmount: '',
    savedAmount: '',
    deadline: '',
    icon: '🎯',
    description: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
     const res = await api.get('/goals');
      setGoals(res.data);
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
     await api.post('/goals', form);
      setMessage('Goal created successfully!');
      setShowForm(false);
      setForm({ name: '', targetAmount: '', savedAmount: '', deadline: '', icon: '🎯', description: '' });
      fetchGoals();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error creating goal.');
    }
  };

  const handleDelete = async (id) => {
    try {
     await api.put(`/goals/${id}`, { status: 'completed' });
      fetchGoals();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkComplete = async (id) => {
    try {
     await api.delete(`/goals/${id}`);
      fetchGoals();
    } catch (err) {
      console.error(err);
    }
  };

  const formatAmount = (amount) =>
    Number(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const icons = ['🎯', '🏠', '✈️', '💻', '🚗', '📚', '💍', '🏥', '🎓', '💰'];

  const completed = goals.filter(g => g.status === 'completed').length;
  const inProgress = goals.filter(g => g.status === 'in-progress').length;

  return (
    <div>
      <div className="topbar">
        <div>
          <h1>Goals</h1>
          <p>Track your financial goals</p>
        </div>
        <button className="btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '➕ New Goal'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.2rem 1.5rem', border: '1px solid #f0f0f0', textAlign: 'center' }}>
          <p style={{ fontSize: '2rem', fontWeight: '700', color: '#4f46e5' }}>{goals.length}</p>
          <p style={{ fontSize: '0.85rem', color: '#aaa' }}>Total Goals</p>
        </div>
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.2rem 1.5rem', border: '1px solid #f0f0f0', textAlign: 'center' }}>
          <p style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981' }}>{completed}</p>
          <p style={{ fontSize: '0.85rem', color: '#aaa' }}>Completed</p>
        </div>
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.2rem 1.5rem', border: '1px solid #f0f0f0', textAlign: 'center' }}>
          <p style={{ fontSize: '2rem', fontWeight: '700', color: '#f59e0b' }}>{inProgress}</p>
          <p style={{ fontSize: '0.85rem', color: '#aaa' }}>In Progress</p>
        </div>
      </div>

      {message && (
        <p style={{ marginBottom: '1rem', color: message.includes('Error') ? '#ef4444' : '#10b981', background: message.includes('Error') ? '#fef0f0' : '#e8faf0', padding: '0.75rem 1rem', borderRadius: '10px' }}>
          {message}
        </p>
      )}

      {showForm && (
        <div className="form-card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#1a1a2e' }}>Create New Goal</h3>
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
                      borderRadius: '8px', cursor: 'pointer',
                      background: form.icon === icon ? '#f0f2ff' : 'white'
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Goal Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Buy a Laptop" required />
            </div>
            <div className="form-group">
              <label>Target Amount (RWF)</label>
              <input type="number" name="targetAmount" value={form.targetAmount} onChange={handleChange} placeholder="e.g. 300000" required />
            </div>
            <div className="form-group">
              <label>Already Saved (RWF)</label>
              <input type="number" name="savedAmount" value={form.savedAmount} onChange={handleChange} placeholder="e.g. 50000" />
            </div>
            <div className="form-group">
              <label>Deadline</label>
              <input type="date" name="deadline" value={form.deadline} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input type="text" name="description" value={form.description} onChange={handleChange} placeholder="Optional description" />
            </div>
            <button type="submit" className="btn">Create Goal</button>
          </form>
        </div>
      )}

      {goals.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '16px', color: '#aaa' }}>
          <p style={{ fontSize: '3rem' }}>🎯</p>
          <p>No goals yet. Create your first one!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {goals.map((goal) => {
            const progress = Math.min(Math.round((goal.savedAmount / goal.targetAmount) * 100), 100);
            const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
            return (
              <div key={goal._id} style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: `1px solid ${goal.status === 'completed' ? '#10b981' : '#f0f0f0'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: goal.status === 'completed' ? '#e8faf0' : '#f0f2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                      {goal.icon}
                    </div>
                    <div>
                      <p style={{ fontWeight: '700', fontSize: '0.95rem', color: '#1a1a2e' }}>{goal.name}</p>
                      <p style={{ fontSize: '0.78rem', color: goal.status === 'completed' ? '#10b981' : '#aaa' }}>
                        {goal.status === 'completed' ? '✅ Completed' : daysLeft > 0 ? `${daysLeft} days left` : '⚠️ Overdue'}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(goal._id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: '1.1rem' }}>
                    🗑️
                  </button>
                </div>

                <div style={{ marginBottom: '0.8rem' }}>
                  <p style={{ fontSize: '1.3rem', fontWeight: '700', color: '#1a1a2e' }}>
                    {formatAmount(goal.savedAmount)} <span style={{ fontSize: '0.8rem', color: '#aaa' }}>RWF</span>
                  </p>
                  <p style={{ fontSize: '0.8rem', color: '#aaa' }}>Target: {formatAmount(goal.targetAmount)} RWF</p>
                </div>

                <div style={{ background: '#f0f2f5', borderRadius: '10px', height: '8px', marginBottom: '0.5rem' }}>
                  <div style={{
                    width: `${progress}%`,
                    background: goal.status === 'completed' ? '#10b981' : '#4f46e5',
                    borderRadius: '10px', height: '8px', transition: 'width 0.3s'
                  }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.8rem' }}>
                  <p style={{ fontSize: '0.8rem', color: '#4f46e5', fontWeight: '600' }}>{progress}% complete</p>
                  {goal.status !== 'completed' && (
                    <button
                      onClick={() => handleMarkComplete(goal._id)}
                      style={{ background: '#e8faf0', color: '#10b981', border: 'none', padding: '0.3rem 0.8rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}>
                      Mark Complete ✓
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Goals;