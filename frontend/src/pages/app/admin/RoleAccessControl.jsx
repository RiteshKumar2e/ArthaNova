import React from 'react';
import styles from '../../../styles/pages/app/admin/RoleAccessControl.module.css';

export default function RoleAccessControl() {
  const ROLES = [
    { name: 'ADMIN', users: 3, permissions: 'ALL ACCESS', status: 'CORE' },
    // Filtered out Analyst as requested
    { name: 'MODERATOR', users: 8, permissions: 'CONTENT, USER MODERATION', status: 'DEPARTMENT' },
    { name: 'COMPLIANCE', users: 2, permissions: 'LOGS, SETTINGS REVIEW', status: 'LEGAL' },
    { name: 'SUPPORT', users: 15, permissions: 'USER VIEW, NOTIFICATION', status: 'SERVICE' },
  ];

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

  return (
    <div className={styles.container + " animate-fadeIn"}>
      <div className="page-header">
        <div>
          <h1 className="page-title">ROLE & ACCESS CONTROL 🛡️</h1>
          <p className="page-subtitle">MANAGE WORKSPACE PERMISSIONS, CUSTOM ROLES, AND RBAC POLICIES.</p>
        </div>
        <button className="btn btn-primary btn-sm">➕ DEFINE NEW ROLE</button>
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
            <button className="btn btn-sm btn-secondary btn-full">🛠️ EDIT MASTER MATRIX</button>
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
                    <span className={`${styles.statusBadge} ${sec.active ? styles.statusOn : styles.statusOff}`}>
                      {sec.active ? 'ENFORCED' : 'OFF'}
                    </span>
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
                  {ROLES.map(role => (
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
                             <button className="btn btn-sm btn-secondary" style={{ padding: '6px 12px', fontSize: '0.65rem' }}>PERMISSIONS</button>
                             <button className="btn btn-sm btn-secondary" style={{ padding: '6px 12px', fontSize: '0.65rem' }}>LOGS</button>
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
