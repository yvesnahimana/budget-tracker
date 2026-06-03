import React, { useState, useEffect } from 'react';
import api from '../api';

function Bills() {
  const [bills, setBills] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    amount: '',
    dueDay: '',
    category: 'Housing',
    icon: '📄',
    description: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const res = await api.get('/bills');
      setBills(res.data);
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
      await api.post('/bills', form);
      setMessage('Bill added successfully!');
      setShowForm(false);
      setForm({ name: '', amount: '', dueDay: '', category: 'Housing', icon: '📄', description: '' });
      fetchBills();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error adding bill.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/bills/${id}`);
      fetchBills();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await api.put(`/bills/${id}`, {
        status: currentStatus === 'paid' ? 'unpaid' : 'paid',
      });
      fetchBills();
    } catch (err) {
      console.error(err);
    }
  };

  const formatAmount = (amount) =>
    Number(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const icons = ['📄', '🏠', '💡', '📱', '🌐', '🚰', '📺', '🎵', '🏥', '🚗'];
  const categories = ['Housing', 'Transport', 'Healthcare', 'Entertainment', 'Education', 'Food', 'Other'];

  const today = new Date().getDate();
  const unpaidBills = bills.filter(b => b.status === 'unpaid');
  const paidBills = bills.filter(b => b.status === 'paid');
  const dueSoon = bills.filter(b => b.status === 'unpaid' && b.dueDay >= today && b.dueDay <= today + 5);
  const totalUnpaid = unpaidBills.reduce((sum, b) => sum + b.amount, 0);

  return (
    <div>
      <div className="topbar">
        <div>
          <h1>Bills & Reminders</h1>
          <p>Track your recurring bills</p>
        </div>
        <button className="btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '➕ Add Bill'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.2rem 1.5rem', border: '1px solid #f0f0f0', textAlign: 'center' }}>
          <p style={{ fontSize: '2rem', fontWeight: '700', color: '#4f46e5' }}>{bills.length}</p>
          <p style={{ fontSize: '0.85rem', color: '#aaa' }}>Total Bills</p>
        </div>
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.2rem 1.5rem', border: '1px solid #f0f0f0', textAlign: 'center' }}>
          <p style={{ fontSize: '2rem', fontWeight: '700', color: '#ef4444' }}>{unpaidBills.length}</p>
          <p style={{ fontSize: '0.85rem', color: '#aaa' }}>Unpaid</p>
        </div>
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.2rem 1.5rem', border: '1px solid #f0f0f0', textAlign: 'center' }}>
          <p style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981' }}>{paidBills.length}</p>
          <p style={{ fontSize: '0.85rem', color: '#aaa' }}>Paid</p>
        </div>
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.2rem 1.5rem', border: '1px solid #f0f0f0', textAlign: 'center' }}>
          <p style={{ fontSize: '1.3rem', fontWeight: '700', color: '#f59e0b' }}>{formatAmount(totalUnpaid)}</p>
          <p style={{ fontSize: '0.85rem', color: '#aaa' }}>RWF Unpaid</p>
        </div>
      </div>

      {dueSoon.length > 0 && (
        <div style={{ background: '#fff8f0', border: '1px solid #f59e0b', borderRadius: '16px', padding: '1rem 1.5rem', marginBottom: '1.5rem' }}>
          <p style={{ fontWeight: '700', color: '#f59e0b', marginBottom: '0.5rem' }}>⚠️ Due Soon</p>
          {dueSoon.map(b => (
            <p key={b._id} style={{ fontSize: '0.85rem', color: '#666' }}>
              {b.icon} {b.name} — due on day {b.dueDay} — {formatAmount(b.amount)} RWF
            </p>
          ))}
        </div>
      )}

      {message && (
        <p style={{ marginBottom: '1rem', color: message.includes('Error') ? '#ef4444' : '#10b981', background: message.includes('Error') ? '#fef0f0' : '#e8faf0', padding: '0.75rem 1rem', borderRadius: '10px' }}>
          {message}
        </p>
      )}

      {showForm && (
        <div className="form-card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#1a1a2e' }}>Add New Bill</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Icon</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {icons.map((icon) => (
                  <button key={icon} type="button" onClick={() => setForm({ ...form, icon })}
                    style={{ width: '40px', height: '40px', fontSize: '1.2rem', border: form.icon === icon ? '2px solid #4f46e5' : '1px solid #e8e8e8', borderRadius: '8px', cursor: 'pointer', background: form.icon === icon ? '#f0f2ff' : 'white' }}>
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Bill Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Rent" required />
            </div>
            <div className="form-group">
              <label>Amount (RWF)</label>
              <input type="number" name="amount" value={form.amount} onChange={handleChange} placeholder="e.g. 150000" required />
            </div>
            <div className="form-group">
              <label>Due Day of Month</label>
              <input type="number" name="dueDay" value={form.dueDay} onChange={handleChange} placeholder="e.g. 1 for 1st of every month" min="1" max="31" required />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={form.category} onChange={handleChange}>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Description</label>
              <input type="text" name="description" value={form.description} onChange={handleChange} placeholder="Optional description" />
            </div>
            <button type="submit" className="btn">Add Bill</button>
          </form>
        </div>
      )}

      {bills.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '16px', color: '#aaa' }}>
          <p style={{ fontSize: '3rem' }}>🔔</p>
          <p>No bills yet. Add your first one!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {bills.map((bill) => (
            <div key={bill._id} style={{ background: 'white', borderRadius: '16px', padding: '1.2rem 1.5rem', border: `1px solid ${bill.status === 'paid' ? '#10b981' : bill.dueDay <= today + 3 ? '#f59e0b' : '#f0f0f0'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: bill.status === 'paid' ? '#e8faf0' : '#f0f2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                  {bill.icon}
                </div>
                <div>
                  <p style={{ fontWeight: '700', color: '#1a1a2e' }}>{bill.name}</p>
                  <p style={{ fontSize: '0.78rem', color: '#aaa' }}>{bill.category} • Due on day {bill.dueDay} of every month</p>
                  {bill.description && <p style={{ fontSize: '0.78rem', color: '#aaa' }}>{bill.description}</p>}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <p style={{ fontWeight: '700', fontSize: '1rem', color: '#1a1a2e' }}>{formatAmount(bill.amount)} RWF</p>
                <button onClick={() => handleToggleStatus(bill._id, bill.status)}
                  style={{ padding: '0.4rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem', background: bill.status === 'paid' ? '#e8faf0' : '#fef0f0', color: bill.status === 'paid' ? '#10b981' : '#ef4444' }}>
                  {bill.status === 'paid' ? '✅ Paid' : '❌ Unpaid'}
                </button>
                <button onClick={() => handleDelete(bill._id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: '1.1rem' }}>
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Bills;