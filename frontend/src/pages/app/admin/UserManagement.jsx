import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../../store/authStore';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { accessToken } = useAuthStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/v1/admin/users', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
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

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">User Management 👥</h1>
          <p className="page-subtitle">Manage all ArthaNova accounts and their access levels.</p>
        </div>
        <button className="btn btn-primary">➕ Create New User</button>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 12, padding: 16 }}>
          <input 
            type="text" 
            placeholder="Search users by name or email..." 
            className="form-control"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1 }}
          />
          <select className="form-control" style={{ width: 150 }}>
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Role</th>
                <th>Status</th>
                <th>Risk Profile</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: 40 }}>Loading users...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: 40 }}>No users found.</td></tr>
              ) : filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>
                    <div>
                      <strong>{user.full_name}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#5E6C84' }}>{user.email}</div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-secondary'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`dot ${user.is_active ? 'dot-success' : 'dot-danger'}`}></span>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </td>
                  <td>{user.risk_profile || 'Moderate'}</td>
                  <td>{user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-sm btn-secondary">Edit</button>
                      <button 
                        className={`btn btn-sm ${user.is_active ? 'btn-danger' : 'btn-success'}`}
                        onClick={() => toggleStatus(user.id)}
                      >
                        {user.is_active ? 'Deactivate' : 'Activate'}
                      </button>
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
