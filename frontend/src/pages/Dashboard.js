import React, { useState, useEffect } from 'react';
import api from '../api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#8b5cf6', '#f59e0b', '#06b6d4'];

function Dashboard() {
  const [summary, setSummary] = useState({ income: 0, expenses: 0, balance: 0 });
  const [transactions, setTransactions] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchSummary();
    fetchTransactions();
  }, [month, year]);

  const fetchSummary = async () => {
    try {
      const res = await api.get(`/transactions/summary?month=${month}&year=${year}`);
      setSummary(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await api.get(`/transactions?month=${month}&year=${year}`);
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const savingsRate = summary.income > 0
    ? Math.round((summary.balance / summary.income) * 100)
    : 0;

  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const existing = acc.find(item => item.name === t.category);
      if (existing) {
        existing.value += t.amount;
      } else {
        acc.push({ name: t.category, value: t.amount });
      }
      return acc;
    }, []);

  const recentTransactions = transactions.slice(0, 6);

  const formatAmount = (amount) =>
    Number(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div>
      <div className="topbar">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, {user?.name} 👋</p>
        </div>
        <div className="topbar-right">
          <div className="month-selector">
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              style={{ border: 'none', background: 'transparent', fontSize: '0.9rem' }}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              style={{ border: 'none', background: 'transparent', fontSize: '0.9rem' }}
            >
              {[2024, 2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-header">
            <div className="card-icon green">📈</div>
            <h3>Total Income</h3>
          </div>
          <div className="amount income">{formatAmount(summary.income)} RWF</div>
          <div className="change">↑ This month</div>
        </div>
        <div className="summary-card">
          <div className="card-header">
            <div className="card-icon red">📉</div>
            <h3>Total Expenses</h3>
          </div>
          <div className="amount expense">{formatAmount(summary.expenses)} RWF</div>
          <div className="change" style={{ color: '#ef4444' }}>↑ This month</div>
        </div>
        <div className="summary-card">
          <div className="card-header">
            <div className="card-icon blue">💰</div>
            <h3>Balance</h3>
          </div>
          <div className="amount balance">{formatAmount(summary.balance)} RWF</div>
          <div className="change">↑ This month</div>
        </div>
        <div className="summary-card">
          <div className="card-header">
            <div className="card-icon purple">🎯</div>
            <h3>Savings Rate</h3>
          </div>
          <div className="amount savings">{savingsRate}%</div>
          <div className="change">↑ of income saved</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="chart-card">
          <h3>Income vs Expenses</h3>
          {transactions.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={transactions.slice(0, 10).map(t => ({
                name: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                Income: t.type === 'income' ? t.amount : 0,
                Expenses: t.type === 'expense' ? t.amount : 0,
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Income" stroke="#10b981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Expenses" stroke="#ef4444" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: '#aaa', textAlign: 'center', padding: '3rem 0' }}>No data for this month</p>
          )}
        </div>

        <div className="chart-card">
          <h3>Expense by Category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${formatAmount(value)} RWF`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: '#aaa', textAlign: 'center', padding: '3rem 0' }}>No expenses this month</p>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="actions-grid">
            <a href="/add" className="action-btn">
              <div className="action-icon income-action">➕</div>
              <span>Add Income</span>
            </a>
            <a href="/add" className="action-btn">
              <div className="action-icon expense-action">➖</div>
              <span>Add Expense</span>
            </a>
            <a href="/transactions" className="action-btn">
              <div className="action-icon transfer-action">🔄</div>
              <span>Transactions</span>
            </a>
            <a href="/budgets" className="action-btn">
              <div className="action-icon budget-action">📋</div>
              <span>Budgets</span>
            </a>
          </div>
        </div>

        <div className="recent-transactions">
          <div className="section-header">
            <h3>Recent Transactions</h3>
            <a href="/transactions" className="view-all">View all</a>
          </div>
          {recentTransactions.length === 0 ? (
            <p style={{ color: '#aaa', fontSize: '0.9rem' }}>No transactions yet</p>
          ) : (
            recentTransactions.map((t) => (
              <div key={t._id} className="transaction-row">
                <div className="t-icon">
                  {t.type === 'income' ? '💵' : '🛍️'}
                </div>
                <div className="t-info">
                  <p>{t.category}</p>
                  <span>{new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className={`t-amount ${t.type}`}>
                  {t.type === 'income' ? '+' : '-'}{formatAmount(t.amount)} RWF
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;