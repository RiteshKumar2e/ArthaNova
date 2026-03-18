import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { authAPI } from '../../api/client'
import toast from 'react-hot-toast'
import styles from '../../styles/pages/app/ProfilePage.module.scss'

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const [form, setForm] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    risk_profile: user?.risk_profile || 'moderate',
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      // In a real app, you'd call an update user endpoint here
      // await authAPI.updateProfile(form)
      updateUser(form)
      toast.success('Profile updated successfully')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-wrapper animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Manage your account and preferences</p>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', marginBottom: 20 }}>Personal Information</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-control" name="full_name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email (Read Only)</label>
              <input className="form-control" type="email" value={user?.email || ''} readOnly disabled />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-control" name="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Risk Profile</label>
              <select className="form-control" name="risk_profile" value={form.risk_profile} onChange={(e) => setForm({ ...form, risk_profile: e.target.value })}>
                <option value="conservative">Conservative</option>
                <option value="moderate">Moderate</option>
                <option value="aggressive">Aggressive</option>
              </select>
            </div>
            <div>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        <div className="card" style={{ alignSelf: 'start' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: 20 }}>Account Security</h3>
          <p style={{ color: '#5E6C84', marginBottom: 20 }}>To change your password, use the reset facility.</p>
          <button className="btn btn-secondary">Change Password</button>
        </div>
      </div>
    </div>
  )
}
