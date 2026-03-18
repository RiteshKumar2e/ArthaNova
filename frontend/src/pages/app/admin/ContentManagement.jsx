import React from 'react';

export default function ContentManagement() {
  const CONTENT_ITEMS = [
    { id: 1, title: 'RBI Policy and Market Impact', type: 'Insight', author: 'AI Agent 1', status: 'Published', date: 'Mar 18' },
    { id: 2, title: 'Adani Group Debt Analysis', type: 'News', author: 'Admin Main', status: 'Draft', date: 'Mar 17' },
    { id: 3, title: 'Nifty 50 Technical Setup', type: 'Forecast', author: 'AI Analytics', status: 'In Review', date: 'Mar 16' },
  ];

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">Content Management 📝</h1>
          <p className="page-subtitle">Manage news feeds, AI insights, and platform-generated analysis.</p>
        </div>
        <button className="btn btn-primary">➕ Draft New Insight</button>
      </div>

      <div className="grid-3" style={{ marginBottom: 24 }}>
        <div className="metric-card">
          <div className="metric-label">Published This Week</div>
          <div className="metric-value">48</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Pending Review</div>
          <div className="metric-value">12</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">AI Generated Drafts</div>
          <div className="metric-value">156</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Recent Content Activity</h3>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Author</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {CONTENT_ITEMS.map(item => (
                <tr key={item.id}>
                  <td><strong>{item.title}</strong></td>
                  <td><span className="badge badge-secondary">{item.type}</span></td>
                  <td>{item.author}</td>
                  <td>
                    <span className={`badge ${item.status === 'Published' ? 'badge-success' : item.status === 'Draft' ? 'badge-warning' : 'badge-primary'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>{item.date}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-sm btn-secondary">Edit</button>
                      <button className="btn btn-sm btn-danger">Delete</button>
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
