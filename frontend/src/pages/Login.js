import React, { useState } from 'react';
import axios from 'axios';

function Login({ setUser }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed. Please try again.');
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
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '0.3rem' }}>Welcome back!</h2>
          <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Sign in to your Budget Tracker</p>
        </div>

        {message && (
          <p style={{ marginBottom: '1rem', color: '#ef4444', background: '#fef0f0', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.9rem' }}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="btn" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
          Don't have an account?{' '}
          <a href="/register" style={{ color: '#4f46e5', fontWeight: '600', textDecoration: 'none' }}>
            Create one
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;