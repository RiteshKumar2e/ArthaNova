import React from 'react';
import styles from '../../../styles/pages/app/admin/ContentManagement.module.css';

export default function ContentManagement() {
  const CONTENT_ITEMS = [
    { id: 1, title: 'RBI POLICY AND MARKET IMPACT', type: 'INSIGHT', author: 'AI AGENT 1', status: 'PUBLISHED', date: 'MAR 18' },
    { id: 2, title: 'ADANI GROUP DEBT ANALYSIS', type: 'NEWS', author: 'ADMIN MAIN', status: 'DRAFT', date: 'MAR 17' },
    { id: 3, title: 'NIFTY 50 TECHNICAL SETUP', type: 'FORECAST', author: 'AI ANALYTICS', status: 'IN REVIEW', date: 'MAR 16' },
  ];

  return (
    <div className={styles.container + " animate-fadeIn"}>
      <div className="page-header">
        <div>
          <h1 className="page-title">CONTENT MANAGEMENT 📝</h1>
          <p className="page-subtitle">MANAGE NEWS FEEDS, AI INSIGHTS, AND PLATFORM-GENERATED ANALYSIS.</p>
        </div>
        <button className="btn btn-primary btn-sm">➕ DRAFT NEW INSIGHT</button>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>PUBLISHED THIS WEEK</div>
          <div className={styles.statValue}>48</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>PENDING REVIEW</div>
          <div className={styles.statValue}>12</div>
        </div>
        <div className={styles.statCard}>
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
              {CONTENT_ITEMS.map(item => (
                <tr key={item.id}>
                  <td><strong className={styles.title}>{item.title}</strong></td>
                  <td><span className={styles.typeBadge}>{item.type}</span></td>
                  <td><span style={{ fontWeight: 800 }}>{item.author}</span></td>
                  <td>
                    <span className={`${styles.statusBadge} ${
                      item.status === 'PUBLISHED' ? styles.statusPublished : 
                      item.status === 'DRAFT' ? styles.statusDraft : styles.statusReview
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td><span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#666' }}>{item.date}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                      <button className="btn btn-sm btn-secondary" style={{ padding: '6px 12px', fontSize: '0.65rem' }}>EDIT</button>
                      <button className="btn btn-sm btn-danger" style={{ padding: '6px 12px', fontSize: '0.65rem' }}>DELETE</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
