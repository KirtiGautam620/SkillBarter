'use client';

import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/constants';
import Navbar from '../../components/Navbar';

export default function MySwaps() {
  const [swaps, setSwaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/swaps/my-swaps`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setSwaps(data.swaps || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleStatusUpdate = async (id: string, action: string) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/swaps/${id}/${action}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        alert(`Swap ${action}ed successfully!`);
        window.location.reload();
      } else {
        const error = await res.json();
        alert(error.error);
      }
    } catch (err) {
      alert('Action failed');
    }
  };

  return (
    <main>
      <Navbar />
      <div className="container animate-fade-in" style={{ marginTop: '2rem' }}>
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem' }}>My <span className="gradient-text">Swaps</span></h1>
          <p style={{ color: '#94a3b8' }}>Manage your incoming and outgoing skill swap requests.</p>
        </header>

        {loading ? (
          <p>Loading swaps...</p>
        ) : (
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))' }}>
            {swaps.map((swap) => (
              <div key={swap.id} className="glass card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className={`badge ${swap.status === 'COMPLETED' ? 'badge-success' : swap.status === 'ACCEPTED' ? 'badge-primary' : 'badge-warning'}`} style={{ color: 'white', background: swap.status === 'COMPLETED' ? 'var(--success)' : swap.status === 'ACCEPTED' ? 'var(--primary)' : 'var(--warning)', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem' }}>
                    {swap.status}
                  </span>
                  <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{swap.hoursOffered} hrs</span>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Offered</div>
                    <div style={{ fontWeight: '600' }}>{swap.offeredSkill?.title || swap.offeredSkillTitle || 'Skill'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Requested</div>
                    <div style={{ fontWeight: '600' }}>{swap.requestedSkill?.title || swap.requestedSkillTitle || 'Skill'}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <span style={{ color: '#94a3b8' }}>Partner:</span>
                  <span style={{ fontWeight: '600' }}>
                    {(() => {
                      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                      if (!token) return 'User';
                      try {
                        const decoded = JSON.parse(atob(token.split('.')[1]));
                        return decoded.id === swap.requesterId ? (swap.receiverName || 'Receiver') : (swap.requesterName || 'Requester');
                      } catch { return 'User'; }
                    })()}
                  </span>
                </div>

                {swap.message && (
                  <div style={{ background: 'var(--secondary)', padding: '1rem', borderRadius: '8px', fontSize: '0.875rem' }}>
                    <span style={{ color: '#94a3b8' }}>Message: </span>{swap.message}
                  </div>
                )}

                {swap.status === 'ACCEPTED' && swap.session?.meetingLink && (
                  <div style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '1rem', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 'bold', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Communication Link</div>
                    <a 
                      href={swap.session.meetingLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '0.5rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                      <span>📹</span> Join Learning Session
                    </a>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  {(() => {
                    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                    if (!token) return null;
                    try {
                      const decoded = JSON.parse(atob(token.split('.')[1]));
                      const isReceiver = decoded.id === swap.receiverId;

                      if (swap.status === 'PENDING') {
                        if (isReceiver) {
                          return (
                            <>
                              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleStatusUpdate(swap.id, 'accept')}>Accept</button>
                              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => handleStatusUpdate(swap.id, 'reject')}>Reject</button>
                            </>
                          );
                        } else {
                          return <div style={{ flex: 1, textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem', padding: '0.5rem', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '8px' }}>Waiting for Partner...</div>;
                        }
                      }

                      if (swap.status === 'ACCEPTED') {
                        return <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleStatusUpdate(swap.id, 'complete')}>Mark Completed</button>;
                      }

                      if (swap.status === 'COMPLETED') {
                        return <button className="btn btn-secondary" style={{ flex: 1 }} disabled>Feedback Given</button>;
                      }
                      
                      return null;
                    } catch { return null; }
                  })()}
                </div>
              </div>
            ))}
            {swaps.length === 0 && <p style={{ color: '#94a3b8' }}>You have no active swap requests.</p>}
          </div>
        )}
      </div>
    </main>
  );
}
