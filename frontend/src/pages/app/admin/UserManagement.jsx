import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../../store/authStore';
import styles from '../../../styles/pages/app/admin/UserManagement.module.css';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ full_name: '', email: '', role: 'user', risk_profile: 'moderate' });
  const { accessToken } = useAuthStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/v1/admin/users', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      // Ensure response.data is an array before filtering
      const usersList = Array.isArray(response.data) ? response.data : [];
      setUsers(usersList.filter(u => u.role !== 'analyst'));
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (userId) => {
    try {
      await axios.patch(`/api/v1/admin/users/${userId}/toggle-status`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      fetchUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/v1/admin/users', newUser, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setShowModal(false);
      setNewUser({ full_name: '', email: '', role: 'user', risk_profile: 'moderate' });
      fetchUsers();
      alert('USER CREATED SUCCESSFULLY');
    } catch (error) {
      console.error('Error creating user:', error);
      alert('FAILED TO CREATE USER');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className={styles.container + " animate-fadeIn"}>
      <div className="page-header">
        <div>
          <h1 className="page-title">USER MANAGEMENT 👥</h1>
          <p className="page-subtitle">MANAGE ALL ARTHANOVA ACCOUNTS AND THEIR ACCESS LEVELS.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>➕ CREATE NEW USER</button>
      </div>

      <div className={styles.searchHeader}>
        <input 
          type="text" 
          placeholder="SEARCH USERS BY NAME OR EMAIL..." 
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className={styles.roleSelect}
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">ALL ROLES</option>
          <option value="user">USER</option>
          <option value="admin">ADMIN</option>
        </select>
      </div>

      <div className={styles.card}>
        <div className="table-responsive">
          <table className={styles.userTable}>
            <thead>
              <tr>
                <th>USER DETAILS</th>
                <th>ROLE</th>
                <th>STATUS</th>
                <th>RISK PROFILE</th>
                <th>LAST LOGIN</th>
                <th style={{ textAlign: 'center' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: 40, fontWeight: 900 }}>LOADING USERS...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: 40, fontWeight: 900, color: '#999' }}>NO USERS MATCHING CRITERIA FOUND.</td></tr>
              ) : filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>
                    <div className={styles.userDetailContainer}>
                      <span className={styles.userName}>{user.full_name}</span>
                      <span className={styles.userEmail}>{user.email}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.roleBadge} ${user.role === 'admin' ? styles.admin : styles.user}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <div className={styles.statusBadge}>
                      <span className={`${styles.statusDot} ${user.is_active ? styles.active : styles.inactive}`}></span>
                      {user.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </div>
                  </td>
                  <td><span style={{ fontWeight: 800 }}>{user.risk_profile?.toUpperCase() || 'MODERATE'}</span></td>
                  <td><span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#666' }}>{user.last_login ? new Date(user.last_login).toLocaleDateString() : 'NEVER'}</span></td>
                  <td>
                    <div className={styles.actions} style={{ justifyContent: 'center' }}>
                      <button className="btn btn-sm btn-secondary" style={{ padding: '4px 8px', fontSize: '0.65rem' }}>EDIT</button>
                      <button 
                        className={`btn btn-sm ${user.is_active ? 'btn-danger' : 'btn-primary'}`}
                        style={{ padding: '4px 10px', fontSize: '0.65rem' }}
                        onClick={() => toggleStatus(user.id)}
                      >
                        {user.is_active ? 'DEACTIVATE' : 'ACTIVATE'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContainer}>
            <div className={styles.modalHeader}>
              <h2>CREATING NEW USER</h2>
              <button 
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', fontWeight: 950, cursor: 'pointer' }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateUser}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>FULL NAME</label>
                  <input 
                    type="text" 
                    className={styles.formControl} 
                    required 
                    value={newUser.full_name}
                    onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>EMAIL ADDRESS</label>
                  <input 
                    type="email" 
                    className={styles.formControl} 
                    required 
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>ROLE</label>
                    <select 
                      className={styles.formControl} 
                      style={{ padding: '10px' }}
                      value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    >
                      <option value="user">USER</option>
                      <option value="admin">ADMIN</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                  <label className={styles.formLabel}>RISK PROFILE</label>
                  <select 
                    className={styles.formControl} 
                    style={{ padding: '10px' }}
                    value={newUser.risk_profile}
                    onChange={(e) => setNewUser({...newUser, risk_profile: e.target.value})}
                  >
                    <option value="conservative">CONSERVATIVE</option>
                    <option value="moderate">MODERATE</option>
                    <option value="aggressive">AGGRESSIVE</option>
                  </select>
                </div>
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className="btn btn-sm btn-secondary" onClick={() => setShowModal(false)}>CANCEL</button>
                <button type="submit" className="btn btn-sm btn-primary">SAVE USER</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
