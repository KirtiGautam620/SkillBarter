'use client';

import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/constants';
import Navbar from '../../components/Navbar';

export default function MySkills() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newSkill, setNewSkill] = useState({
    title: '',
    description: '',
    category: 'Technology',
    level: 'Beginner'
  });

  useEffect(() => {
    fetchMySkills();
  }, []);

  const fetchMySkills = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/skills/my-skills`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setSkills(data.skills || []);
    setLoading(false);
  };

  const handleAddSkill = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/skills`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newSkill)
    });
    if (res.ok) {
      alert('Skill added!');
      setShowModal(false);
      setNewSkill({ title: '', description: '', category: 'Technology', level: 'Beginner' });
      fetchMySkills();
    } else {
      alert('Failed to add skill');
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/skills/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      alert('Skill deleted!');
      fetchMySkills();
    }
  };

  return (
    <main>
      <Navbar />
      <div className="container animate-fade-in" style={{ marginTop: '2rem' }}>
        <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem' }}>My <span className="gradient-text">Skills</span></h1>
            <p style={{ color: '#94a3b8' }}>Skills you are offering to the community.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>Add New Skill</button>
        </header>

        {loading ? (
          <p>Loading your skills...</p>
        ) : (
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {skills.map((skill) => (
              <div key={skill.id} className="glass card" style={{ position: 'relative' }}>
                <span className="badge badge-primary" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>{skill.category}</span>
                <h3 style={{ marginBottom: '0.5rem' }}>{skill.title}</h3>
                <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '1.5rem' }}>{skill.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Level: {skill.level}</span>
                  <button className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', color: 'var(--danger)' }} onClick={() => handleDeleteSkill(skill.id)}>Delete</button>
                </div>
              </div>
            ))}
            {skills.length === 0 && <p style={{ color: '#94a3b8' }}>You haven't added any skills yet.</p>}
          </div>
        )}

      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
          <div className="glass card animate-fade-in" style={{ width: '90%', maxWidth: '500px', padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Add <span className="gradient-text">New Skill</span></h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>Skill Title</label>
                <input type="text" value={newSkill.title} onChange={(e) => setNewSkill({...newSkill, title: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--secondary)', border: '1px solid var(--glass-border)', color: 'white' }} placeholder="e.g. React Development" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>Category</label>
                <select value={newSkill.category} onChange={(e) => setNewSkill({...newSkill, category: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--secondary)', border: '1px solid var(--glass-border)', color: 'white' }}>
                  <option>Technology</option>
                  <option>Business</option>
                  <option>Design</option>
                  <option>Communication</option>
                  <option>Lifestyle</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>Level</label>
                <select value={newSkill.level} onChange={(e) => setNewSkill({...newSkill, level: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--secondary)', border: '1px solid var(--glass-border)', color: 'white' }}>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Expert</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>Description</label>
                <textarea value={newSkill.description} onChange={(e) => setNewSkill({...newSkill, description: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--secondary)', border: '1px solid var(--glass-border)', color: 'white', minHeight: '80px' }} placeholder="Describe what you can teach"></textarea>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleAddSkill}>Add Skill</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
