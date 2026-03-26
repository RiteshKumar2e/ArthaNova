import { useState } from 'react'
import { useAuthStore } from '../../../../store/authStore'
import { authAPI } from '../../../../api/client'
import toast from 'react-hot-toast'
import styles from '../../../../styles/pages/app/user/profile/ProfilePage.module.css'

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
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>MY PROFILE</h1>
          <p className={styles.pageSubtitle}>MANAGE YOUR ACCOUNT AND PREFERENCES</p>
        </div>
      </div>

      <div className={styles.dashboardGrid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>PERSONAL INFORMATION</div>
          <div className={styles.cardBody}>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>FULL NAME</label>
                <input className={styles.formControl} name="full_name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>EMAIL (READ ONLY)</label>
                <input className={styles.formControl} type="email" value={user?.email || ''} readOnly disabled />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>PHONE</label>
                <input className={styles.formControl} name="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>RISK PROFILE</label>
                <select className={styles.formControl} name="risk_profile" value={form.risk_profile} onChange={(e) => setForm({ ...form, risk_profile: e.target.value })}>
                  <option value="conservative">CONSERVATIVE</option>
                  <option value="moderate">MODERATE</option>
                  <option value="aggressive">AGGRESSIVE</option>
                </select>
              </div>
              <div style={{ marginTop: 24 }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'SAVING...' : 'SAVE CHANGES'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className={styles.card} style={{ alignSelf: 'start' }}>
          <div className={styles.cardHeader}>ACCOUNT SECURITY</div>
          <div className={styles.cardBody}>
            <p className={styles.securityText}>TO CHANGE YOUR PASSWORD, USE THE RESET FACILITY IN THE LOGIN SECTION OR CONTACT SECURITY.</p>
            <button className="btn btn-secondary btn-full">CHANGE PASSWORD</button>
          </div>
        </div>
      </div>
    </div>
  )
}
