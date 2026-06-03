import React, { useState } from 'react';
import api from '../api';

function Register({ setUser }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setMessage('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '2.5rem', width: '100%', maxWidth: '420px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '56px', height: '56px', background: '#4f46e5', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem', color: 'white', fontWeight: 'bold' }}>
            BT
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '0.3rem' }}>Create Account</h2>
          <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Start tracking your budget today</p>
        </div>

        {message && (
          <p style={{ marginBottom: '1rem', color: '#ef4444', background: '#fef0f0', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.9rem' }}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Enter your full name" required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Enter your email" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="At least 6 characters" required />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Repeat your password" required />
          </div>
          <button type="submit" className="btn" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
          Already have an account?{' '}
          <a href="/login" style={{ color: '#4f46e5', fontWeight: '600', textDecoration: 'none' }}>
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;