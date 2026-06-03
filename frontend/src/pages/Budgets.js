import React, { useState, useEffect } from 'react';
import api from '../api';

function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [categories] = useState([
    'Food', 'Transport', 'Housing', 'Healthcare',
    'Business', 'Entertainment', 'Clothing', 'Education', 'Other'
  ]);
  const [form, setForm] = useState({
    category: 'Food',
    limitAmount: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    color: '#4f46e5',
  });
  const [message, setMessage] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchBudgets();
  }, [month, year]);

  const fetchBudgets = async () => {
    try {
      const res = await api.get(`/budgets?month=${month}&year=${year}`);
      setBudgets(res.data);
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
      await api.post('/budgets', {
        ...form,
        month,
        year,
      });
      setMessage('Budget created successfully!');
      setShowForm(false);
      setForm({ category: 'Food', limitAmount: '', month, year, color: '#4f46e5' });
      fetchBudgets();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error creating budget.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/budgets/${id}`);
      fetchBudgets();
    } catch (err) {
      console.error(err);
    }
  };

  const formatAmount = (amount) =>
    Number(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const colors = ['#4f46e5', '#10b981', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#06b6d4'];

  return (
    <div>
      <div className="topbar">
        <div>
          <h1>Budgets</h1>
          <p>Set and track your spending limits</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select value={month} onChange={(e) => setMonth(e.target.value)}
            style={{ padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid #e8e8e8', fontSize: '0.9rem' }}>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
          <select value={year} onChange={(e) => setYear(e.target.value)}
            style={{ padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid #e8e8e8', fontSize: '0.9rem' }}>
            {[2024, 2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <button className="btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '➕ New Budget'}
          </button>
        </div>
      </div>

      {message && (
        <p style={{ marginBottom: '1rem', color: message.includes('Error') ? '#ef4444' : '#10b981', background: message.includes('Error') ? '#fef0f0' : '#e8faf0', padding: '0.75rem 1rem', borderRadius: '10px' }}>
          {message}
        </p>
      )}

      {showForm && (
        <div className="form-card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#1a1a2e' }}>Create New Budget</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={form.category} onChange={handleChange}>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Spending Limit (RWF)</label>
              <input
                type="number"
                name="limitAmount"
                value={form.limitAmount}
                onChange={handleChange}
                placeholder="e.g. 50000"
                required
              />
            </div>
            <div className="form-group">
              <label>Color</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {colors.map((color) => (
                  <div
                    key={color}
                    onClick={() => setForm({ ...form, color })}
                    style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      background: color, cursor: 'pointer',
                      border: form.color === color ? '3px solid #1a1a2e' : '3px solid transparent'
                    }}
                  />
                ))}
              </div>
            </div>
            <button type="submit" className="btn">Create Budget</button>
          </form>
        </div>
      )}

      {budgets.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '16px', color: '#aaa' }}>
          <p style={{ fontSize: '3rem' }}>💰</p>
          <p>No budgets yet for this month. Create your first one!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {budgets.map((budget) => (
            <div key={budget._id} style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: budget.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                    💳
                  </div>
                  <div>
                    <p style={{ fontWeight: '700', color: '#1a1a2e' }}>{budget.category}</p>
                    <p style={{ fontSize: '0.78rem', color: '#aaa' }}>
                      {budget.percentage >= 100 ? '⚠️ Over budget!' : `${budget.percentage}% used`}
                    </p>
                  </div>
                </div>
                <button onClick={() => handleDelete(budget._id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: '1.1rem' }}>
                  🗑️
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#aaa' }}>Spent</span>
                <span style={{ fontSize: '0.85rem', color: '#aaa' }}>Limit</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                <span style={{ fontWeight: '700', color: budget.percentage >= 100 ? '#ef4444' : '#1a1a2e' }}>
                  {formatAmount(budget.spent)} RWF
                </span>
                <span style={{ fontWeight: '700', color: '#1a1a2e' }}>
                  {formatAmount(budget.limitAmount)} RWF
                </span>
              </div>

              <div style={{ background: '#f0f2f5', borderRadius: '10px', height: '8px', marginBottom: '0.5rem' }}>
                <div style={{
                  width: `${budget.percentage}%`,
                  background: budget.percentage >= 100 ? '#ef4444' : budget.percentage >= 80 ? '#f59e0b' : budget.color,
                  borderRadius: '10px',
                  height: '8px',
                  transition: 'width 0.3s'
                }} />
              </div>

              <p style={{ fontSize: '0.8rem', color: budget.percentage >= 100 ? '#ef4444' : '#10b981', fontWeight: '600' }}>
                {budget.percentage >= 100
                  ? `Over by ${formatAmount(Math.abs(budget.remaining))} RWF`
                  : `${formatAmount(budget.remaining)} RWF remaining`}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Budgets;