import { useState, useEffect } from 'react'
import { newsAPI } from '../../api/client'
import styles from '../../styles/pages/app/NewsIntelligencePage.module.scss'

export default function NewsIntelligencePage() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    newsAPI.list().then(res => setNews(res.data.items)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div className="page-wrapper animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">News Intelligence</h1>
          <p className="page-subtitle">AI-summarized news with sentiment analysis</p>
        </div>
      </div>
      <div className="grid-3">
        {loading ? <div className="spinner" /> : news.map((n, i) => (
          <div key={i} className="card">
            <span className={`badge ${n.sentiment === 'Positive' ? 'badge-success' : n.sentiment === 'Negative' ? 'badge-danger' : 'badge-warning'}`}>{n.sentiment}</span>
            <h3 style={{ marginTop: 12, marginBottom: 8, fontSize: '1rem' }}>{n.title}</h3>
            <p style={{ fontSize: '0.875rem', color: '#5E6C84' }}>{n.summary}</p>
            <div style={{ marginTop: 12, fontSize: '0.75rem', color: '#97A0AF' }}>{new Date(n.published_at).toLocaleString()} • {n.source}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
