import React, { useState, useEffect } from 'react'
import { notificationsAPI } from '../../../api/client'
import { toast } from 'react-hot-toast'

export default function GlobalNotifications() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info', // info, success, warning, danger, market, ai_alert
    user_id: null // null for all
  })
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      setLoading(true)
      const res = await notificationsAPI.adminList()
      setHistory(res.data)
    } catch (err) {
      toast.error('Failed to load notification history')
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.message) {
      return toast.error('Title and message are required')
    }

    try {
      setSending(true)
      await notificationsAPI.send(formData)
      toast.success('Notification dispatched successfully')
      setFormData({ title: '', message: '', type: 'info', user_id: null })
      fetchHistory()
    } catch (err) {
      toast.error('Failed to dispatch notification')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">Global Notifications 🔔</h1>
          <p className="page-subtitle">Broadcast system updates, market alerts, and AI insights to users.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Creation Form */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="card-header">
              <h3>Create Broadcast</h3>
            </div>
            <form onSubmit={handleSend} className="p-6">
              <div className="mb-4">
                <label className="label">Message Title</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g., Market Hours Update"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="mb-4">
                <label className="label">Notification Type</label>
                <select 
                  className="form-control"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="info">System Info</option>
                  <option value="success">Success / Achievement</option>
                  <option value="warning">Maintenance / Warning</option>
                  <option value="danger">Urgent / Multi-sig</option>
                  <option value="market">Market Event</option>
                  <option value="ai_alert">AI Conviction Signal</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="label">Broadcast Message</label>
                <textarea 
                  className="form-control" 
                  placeholder="The actual message content..."
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="label">Recipient</label>
                <select 
                  className="form-control"
                  onChange={(e) => setFormData({...formData, user_id: e.target.value === 'all' ? null : parseInt(e.target.value)})}
                >
                  <option value="all">Broadcast to All Users</option>
                  <option value="test" disabled>More segments coming soon...</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-full mt-4"
                disabled={sending}
              >
                {sending ? 'Dispatching...' : '🚀 Send Notification'}
              </button>
            </form>
          </div>
        </div>

        {/* History Table */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header flex justify-between items-center">
              <h3>Dispatch History</h3>
              <button onClick={fetchHistory} className="btn btn-sm btn-secondary">Refresh</button>
            </div>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Title & Type</th>
                    <th>Message Snippet</th>
                    <th>Sent At</th>
                    <th>Recipient</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="4" className="text-center py-8">Loading history...</td></tr>
                  ) : history.length > 0 ? (
                    history.map((n) => (
                      <tr key={n.id}>
                        <td>
                          <div className="font-bold uppercase text-[10px] tracking-wider mb-1 opacity-60">{n.type}</div>
                          <div className="font-bold">{n.title}</div>
                        </td>
                        <td className="max-w-[200px] truncate">{n.message}</td>
                        <td className="text-xs">{new Date(n.created_at).toLocaleString()}</td>
                        <td>
                          <span className={`badge ${n.user_id ? 'badge-secondary' : 'badge-primary'}`}>
                            {n.user_id ? `User #${n.user_id}` : 'Global'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="4" className="text-center py-12 text-gray-500">No broadcasts recorded yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
