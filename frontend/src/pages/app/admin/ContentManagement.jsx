import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../../api/client';
import { toast } from 'react-hot-toast';
import styles from '../../../styles/pages/app/admin/ContentManagement.module.css';

export default function ContentManagement() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newContent, setNewContent] = useState({ title: '', type: 'INSIGHT' });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await adminAPI.getContent();
      setContent(response.data || []);
    } catch (error) {
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('ARE YOU SURE YOU WANT TO DELETE THIS CONTENT?')) {
      try {
        await adminAPI.deleteContent(id);
        toast.success('Content deleted');
        fetchContent();
      } catch (error) {
        toast.error('Failed to delete content');
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await adminAPI.toggleContentStatus(id);
      toast.success('Status updated');
      fetchContent();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleCreateContent = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createContent(newContent);
      setShowModal(false);
      setNewContent({ title: '', type: 'INSIGHT' });
      toast.success('Content draft created');
      fetchContent();
    } catch (error) {
      toast.error('Failed to create content');
    }
  };

  const stats = {
    published: content.filter(c => c.status === 'PUBLISHED').length,
    review: content.filter(c => c.status === 'REVIEW').length,
    drafts: content.filter(c => c.status === 'DRAFT').length
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
        <div className={styles.statCard}>
          <div className={styles.statLabel}>PUBLISHED</div>
          <div className={styles.statValue}>{stats.published}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>PENDING REVIEW</div>
          <div className={styles.statValue}>{stats.review}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>DRAFTS</div>
          <div className={styles.statValue}>{stats.drafts}</div>
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
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: 40, fontWeight: 900 }}>LOADING CONTENT...</td></tr>
              ) : content.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: 40, color: '#999' }}>NO CONTENT FOUND.</td></tr>
              ) : content.map(item => (
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
                      onClick={() => handleToggleStatus(item.id)}
                    >
                      {item.status}
                    </button>
                  </td>
                  <td><span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#666' }}>{new Date(item.created_at).toLocaleDateString()}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                      <button className="btn btn-sm btn-secondary" style={{ padding: '6px 12px', fontSize: '0.65rem' }} onClick={() => toast.success('Editor coming soon')}>EDIT</button>
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
