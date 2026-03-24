import React, { useState } from 'react';
import styles from '../../../styles/pages/app/admin/RoleAccessControl.module.css';

export default function RoleAccessControl() {
  const [roles, setRoles] = useState([
    { name: 'ADMIN', users: 3, permissions: 'ALL ACCESS', status: 'CORE' },
    { name: 'MODERATOR', users: 8, permissions: 'CONTENT, USER MODERATION', status: 'DEPARTMENT' },
    { name: 'COMPLIANCE', users: 2, permissions: 'LOGS, SETTINGS REVIEW', status: 'LEGAL' },
    { name: 'SUPPORT', users: 15, permissions: 'USER VIEW, NOTIFICATION', status: 'SERVICE' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newRole, setNewRole] = useState({ name: '', status: 'DEPARTMENT', permissions: '' });

  const MATRIX = [
    { mod: 'PLATFORM', r: true, w: true, d: true },
    { mod: 'CONTENT', r: true, w: true, d: false },
    { mod: 'AI SYSTEM', r: true, w: false, d: false },
    { mod: 'USERS', r: true, w: true, d: false },
  ];

  const SECURITY = [
    { title: 'FULL IDENTITY ACCESS (SSO REQUIRED)', active: true },
    { title: 'FINANCIAL TRANSACTION AUTHORIZATION', active: false },
    { title: 'SYSTEM KEY ACCESS (ENCLAVE)', active: true },
  ];

  const handleAction = (label, role) => {
    alert(`${label} TRIGGERED FOR ROLE: ${role}`);
  };

  const handleCreateRole = (e) => {
    e.preventDefault();
    setRoles([...roles, { ...newRole, users: 0, name: newRole.name.toUpperCase() }]);
    setShowModal(false);
    setNewRole({ name: '', status: 'DEPARTMENT', permissions: '' });
    alert('NEW ROLE DEFINED SUCCESSFULLY');
  };

  return (
    <div className={styles.container + " animate-fadeIn"}>
      <div className="page-header">
        <div>
          <h1 className="page-title">ROLE & ACCESS CONTROL 🛡️</h1>
          <p className="page-subtitle">MANAGE WORKSPACE PERMISSIONS, CUSTOM ROLES, AND RBAC POLICIES.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>➕ DEFINE NEW ROLE</button>
      </div>

      <div className={styles.dashboardGrid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
             <h3>PERMISSION MATRIX (OVERVIEW)</h3>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.matrixGrid}>
              {MATRIX.map(item => (
                <div key={item.mod} className={styles.matrixItem}>
                   <span className={styles.matrixTitle}>{item.mod}</span>
                   <div className={styles.matrixActions}>
                      <span className={item.r ? styles.r : ''} title="READ">R</span>
                      <span className={item.w ? styles.w : ''} title="WRITE">W</span>
                      <span className={item.d ? styles.d : ''} title="DELETE">D</span>
                   </div>
                </div>
              ))}
            </div>
            <button className="btn btn-sm btn-secondary btn-full" onClick={() => alert('INITIALIZING MASTER MATRIX EDITOR...')}>
              🛠️ EDIT MASTER MATRIX
            </button>
          </div>
        </div>

        <div className={styles.card}>
           <div className={styles.cardHeader}>
              <h3>SSO & SECURITY GROUPS</h3>
           </div>
           <div className={styles.cardBody}>
             <div className={styles.secList}>
               {SECURITY.map((sec, i) => (
                 <div key={i} className={styles.secRow}>
                    <span className={styles.secTitle}>{sec.title}</span>
                    <button 
                      className={`${styles.statusBadge} ${sec.active ? styles.statusOn : styles.statusOff}`}
                      style={{ cursor: 'pointer', border: 'none' }}
                      onClick={() => alert(`TOGGLING SECURITY GROUP: ${sec.title}`)}
                    >
                      {sec.active ? 'ENFORCED' : 'OFF'}
                    </button>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </div>

      <div className={styles.card}>
         <div className={styles.cardHeader} style={{ background: '#000' }}>
            <h3 style={{ color: '#fff' }}>DEFINED WORKSPACE ROLES</h3>
         </div>
         <div className="table-responsive">
            <table className={styles.roleTable}>
               <thead>
                  <tr>
                     <th>ROLE NAME</th>
                     <th>TEAM COUNT</th>
                     <th>PERMISSION SUMMARY</th>
                     <th>GROUP LEVEL</th>
                     <th style={{ textAlign: 'center' }}>ACTION</th>
                  </tr>
               </thead>
               <tbody>
                  {roles.map(role => (
                    <tr key={role.name}>
                       <td><strong className="text-upper">{role.name}</strong></td>
                       <td><span style={{ fontWeight: 800, fontSize: '0.7rem' }}>{role.users} MEMBERS</span></td>
                       <td><span style={{ fontSize: '0.7rem', color: '#555', fontWeight: 700 }}>{role.permissions}</span></td>
                       <td>
                        <span className={`${styles.badge} ${role.status === 'CORE' ? styles.badgeCore : (role.status === 'LEGAL' ? styles.badgeLegal : styles.badgeDept)}`}>
                          {role.status}
                        </span>
                       </td>
                       <td>
                          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                             <button className="btn btn-sm btn-secondary" style={{ padding: '6px 12px', fontSize: '0.65rem' }} onClick={() => handleAction('PERMISSIONS', role.name)}>PERMISSIONS</button>
                             <button className="btn btn-sm btn-secondary" style={{ padding: '6px 12px', fontSize: '0.65rem' }} onClick={() => handleAction('LOGS', role.name)}>LOGS</button>
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
            <div style={{ background: 'var(--primary)', padding: '12px', borderBottom: '4px solid #000', display: 'flex', justifyContent: 'space-between' }}>
              <h2 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 950 }}>DEFINE NEW ROLE</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontWeight: 950, cursor: 'pointer' }}>×</button>
            </div>
            <form onSubmit={handleCreateRole} style={{ padding: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: 950, fontSize: '0.6rem', marginBottom: '6px' }}>ROLE NAME</label>
                <input 
                  className="form-control" 
                  style={{ width: '100%' }} 
                  required 
                  value={newRole.name}
                  onChange={(e) => setNewRole({...newRole, name: e.target.value.toUpperCase()})}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: 950, fontSize: '0.6rem', marginBottom: '6px' }}>GROUP LEVEL</label>
                <select 
                  className="form-control" 
                  style={{ width: '100%' }}
                  value={newRole.status}
                  onChange={(e) => setNewRole({...newRole, status: e.target.value})}
                >
                  <option value="CORE">CORE</option>
                  <option value="DEPARTMENT">DEPARTMENT</option>
                  <option value="LEGAL">LEGAL</option>
                  <option value="SERVICE">SERVICE</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-sm btn-secondary" onClick={() => setShowModal(false)}>CANCEL</button>
                <button type="submit" className="btn btn-sm btn-primary">DEFINE ROLE</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
