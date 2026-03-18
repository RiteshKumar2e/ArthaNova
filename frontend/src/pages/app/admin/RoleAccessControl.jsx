import React from 'react';

export default function RoleAccessControl() {
  const ROLES = [
    { name: 'Admin', users: 3, permissions: 'All Access', status: 'Core' },
    { name: 'Analyst', users: 12, permissions: 'Content, AI Monitoring', status: 'Department' },
    { name: 'Moderator', users: 8, permissions: 'Content, User Moderation', status: 'Department' },
    { name: 'Compliance', users: 2, permissions: 'Logs, Settings Review', status: 'Legal' },
    { name: 'Support', users: 15, permissions: 'User View, Notification', status: 'Service' },
  ];

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">Role & Access Control 🛡️</h1>
          <p className="page-subtitle">Manage workspace permissions, custom roles, and RBAC policies.</p>
        </div>
        <button className="btn btn-primary">➕ Define New Role</button>
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-header">
             <h3>Permission Matrix (Overview)</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, padding: 16 }}>
             {['Platform', 'Content', 'AI System', 'Users'].map(mod => (
                <div key={mod} style={{ background: '#F4F5F7', padding: 12, borderRadius: 8, textAlign: 'center' }}>
                   <div style={{ fontWeight: 600, fontSize: '0.8rem', marginBottom: 8 }}>{mod}</div>
                   <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                      <span title="Read" style={{ color: '#00875A' }}>R</span>
                      <span title="Write" style={{ color: '#0052CC' }}>W</span>
                      <span title="Delete" style={{ color: '#DE350B' }}>D</span>
                   </div>
                </div>
             ))}
          </div>
          <div style={{ padding: 16, borderTop: '1px solid #DFE1E6' }}>
             <button className="btn btn-sm btn-secondary" style={{ width: '100%' }}>🛠️ Edit Master Matrix</button>
          </div>
        </div>

        <div className="card">
           <div className="card-header">
              <h3>Security Groups</h3>
           </div>
           {[
             { title: 'Full Identity Access (SSO Required)', active: true },
             { title: 'Financial Transaction Authorization', active: false },
             { title: 'System Key Access (Enclave)', active: true },
           ].map((sec, i) => (
             <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderBottom: i < 2 ? '1px solid #DFE1E6' : 'none' }}>
                <span style={{ fontSize: '0.875rem' }}>{sec.title}</span>
                <span className={`badge ${sec.active ? 'badge-success' : 'badge-danger'}`}>{sec.active ? 'ENFORCED' : 'OFF'}</span>
             </div>
           ))}
        </div>
      </div>

      <div className="card">
         <div className="card-header">
            <h3>Defined Workspace Roles</h3>
         </div>
         <div className="table-responsive">
            <table className="table">
               <thead>
                  <tr>
                     <th>Role Name</th>
                     <th>Team Count</th>
                     <th>Permission Summary</th>
                     <th>Group Level</th>
                     <th>Action</th>
                  </tr>
               </thead>
               <tbody>
                  {ROLES.map(role => (
                    <tr key={role.name}>
                       <td><strong>{role.name}</strong></td>
                       <td>{role.users} Members</td>
                       <td>{role.permissions}</td>
                       <td><span className="badge badge-primary">{role.status}</span></td>
                       <td>
                          <div style={{ display: 'flex', gap: 8 }}>
                             <button className="btn btn-sm btn-secondary">Permissions</button>
                             <button className="btn btn-sm btn-secondary">Logs</button>
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
