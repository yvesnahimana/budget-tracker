import React, { useState, useEffect } from 'react';
import api from '../api';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchTransactions();
  }, [month, year]);

  const fetchTransactions = async () => {
    try {
      const res = await api.get(`/transactions?month=${month}&year=${year}`);
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1rem' }}>Transactions</h2>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          {[2024, 2025, 2026, 2027].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {transactions.length === 0 ? (
        <p style={{ color: '#666' }}>No transactions found for this month.</p>
      ) : (
        transactions.map((t) => (
          <div key={t._id} className="transaction-item">
            <div>
              <p style={{ fontWeight: 'bold' }}>{t.category}</p>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>{t.description}</p>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>
                {new Date(t.date).toLocaleDateString()}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className={`amount ${t.type === 'income' ? 'income' : 'expense'}`}>
  {t.type === 'income' ? '+' : '-'}{Number(t.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} RWF
</span>
              <button className="delete-btn" onClick={() => handleDelete(t._id)}>
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Transactions;