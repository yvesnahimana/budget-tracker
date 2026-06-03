import React, { useState, useEffect } from 'react';
import api from '../api';

function AddTransaction() {
  const [categories, setCategories] = useState({ income: [], expense: [] });
  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
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
      await api.post('/transactions', form);
      setMessage('Transaction added successfully!');
      setForm({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error adding transaction.');
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1rem' }}>Add Transaction</h2>
      <div className="form-card">
        {message && (
          <p style={{ marginBottom: '1rem', color: message.includes('Error') ? 'red' : 'green' }}>
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Type</label>
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              required
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select name="category" value={form.category} onChange={handleChange} required>
              <option value="">Select category</option>
              {categories[form.type].map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Optional description"
              rows="3"
            />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn">Add Transaction</button>
        </form>
      </div>
    </div>
  );
}

export default AddTransaction;