import React from 'react';

export default function GlobalNotifications() {
  const NOTIFICATIONS = [
    { title: 'System Maintenance Scheduled', type: 'Global', author: 'System Admin', status: 'Draft', sentDate: 'N/A' },
    { title: 'New IPO Signal for HDFC Life', type: 'Targeted', author: 'AI Engine', status: 'Sent', sentDate: 'Mar 18, 10:15 AM' },
    { title: 'Welcome New Premium Users', type: 'Segmented', author: 'Marketing Main', status: 'Sent', sentDate: 'Mar 17, 09:00 AM' },
  ];

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">Notification System 🔔</h1>
          <p className="page-subtitle">Send global alerts, targeted push notifications, and segment-based messages.</p>
        </div>
        <button className="btn btn-primary">➕ New Notification</button>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <h3>Create Notification</h3>
        </div>
        <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <div style={{ marginBottom: 16 }}>
               <label style={{ display: 'block', marginBottom: 8, fontSize: '0.875rem', fontWeight: 600 }}>Recipient Group</label>
               <select className="form-control">
                  <option>All Users</option>
                  <option>Premium Only</option>
                  <option>Institutional Clients</option>
                  <option>New (Last 30 Days)</option>
                  <option>Custom ID List</option>
               </select>
            </div>
            <div style={{ marginBottom: 16 }}>
               <label style={{ display: 'block', marginBottom: 8, fontSize: '0.875rem', fontWeight: 600 }}>Notification Type</label>
               <select className="form-control">
                  <option>In-App Alert</option>
                  <option>Push Notification</option>
                  <option>Email Blast</option>
                  <option>All Channels</option>
               </select>
            </div>
          </div>
          <div>
            <div style={{ marginBottom: 16 }}>
               <label style={{ display: 'block', marginBottom: 8, fontSize: '0.875rem', fontWeight: 600 }}>Message Title</label>
               <input type="text" className="form-control" placeholder="Short, Punchy Title" />
            </div>
            <div style={{ marginBottom: 16 }}>
               <label style={{ display: 'block', marginBottom: 8, fontSize: '0.875rem', fontWeight: 600 }}>Message Content</label>
               <textarea className="form-control" placeholder="Write your notification message here..." style={{ height: 100 }}></textarea>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
               <button className="btn btn-secondary">💾 Save Draft</button>
               <button className="btn btn-primary">🚀 Send Now</button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
         <div className="card-header">
            <h3>Sent Notifications History</h3>
         </div>
         <div className="table-responsive">
            <table className="table">
               <thead>
                  <tr>
                     <th>Notification Title</th>
                     <th>Audience Type</th>
                     <th>Sender</th>
                     <th>Status</th>
                     <th>Sent Time</th>
                     <th>Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {NOTIFICATIONS.map((n, i) => (
                    <tr key={i}>
                       <td><strong>{n.title}</strong></td>
                       <td><span className="badge badge-secondary">{n.type}</span></td>
                       <td>{n.author}</td>
                       <td>
                          <span className={`badge ${n.status === 'Sent' ? 'badge-success' : 'badge-warning'}`}>{n.status}</span>
                       </td>
                       <td>{n.sentDate}</td>
                       <td>
                          <div style={{ display: 'flex', gap: 8 }}>
                             <button className="btn btn-sm btn-secondary">Stats</button>
                             <button className="btn btn-sm btn-secondary">Clone</button>
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
