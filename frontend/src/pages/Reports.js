import React, { useState, useEffect } from 'react';
import api from '../api';
import * as XLSX from 'xlsx';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#4f46e5', '#10b981', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#06b6d4', '#ec4899'];

function Reports() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [year]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const months = Array.from({ length: 12 }, (_, i) => i + 1);
      const results = await Promise.all(
        months.map((m) => api.get(`/transactions/summary?month=${m}&year=${year}`))
      );

      const monthly = results.map((res, i) => ({
        month: new Date(0, i).toLocaleString('default', { month: 'short' }),
        Income: res.data.income,
        Expenses: res.data.expenses,
        Balance: res.data.balance,
      }));
      setMonthlyData(monthly);

      const allTransactions = await api.get('/transactions');
      const catMap = {};
      allTransactions.data
        .filter(t => t.type === 'expense' && new Date(t.date).getFullYear() === Number(year))
        .forEach(t => {
          catMap[t.category] = (catMap[t.category] || 0) + t.amount;
        });

      const catData = Object.entries(catMap).map(([name, value]) => ({ name, value }));
      setCategoryData(catData);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const formatAmount = (amount) =>
    Number(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const totalIncome = monthlyData.reduce((sum, m) => sum + m.Income, 0);
  const totalExpenses = monthlyData.reduce((sum, m) => sum + m.Expenses, 0);
  const totalBalance = totalIncome - totalExpenses;
  const savingsRateVal = totalIncome > 0 ? Math.round((totalBalance / totalIncome) * 100) : 0;

  const bestMonth = monthlyData.reduce((best, m) => m.Balance > (best?.Balance || -Infinity) ? m : best, null);
  const worstMonth = monthlyData.reduce((worst, m) => m.Expenses > (worst?.Expenses || -Infinity) ? m : worst, null);

  const handleExportExcel = async () => {
    try {
      const res = await api.get('/transactions');
      const transactions = res.data;

      const totalInc = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const totalExp = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      const balance = totalInc - totalExp;
      const savRate = totalInc > 0 ? Math.round((balance / totalInc) * 100) : 0;

      const wb = XLSX.utils.book_new();

      const summaryData = [
        ['BUDGET TRACKER — FINANCIAL REPORT'],
        [],
        ['Generated', new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })],
        ['Report Year', year],
        ['Total Transactions', transactions.length],
        [],
        ['SUMMARY'],
        ['Total Income', totalInc],
        ['Total Expenses', totalExp],
        ['Net Balance', balance],
        ['Savings Rate', `${savRate}%`],
      ];
      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      summarySheet['!cols'] = [{ wch: 25 }, { wch: 30 }];
      XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');

      const txHeaders = ['#', 'Date', 'Type', 'Category', 'Description', 'Amount (RWF)', 'Running Balance (RWF)'];
      let runningBalance = 0;
      const txRows = transactions.map((t, i) => {
        runningBalance += t.type === 'income' ? t.amount : -t.amount;
        return [
          i + 1,
          new Date(t.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          t.type.toUpperCase(),
          t.category,
          t.description || '—',
          t.amount,
          runningBalance,
        ];
      });
      const txSheet = XLSX.utils.aoa_to_sheet([txHeaders, ...txRows]);
      txSheet['!cols'] = [{ wch: 5 }, { wch: 18 }, { wch: 12 }, { wch: 18 }, { wch: 25 }, { wch: 20 }, { wch: 22 }];
      XLSX.utils.book_append_sheet(wb, txSheet, 'Transactions');

      const catMap = {};
      transactions.filter(t => t.type === 'expense').forEach(t => {
        catMap[t.category] = (catMap[t.category] || 0) + t.amount;
      });
      const catHeaders = ['Category', 'Total Spent (RWF)', 'Percentage'];
      const catRows = Object.entries(catMap)
        .sort((a, b) => b[1] - a[1])
        .map(([cat, amount]) => [cat, amount, `${totalExp > 0 ? Math.round((amount / totalExp) * 100) : 0}%`]);
      const catSheet = XLSX.utils.aoa_to_sheet([catHeaders, ...catRows]);
      catSheet['!cols'] = [{ wch: 20 }, { wch: 22 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(wb, catSheet, 'By Category');

      XLSX.writeFile(wb, `Budget-Report-${year}.xlsx`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="topbar">
        <div>
          <h1>Reports</h1>
          <p>Your financial overview for {year}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select value={year} onChange={(e) => setYear(e.target.value)}
            style={{ padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid #e8e8e8', fontSize: '0.9rem' }}>
            {[2024, 2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <button className="btn" onClick={handleExportExcel}>📥 Export Excel</button>
        </div>
      </div>

      {loading ? (
        <p style={{ color: '#aaa', textAlign: 'center', padding: '2rem' }}>Loading reports...</p>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '1.2rem 1.5rem', border: '1px solid #f0f0f0' }}>
              <p style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '0.3rem' }}>Total Income</p>
              <p style={{ fontSize: '1.2rem', fontWeight: '700', color: '#10b981' }}>{formatAmount(totalIncome)} RWF</p>
            </div>
            <div style={{ background: 'white', borderRadius: '16px', padding: '1.2rem 1.5rem', border: '1px solid #f0f0f0' }}>
              <p style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '0.3rem' }}>Total Expenses</p>
              <p style={{ fontSize: '1.2rem', fontWeight: '700', color: '#ef4444' }}>{formatAmount(totalExpenses)} RWF</p>
            </div>
            <div style={{ background: 'white', borderRadius: '16px', padding: '1.2rem 1.5rem', border: '1px solid #f0f0f0' }}>
              <p style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '0.3rem' }}>Net Balance</p>
              <p style={{ fontSize: '1.2rem', fontWeight: '700', color: '#3b82f6' }}>{formatAmount(totalBalance)} RWF</p>
            </div>
            <div style={{ background: 'white', borderRadius: '16px', padding: '1.2rem 1.5rem', border: '1px solid #f0f0f0' }}>
              <p style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '0.3rem' }}>Savings Rate</p>
              <p style={{ fontSize: '1.2rem', fontWeight: '700', color: '#8b5cf6' }}>{savingsRateVal}%</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: '#e8faf0', borderRadius: '16px', padding: '1.2rem 1.5rem', border: '1px solid #10b981' }}>
              <p style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: '600', marginBottom: '0.3rem' }}>🏆 Best Month</p>
              <p style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1a1a2e' }}>{bestMonth?.month || 'N/A'}</p>
              <p style={{ fontSize: '0.85rem', color: '#aaa' }}>Balance: {formatAmount(bestMonth?.Balance || 0)} RWF</p>
            </div>
            <div style={{ background: '#fef0f0', borderRadius: '16px', padding: '1.2rem 1.5rem', border: '1px solid #ef4444' }}>
              <p style={{ fontSize: '0.85rem', color: '#ef4444', fontWeight: '600', marginBottom: '0.3rem' }}>📉 Highest Spending Month</p>
              <p style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1a1a2e' }}>{worstMonth?.month || 'N/A'}</p>
              <p style={{ fontSize: '0.85rem', color: '#aaa' }}>Expenses: {formatAmount(worstMonth?.Expenses || 0)} RWF</p>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #f0f0f0', marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', color: '#1a1a2e' }}>Monthly Income vs Expenses</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => `${formatAmount(value)} RWF`} />
                <Legend />
                <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #f0f0f0' }}>
              <h3 style={{ marginBottom: '1rem', color: '#1a1a2e' }}>Expense by Category</h3>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" outerRadius={90} dataKey="value">
                      {categoryData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${formatAmount(value)} RWF`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p style={{ color: '#aaa', textAlign: 'center', padding: '3rem 0' }}>No expense data for {year}</p>
              )}
            </div>

            <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #f0f0f0' }}>
              <h3 style={{ marginBottom: '1rem', color: '#1a1a2e' }}>Category Breakdown</h3>
              {categoryData.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {categoryData.map((cat, index) => {
                    const percentage = Math.round((cat.value / totalExpenses) * 100);
                    return (
                      <div key={cat.name}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#1a1a2e' }}>{cat.name}</span>
                          <span style={{ fontSize: '0.85rem', color: '#aaa' }}>{percentage}% — {formatAmount(cat.value)} RWF</span>
                        </div>
                        <div style={{ background: '#f0f2f5', borderRadius: '10px', height: '6px' }}>
                          <div style={{ width: `${percentage}%`, background: COLORS[index % COLORS.length], borderRadius: '10px', height: '6px' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ color: '#aaa', textAlign: 'center', padding: '3rem 0' }}>No expense data for {year}</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Reports;