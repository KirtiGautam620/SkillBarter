'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { User } from '@/types';
import { API_BASE_URL } from '@/constants';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setName(data.user.name);
        setBio(data.user.bio || '');
      } else {
        setError(data.error || 'Failed to fetch profile');
      }
    } catch (err) {
      setError('An error occurred while fetching profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, bio }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('An error occurred while updating profile');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
        <div style={{ color: '#8b5cf6', fontSize: '1.5rem', fontWeight: 'bold' }}>Loading Profile...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: '\"Outfit\", sans-serif' }}>
      <Navbar />
      
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
        {/* Profile Header Card */}
        <div style={{ 
          background: 'rgba(30, 41, 59, 0.7)', 
          backdropFilter: 'blur(12px)', 
          borderRadius: '24px', 
          border: '1px solid rgba(255, 255, 255, 0.1)', 
          padding: '3rem',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '3rem',
          marginBottom: '3rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}>
          {/* Avatar Area */}
          <div style={{ 
            width: '160px', 
            height: '160px', 
            borderRadius: '20px', 
            background: 'linear-gradient(135deg, #8b5cf6 0%, #38bdf8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '4rem',
            fontWeight: '900',
            color: 'white',
            boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)',
            flexShrink: 0
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div style={{ flexGrow: 1 }}>
            <div style={{ 
              display: 'inline-block',
              padding: '0.25rem 0.75rem',
              borderRadius: '99px',
              background: 'rgba(139, 92, 246, 0.2)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              color: '#c4b5fd',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '1rem'
            }}>
              Official Member
            </div>
            
            <h1 style={{ fontSize: '3.5rem', fontWeight: '800', margin: '0 0 0.5rem 0', letterSpacing: '-0.02em', color: 'white' }}>
              {isEditing ? (
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid #8b5cf6', borderRadius: '8px', padding: '0.5rem 1rem', color: 'white', width: '100%' }}
                />
              ) : user?.name}
            </h1>
            
            <p style={{ fontSize: '1.25rem', color: '#94a3b8', margin: '0 0 2rem 0' }}>{user?.email}</p>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
                  Edit Profile
                </button>
              ) : (
                <>
                  <button onClick={() => setIsEditing(false)} className="btn btn-secondary">Cancel</button>
                  <button onClick={handleUpdate} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>Save Changes</button>
                </>
              )}
            </div>
          </div>

          {/* Stats Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { label: 'Rating', val: user?.rating?.toFixed(1) || '0.0', icon: '⭐' },
              { label: 'Reviews', val: user?.reviewCount || 0, icon: '💬' },
              { label: 'Swaps', val: '12', icon: '🔄' },
              { label: 'Points', val: '450', icon: '✨' }
            ].map((s, i) => (
              <div key={i} style={{ 
                background: 'rgba(255,255,255,0.03)', 
                border: '1px solid rgba(255,255,255,0.05)',
                padding: '1.25rem',
                borderRadius: '16px',
                textAlign: 'center',
                minWidth: '120px'
              }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{s.label}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1rem' }}>{s.icon}</span> {s.val}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
          {/* Main Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <section>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ width: '4px', height: '24px', background: '#8b5cf6', borderRadius: '4px' }}></span>
                About Me
              </h2>
              <div style={{ 
                background: 'rgba(30, 41, 59, 0.4)', 
                padding: '2.5rem', 
                borderRadius: '24px', 
                border: '1px solid rgba(255,255,255,0.05)',
                fontSize: '1.15rem',
                lineHeight: '1.8',
                color: '#cbd5e1'
              }}>
                {isEditing ? (
                  <textarea 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    style={{ width: '100%', height: '200px', background: 'transparent', border: 'none', color: 'white', resize: 'none', outline: 'none' }}
                  />
                ) : (
                  user?.bio || 'Introduce yourself to the community...'
                )}
              </div>
            </section>

            <section>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ width: '4px', height: '24px', background: '#38bdf8', borderRadius: '4px' }}></span>
                Achievements
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {[
                  { t: 'Top Swapper', d: '10+ Skill sessions', e: '🏆' },
                  { t: 'Fast Learner', d: '5 New skills verified', e: '⚡' },
                  { t: 'Community Pillar', d: '20+ Positive reviews', e: '🫂' },
                  { t: 'Pioneer', d: 'Early platform member', e: '🌱' }
                ].map((a, i) => (
                  <div key={i} style={{ 
                    background: 'rgba(255,255,255,0.02)', 
                    padding: '1.5rem', 
                    borderRadius: '20px', 
                    border: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem'
                  }}>
                    <div style={{ fontSize: '2rem' }}>{a.e}</div>
                    <div>
                      <div style={{ fontWeight: '700', color: 'white' }}>{a.t}</div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{a.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: 'rgba(30, 41, 59, 0.4)', borderRadius: '24px', padding: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', color: 'white' }}>Settings & Safety</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(255,255,255,0.05)', 
                  padding: '1rem', 
                  borderRadius: '12px', 
                  color: 'white', 
                  textAlign: 'left',
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}>Update Password</button>
                <button style={{ 
                  background: 'rgba(239, 68, 68, 0.05)', 
                  border: '1px solid rgba(239, 68, 68, 0.1)', 
                  padding: '1rem', 
                  borderRadius: '12px', 
                  color: '#ef4444', 
                  textAlign: 'left',
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}>Delete Account</button>
              </div>
            </div>

            <div style={{ 
              background: 'linear-gradient(135deg, #8b5cf6 0%, #38bdf8 100%)', 
              borderRadius: '24px', 
              padding: '2rem', 
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h4 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '1rem', lineHeight: '1.2' }}>Upgrade to <br/> SkillBarter Pro ✨</h4>
                <p style={{ fontSize: '0.9rem', marginBottom: '2rem', opacity: '0.9' }}>Get priority listing on market and unlimited swap requests.</p>
                <button style={{ background: 'white', color: '#0f172a', border: 'none', width: '100%', padding: '1rem', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}>Unlock Everything</button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
