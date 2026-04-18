'use client';

import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/constants';
import Navbar from '../../components/Navbar';

export default function Market() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [hours, setHours] = useState(1);

  useEffect(() => {
    fetch(`${API_BASE_URL}/skills/market`)
      .then(res => res.json())
      .then(data => {
        setSkills(data.skills || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleRequest = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/swaps/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId: selectedSkill.userId,
          requestedSkillId: selectedSkill.id,
          offeredSkillId: '1', // Mocked for now, in a real app would select own skill
          message,
          hoursOffered: hours
        })
      });
      if (res.ok) {
        alert('Swap request sent!');
        setShowModal(false);
      } else {
        const error = await res.json();
        alert(error.error);
      }
    } catch (err) {
      alert('Request failed');
    }
  };

  return (
    <main>
      <Navbar />
      <div className="container animate-fade-in" style={{ marginTop: '2rem' }}>
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem' }}>Skill <span className="gradient-text">Marketplace</span></h1>
          <p style={{ color: '#94a3b8' }}>Discover mentors and peers to swap skills with.</p>
        </header>

        {loading ? (
          <p>Loading skills...</p>
        ) : (
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {skills.map((skill) => (
              <div key={skill.id} className="glass card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <span className="badge badge-primary">{skill.category}</span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{skill.level}</span>
                </div>
                <h3 style={{ marginBottom: '0.5rem' }}>{skill.title}</h3>
                <p style={{ fontSize: '0.875rem', color: '#94a3b8', flex: 1, marginBottom: '1.5rem' }}>{skill.description}</p>
                <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.875rem' }}>
                    <span style={{ color: '#94a3b8' }}>by </span>
                    <span style={{ fontWeight: '600' }}>{skill.user?.name || 'User'}</span>
                  </div>
                  <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }} onClick={() => {
                    setSelectedSkill(skill);
                    setShowModal(true);
                  }}>Request Swap</button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {showModal && selectedSkill && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
          <div className="glass card animate-fade-in" style={{ width: '90%', maxWidth: '500px', padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Request Swap: <span className="gradient-text">{selectedSkill.title}</span></h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>Hours requested</label>
                <input type="number" value={hours} onChange={(e) => setHours(Number(e.target.value))} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--secondary)', border: '1px solid var(--glass-border)', color: 'white' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>Message (optional)</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--secondary)', border: '1px solid var(--glass-border)', color: 'white', minHeight: '100px' }} placeholder="Why do you want to swap?"></textarea>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleRequest}>Send Request</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
