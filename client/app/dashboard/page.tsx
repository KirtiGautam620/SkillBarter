'use client';

import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('toolkit');
  const [mySwaps, setMySwaps] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [marketSkills, setMarketSkills] = useState<any[]>([]);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [newSkill, setNewSkill] = useState({ title: '', description: '', category: '', level: 'Beginner' });
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<any>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', category: '', level: 'Beginner' });
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedMarketSkill, setSelectedMarketSkill] = useState<any>(null);
  const [offerSkillId, setOfferSkillId] = useState('');
  const [requestMessage, setRequestMessage] = useState('');

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewSwap, setReviewSwap] = useState<any>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  
  const [userId, setUserId] = useState('');
  const user = { name: "Explorer", credits: 15, rating: 4.8 };

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserId(payload.id);
      }
    } catch (e) { console.error('Failed to parse token', e); }
    fetchMySkills();
    fetchMarketSkills();
  }, []);

  useEffect(() => {
    if (userId) fetchMySwaps();
  }, [userId]);

  const fetchMySwaps = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('http://localhost:5001/api/swaps/my-swaps', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const parsedSwaps = data.swaps.map((sw: any) => ({
          ...sw,
          direction: sw.requesterId === userId ? 'OUTGOING' : 'INCOMING',
          requestedSkill: sw.requestedSkillTitle || sw.requestedSkillId,
          offeredSkill: sw.offeredSkillTitle || sw.offeredSkillId,
          otherPartyName: sw.requesterId === userId
            ? (sw.receiverName || sw.receiverId)
            : (sw.requesterName || sw.requesterId),
        }));
        setMySwaps(parsedSwaps);
      }
    } catch (err) { console.error('Error fetching swaps:', err); }
  };

  const handleSwapAction = async (id: string, action: string) => {
    try {
      const token = localStorage.getItem('token');
      let method = 'PATCH';
      let url = `http://localhost:5001/api/swaps/${id}/status`;
      let body: any = null;

      if (action === 'ACCEPT') body = { status: 'ACCEPTED' };
      if (action === 'REJECT') body = { status: 'REJECTED' };
      if (action === 'CANCEL') body = { status: 'CANCELLED' };
      if (action === 'COMPLETE') {
         method = 'POST';
         url = `http://localhost:5001/api/swaps/${id}/complete`;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        ...(body && { body: JSON.stringify(body) })
      });
      if (res.ok) {
        fetchMySwaps();
      } else {
        const err = await res.json().catch(() => ({}));
        alert(`Action failed: ${err.error || res.statusText}`);
      }
    } catch (e) {
      console.error('Swap action error:', e);
      alert('Network error. Please try again.');
    }
  };

  const handleRequestSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5001/api/swaps/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          receiverId: selectedMarketSkill.userId,
          offeredSkillId: offerSkillId,
          requestedSkillId: selectedMarketSkill.id,
          message: requestMessage
        })
      });
      if (res.ok) {
        setShowRequestModal(false);
        setRequestMessage('');
        fetchMySwaps();
        setActiveTab('path');
      } else alert('Failed to create request');
    } catch (e) { alert('Error'); }
    setLoading(false);
  };

  const handleReviewSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const revieweeId = reviewSwap.direction === 'INCOMING' ? reviewSwap.requesterId : reviewSwap.receiverId;
      const res = await fetch(`http://localhost:5001/api/swaps/${reviewSwap.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment, revieweeId })
      });
      if (res.ok) {
        setShowReviewModal(false);
        setReviewComment('');
        fetchMySwaps();
      } else alert('Failed to leave review');
    } catch (e) { alert('Error'); }
    setLoading(false);
  };

  const fetchMySkills = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('http://localhost:5001/api/skills/my-skills', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSkills(data.skills);
      }
    } catch(err) { console.error('Error fetching skills:', err); }
  };

  const fetchMarketSkills = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('http://localhost:5001/api/skills/market', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if(res.ok) {
        const data = await res.json();
        setMarketSkills(data.skills);
      }
    } catch(err) { console.error('Error fetching market:', err); }
  };

  const handleCreateSkill = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5001/api/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newSkill)
      });
      if (res.ok) {
        setShowSkillModal(false);
        setNewSkill({ title: '', description: '', category: '', level: 'Beginner' });
        fetchMySkills();
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(`Failed to create skill: ${errorData.error || res.statusText}`);
      }
    } catch (err: any) {
      alert(`Error connecting to server: ${err.message}`);
    }
    setLoading(false);
  };

  const handleEditSkill = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5001/api/skills/${editingSkill.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        setShowEditModal(false);
        fetchMySkills();
      } else alert('Failed to update skill');
    } catch (err) { alert('Error connecting to server'); }
    setLoading(false);
  };

  const handleDeleteSkill = async (skillId: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5001/api/skills/${skillId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchMySkills();
      else alert('Failed to delete skill');
    } catch (err) { alert('Error connecting to server'); }
  };

  const handleAction = (actionName: string) => {
    alert(`Triggering UML Workflow Action: ${actionName}`);
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      
      {/* Header Profile Section */}
      <div className="magical-card" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="glow-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Journey Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back!</p>
        </div>
        <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>🏆 <span className="gold-glow">{user.credits} hrs</span></div>
          <div style={{ fontSize: '0.9rem', color: '#e8d9ff' }}>Time Credits Balance</div>
        </div>
      </div>

      <div className="tab">
        <button className={`tab-btn ${activeTab === 'market' ? 'active' : ''}`} onClick={() => setActiveTab('market')}>
          Marketplace
        </button>
        <button className={`tab-btn ${activeTab === 'path' ? 'active' : ''}`} onClick={() => setActiveTab('path')}>
          Active Journey
        </button>
        <button className={`tab-btn ${activeTab === 'toolkit' ? 'active' : ''}`} onClick={() => setActiveTab('toolkit')}>
          Skills
        </button>
      </div>

      {activeTab === 'market' && (
        <div className="grid">
          {marketSkills.length === 0 ? <p>No skills found in the market.</p> : marketSkills.map(s => (
            <div key={s.id} className="magical-card" style={{ position: 'relative' }}>
              <span className="badge" style={{ position: 'absolute', top: '1rem', right: '1rem' }}>{s.level}</span>
              <h3>{s.title}</h3>
              <p style={{ color: '#e8d9ff', fontSize: '0.9rem', marginTop: '0.5rem' }}>{s.description}</p>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', marginTop: '0.5rem' }}>By: {s.userName || s.userId}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="gold-glow" style={{ fontWeight: 'bold' }}>⏱️ 1 hr</span>
                <button className="btn" onClick={() => { setSelectedMarketSkill(s); setShowRequestModal(true); }}>Request Swap</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'path' && (
        <div>
          <h2 style={{ marginBottom: '1.5rem', color: '#e8d9ff' }}>Your Current Steps</h2>
          <div className="grid">
            {mySwaps.map(swap => (
              <div key={swap.id} className="magical-card">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span className={`badge ${swap.status === 'ACCEPTED' ? 'success-badge' : 'pending-badge'}`}>{swap.status}</span>
                  <span className="badge">{swap.direction}</span>
                </div>
                <h3 style={{ marginBottom: '0.25rem' }}>{swap.requestedSkill}</h3>
                <p style={{ color: '#a78bfa', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                  {swap.direction === 'INCOMING' ? `From: ${swap.otherPartyName}` : `To: ${swap.otherPartyName}`}
                </p>
                {swap.offeredSkill && (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    Offering: <span style={{ color: '#fbbf24' }}>{swap.offeredSkill}</span>
                  </p>
                )}
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>"{swap.message}"</p>
                
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {swap.status === 'PENDING' && swap.direction === 'INCOMING' && (
                    <><button className="btn" onClick={() => handleSwapAction(swap.id, 'ACCEPT')}>Accept</button><button className="btn btn-secondary" onClick={() => handleSwapAction(swap.id, 'REJECT')}>Reject</button></>
                  )}
                  {swap.status === 'PENDING' && swap.direction === 'OUTGOING' && (
                    <button className="btn btn-secondary" onClick={() => handleSwapAction(swap.id, 'CANCEL')}>Cancel Request</button>
                  )}
                  {swap.status === 'ACCEPTED' && (
                    <button className="btn" onClick={() => handleSwapAction(swap.id, 'COMPLETE')} style={{ background: '#047857' }}>Complete Session</button>
                  )}
                  {swap.status === 'COMPLETED' && (
                    <button className="btn btn-secondary" onClick={() => { setReviewSwap(swap); setShowReviewModal(true); }}>Leave Review</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'toolkit' && (
        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ color: '#e8d9ff' }}>Skills I Offer</h2>
            <button className="signpost-btn" onClick={() => setShowSkillModal(true)} style={{ padding: '0.5rem 1rem', minWidth: '120px', fontSize: '0.9rem' }}>Add Skill</button>
          </div>
          <div className="grid">
            {skills.length === 0 ? <p>You haven't added any skills yet. Click Add Skill to start!</p> : skills.map((skill: any) => (
              <div key={skill.id} className="magical-card">
                <h3>{skill.title}</h3>
                <p style={{ color: '#e8d9ff', fontSize: '0.9rem', marginTop: '0.5rem' }}>{skill.description}</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <span className="badge">{skill.level}</span>
                  <span className="badge" style={{background:'rgba(255,255,255,0.05)'}}>{skill.category}</span>
                </div>
                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                  <button className="btn" onClick={() => {
                    setEditingSkill(skill);
                    setEditForm({ title: skill.title, description: skill.description, category: skill.category, level: skill.level });
                    setShowEditModal(true);
                  }}>Edit</button>
                  <button className="btn btn-secondary" onClick={() => handleDeleteSkill(skill.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EDIT SKILL MODAL */}
      {showEditModal && editingSkill && (
        <div className="modal">
          <div className="modal-content">
            <h2 className="glow-text" style={{ marginBottom: '1.5rem' }}>Edit Skill</h2>
            <form onSubmit={handleEditSkill}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#e8d9ff' }}>Title</label>
                <input required type="text" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#e8d9ff' }}>Description</label>
                <textarea required rows={3} value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})}></textarea>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#e8d9ff' }}>Category</label>
                <input required type="text" value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})} />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#e8d9ff' }}>Proficiency Level</label>
                <select value={editForm.level} onChange={e => setEditForm({...editForm, level: e.target.value})}>
                  <option value="Beginner" style={{ color: 'black' }}>Beginner</option>
                  <option value="Intermediate" style={{ color: 'black' }}>Intermediate</option>
                  <option value="Advanced" style={{ color: 'black' }}>Advanced</option>
                  <option value="Expert" style={{ color: 'black' }}>Expert</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="btn" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE SKILL MODAL */}
      {showSkillModal && (
        <div className="modal">
          <div className="modal-content">
            <h2 className="glow-text" style={{ marginBottom: '1.5rem' }}>Add New Skill</h2>
            <form onSubmit={handleCreateSkill}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#e8d9ff' }}>Title</label>
                <input required type="text" placeholder="e.g. JavaScript Basics" value={newSkill.title} onChange={e => setNewSkill({...newSkill, title: e.target.value})} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#e8d9ff' }}>Description</label>
                <textarea required placeholder="What exactly can you teach?" rows={3} value={newSkill.description} onChange={e => setNewSkill({...newSkill, description: e.target.value})}></textarea>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#e8d9ff' }}>Category</label>
                <input required type="text" placeholder="e.g. Programming, Art, Fitness" value={newSkill.category} onChange={e => setNewSkill({...newSkill, category: e.target.value})} />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#e8d9ff' }}>Proficiency Level</label>
                <select value={newSkill.level} onChange={e => setNewSkill({...newSkill, level: e.target.value})}>
                  <option value="Beginner" style={{ color: 'black' }}>Beginner</option>
                  <option value="Intermediate" style={{ color: 'black' }}>Intermediate</option>
                  <option value="Advanced" style={{ color: 'black' }}>Advanced</option>
                  <option value="Expert" style={{ color: 'black' }}>Expert</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowSkillModal(false)}>Cancel</button>
                <button type="submit" className="btn" disabled={loading}>{loading ? 'Saving...' : 'Save Skill'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REQUEST SWAP MODAL */}
      {showRequestModal && (
        <div className="modal">
          <div className="modal-content">
            <h2 className="glow-text" style={{ marginBottom: '1.5rem' }}>Request Swap</h2>
            <p style={{ marginBottom: '1rem' }}>Requesting: <strong>{selectedMarketSkill?.title}</strong></p>
            <form onSubmit={handleRequestSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#e8d9ff' }}>What skill will you offer in return?</label>
                <select required value={offerSkillId} onChange={e => setOfferSkillId(e.target.value)}>
                  <option value="" style={{ color: 'black' }}>Select a skill...</option>
                  {skills.map(s => (
                    <option key={s.id} value={s.id} style={{ color: 'black' }}>{s.title}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#e8d9ff' }}>Message</label>
                <textarea required placeholder="Why do you want to swap?" rows={3} value={requestMessage} onChange={e => setRequestMessage(e.target.value)}></textarea>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowRequestModal(false)}>Cancel</button>
                <button type="submit" className="btn" disabled={loading || !offerSkillId}>{loading ? 'Sending...' : 'Send Request'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REVIEW MODAL */}
      {showReviewModal && (
        <div className="modal">
          <div className="modal-content">
            <h2 className="glow-text" style={{ marginBottom: '1.5rem' }}>Leave a Review</h2>
            <form onSubmit={handleReviewSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#e8d9ff' }}>Rating (1-5)</label>
                <input type="number" min="1" max="5" required value={reviewRating} onChange={e => setReviewRating(Number(e.target.value))} />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#e8d9ff' }}>Comment</label>
                <textarea placeholder="How was your session?" rows={3} value={reviewComment} onChange={e => setReviewComment(e.target.value)}></textarea>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowReviewModal(false)}>Cancel</button>
                <button type="submit" className="btn" disabled={loading}>{loading ? 'Submitting...' : 'Submit Review'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

