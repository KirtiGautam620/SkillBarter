'use client';

import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/constants';
import Navbar from '../../components/Navbar';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    balance: 0,
    activeSwaps: 0,
    totalEarned: 0,
    totalSpent: 0
  });

  useEffect(() => {
    // Mocking user and stats for now, in a real app these would be API calls
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    
    // Fetch user stats from balance API
    const token = localStorage.getItem('token');
    if (token) {
        fetch(`${API_BASE_URL}/credits/balance`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            if (data.account) {
                setStats({
                    balance: data.account.balance,
                    activeSwaps: 2, // Mocked for UI
                    totalEarned: data.account.totalEarned,
                    totalSpent: data.account.totalSpent
                });
            }
        });
    }
  }, []);

  return (
    <main>
      <Navbar />
      <div className="container animate-fade-in" style={{ marginTop: '2rem' }}>
        <header style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            Welcome back, <span className="gradient-text">{user?.name || 'User'}</span>!
          </h1>
          <p style={{ color: '#94a3b8' }}>Here's what's happening with your skill swaps today.</p>
        </header>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginBottom: '3rem' }}>
          <div className="glass card">
            <h3 style={{ color: '#94a3b8', fontSize: '0.875rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Time Credits</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }} className="gradient-text">{stats.balance} hrs</div>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Available to spend</p>
          </div>
          <div className="glass card">
            <h3 style={{ color: '#94a3b8', fontSize: '0.875rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Active Swaps</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.activeSwaps}</div>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Ongoing learning sessions</p>
          </div>
          <div className="glass card">
            <h3 style={{ color: '#94a3b8', fontSize: '0.875rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Total Earned</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>{stats.totalEarned} hrs</div>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Credits earned by teaching</p>
          </div>
          <div className="glass card">
            <h3 style={{ color: '#94a3b8', fontSize: '0.875rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Total Spent</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--danger)' }}>{stats.totalSpent} hrs</div>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Credits spent on learning</p>
          </div>
        </div>

        <section style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <div>
            <h2 style={{ marginBottom: '1.5rem' }}>Recent Activity</h2>
            <div className="glass" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
              No recent activity to show. Explore the <a href="/market" style={{ color: 'var(--primary)', fontWeight: '600' }}>Market</a> to start swapping!
            </div>
          </div>
          <div>
            <h2 style={{ marginBottom: '1.5rem' }}>Notifications</h2>
            <div className="glass" style={{ padding: '1.5rem' }}>
              <div style={{ padding: '0.75rem', borderBottom: '1px solid var(--glass-border)', fontSize: '0.875rem' }}>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Welcome to SkillBarter!</div>
                <div style={{ color: '#94a3b8' }}>Start by adding your skills.</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
