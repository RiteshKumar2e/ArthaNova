import { useState, useEffect } from 'react'
import { newsAPI } from '../../api/client'
import styles from '../../styles/pages/app/NewsIntelligencePage.module.css'

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
      <div className="grid-3" style={{ gap: 30 }}>
        {loading ? <div className="spinner" style={{ margin: '60px auto' }} /> : news.map((n, i) => (
          <div key={i} className="card" style={{ border: '4px solid #000', boxShadow: '8px 8px 0px #000', background: 'white', display: 'flex', flexDirection: 'column' }}>
            <span className={`badge ${n.sentiment === 'Positive' ? 'badge-success' : n.sentiment === 'Negative' ? 'badge-danger' : 'badge-warning'}`} style={{ border: '2px solid #000', alignSelf: 'flex-start', boxShadow: '3px 3px 0px #000', fontWeight: 900 }}>{n.sentiment}</span>
            <h3 style={{ marginTop: 15, marginBottom: 12, fontSize: '1.2rem', fontWeight: 900, color: '#000', textTransform: 'uppercase' }}>{n.title}</h3>
            <p style={{ fontSize: '1rem', color: '#000', fontWeight: 700, lineHeight: 1.5, flex: 1 }}>{n.summary}</p>
            <div style={{ marginTop: 20, paddingTop: 15, borderTop: '2px solid #000', fontSize: '0.8rem', fontWeight: 900, color: '#000', textTransform: 'uppercase' }}>
              {new Date(n.published_at).toLocaleString()} <span style={{ marginLeft: 10, background: 'var(--color-yellow)', padding: '2px 6px', border: '1px solid #000' }}>{n.source}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
