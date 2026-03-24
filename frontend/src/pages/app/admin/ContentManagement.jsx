import React, { useState } from 'react';
import styles from '../../../styles/pages/app/admin/ContentManagement.module.css';

export default function ContentManagement() {
  const [content, setContent] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [newContent, setNewContent] = useState({ title: '', type: 'INSIGHT' });

  const handleDelete = (id) => {
    if (window.confirm('ARE YOU SURE YOU WANT TO DELETE THIS CONTENT?')) {
      setContent(content.filter(item => item.id !== id));
      alert('CONTENT DELETED SUCCESSFULLY');
    }
  };

  const handleCreateContent = (e) => {
    e.preventDefault();
    const newItem = {
      ...newContent,
      id: Date.now(),
      title: newContent.title.toUpperCase(),
      author: 'ADMIN MAIN',
      status: 'DRAFT',
      date: 'NEW'
    };
    setContent([newItem, ...content]);
    setShowModal(false);
    setNewContent({ title: '', type: 'INSIGHT' });
    alert('CONTENT DRAFT CREATED');
  };

  return (
    <div className={styles.container + " animate-fadeIn"}>
      <div className="page-header">
        <div>
          <h1 className="page-title">CONTENT MANAGEMENT 📝</h1>
          <p className="page-subtitle">MANAGE NEWS FEEDS, AI INSIGHTS, AND PLATFORM-GENERATED ANALYSIS.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>➕ DRAFT NEW INSIGHT</button>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard} onClick={() => alert('FILTERING PUBLISHED CONTENT...')}>
          <div className={styles.statLabel}>PUBLISHED THIS WEEK</div>
          <div className={styles.statValue}>48</div>
        </div>
        <div className={styles.statCard} onClick={() => alert('FILTERING PENDING REVIEWS...')}>
          <div className={styles.statLabel}>PENDING REVIEW</div>
          <div className={styles.statValue}>12</div>
        </div>
        <div className={styles.statCard} onClick={() => alert('FILTERING AI DRAFTS...')}>
          <div className={styles.statLabel}>AI GENERATED DRAFTS</div>
          <div className={styles.statValue}>156</div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>RECENT CONTENT ACTIVITY</h3>
        </div>
        <div className="table-responsive">
          <table className={styles.contentTable}>
            <thead>
              <tr>
                <th>CONTENT TITLE</th>
                <th>TYPE</th>
                <th>AUTHOR</th>
                <th>STATUS</th>
                <th>DATE</th>
                <th style={{ textAlign: 'center' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {content.map(item => (
                <tr key={item.id}>
                  <td><strong className={styles.title}>{item.title}</strong></td>
                  <td><span className={styles.typeBadge}>{item.type}</span></td>
                  <td><span style={{ fontWeight: 800 }}>{item.author}</span></td>
                  <td>
                    <button 
                      className={`${styles.statusBadge} ${
                        item.status === 'PUBLISHED' ? styles.statusPublished : 
                        item.status === 'DRAFT' ? styles.statusDraft : styles.statusReview
                      }`}
                      style={{ border: 'none', cursor: 'pointer' }}
                      onClick={() => alert(`CHANGING STATUS FOR: ${item.title}`)}
                    >
                      {item.status}
                    </button>
                  </td>
                  <td><span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#666' }}>{item.date}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                      <button className="btn btn-sm btn-secondary" style={{ padding: '6px 12px', fontSize: '0.65rem' }} onClick={() => alert('OPENING EDITOR...')}>EDIT</button>
                      <button className="btn btn-sm btn-danger" style={{ padding: '6px 12px', fontSize: '0.65rem' }} onClick={() => handleDelete(item.id)}>DELETE</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', border: '4px solid #000', boxShadow: '8px 8px 0px #000', width: '90%', maxWidth: '400px' }}>
            <div style={{ background: 'var(--yellow)', padding: '12px', borderBottom: '4px solid #000', display: 'flex', justifyContent: 'space-between' }}>
              <h2 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 950 }}>DRAFT NEW INSIGHT</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontWeight: 950, cursor: 'pointer' }}>×</button>
            </div>
            <form onSubmit={handleCreateContent} style={{ padding: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: 950, fontSize: '0.6rem', marginBottom: '6px' }}>INSIGHT TITLE</label>
                <input 
                  className="form-control" 
                  style={{ width: '100%' }} 
                  required 
                  value={newContent.title}
                  onChange={(e) => setNewContent({...newContent, title: e.target.value})}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: 950, fontSize: '0.6rem', marginBottom: '6px' }}>CONTENT TYPE</label>
                <select 
                  className="form-control" 
                  style={{ width: '100%' }}
                  value={newContent.type}
                  onChange={(e) => setNewContent({...newContent, type: e.target.value})}
                >
                  <option value="INSIGHT">INSIGHT</option>
                  <option value="NEWS">NEWS</option>
                  <option value="FORECAST">FORECAST</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-sm btn-secondary" onClick={() => setShowModal(false)}>CANCEL</button>
                <button type="submit" className="btn btn-sm btn-primary">CREATE DRAFT</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
