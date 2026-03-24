import { useState, useEffect } from 'react'
import { ipoAPI } from '../../api/client'
import styles from '../../styles/pages/app/IPOTrackerPage.module.css'

export default function IPOTrackerPage() {
  const [ipos, setIpos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ipoAPI.list().then(res => setIpos(res.data.items)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div className="page-wrapper animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">IPO Tracker</h1>
          <p className="page-subtitle">Upcoming and recent IPOs with AI analysis</p>
        </div>
      </div>
      <div className="card" style={{ padding: 0 }}>
        <table className="data-table">
          <thead>
            <tr><th>Company</th><th>Issue Price</th><th>Dates</th><th>Status</th><th>AI Advice</th></tr>
          </thead>
          <tbody>
            {loading ? <tr><td><div className="spinner"/></td></tr> : ipos.map((ipo, i) => (
              <tr key={i}>
                <td><strong>{ipo.company_name}</strong></td>
                <td>{ipo.issue_price}</td>
                <td>{ipo.subscription_dates}</td>
                <td><span className="badge badge-info">{ipo.status}</span></td>
                <td>{ipo.ai_advice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
