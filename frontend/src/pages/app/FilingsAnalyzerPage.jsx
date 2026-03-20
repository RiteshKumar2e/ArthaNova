import { useState } from 'react'
import styles from '../../styles/pages/app/FilingsAnalyzerPage.module.scss'
import toast from 'react-hot-toast'

const MOCK_FILINGS = [
  { id: 1, name: 'RELIANCE_AR_2024.pdf', type: 'Annual Report', date: '2024-05-15', status: 'analyzed', confidence: 98.4 },
  { id: 2, name: 'TCS_Q3_Results.pdf', type: 'Quarterly Filing', date: '2025-01-12', status: 'analyzed', confidence: 95.1 },
  { id: 3, name: 'HDFCBANK_20-F.pdf', type: 'SEC Filing', date: '2024-11-20', status: 'pending', confidence: 0 },
  { id: 4, name: 'INFY_ESG_Report.pdf', type: 'Sustainability', date: '2024-08-05', status: 'analyzed', confidence: 92.8 },
]

export default function FilingsAnalyzerPage() {
  const [filings, setFilings] = useState(MOCK_FILINGS)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    toast.success('File uploaded successfully! Processing started.')
  }

  return (
    <div className="page-wrapper animate-fadeIn">
      <header className="page-header">
        <div>
          <h1 className="page-title">📋 Filings Analyzer</h1>
          <p className="page-subtitle">Extract institutional-grade insights from 10-K, 10-Q, and Annual Reports using our proprietary RAG pipeline.</p>
        </div>
        <div className={styles.premiumBadge}>
          <span className={styles.badgeIcon}>✨</span>
          <span>AI v1.1 Beta</span>
        </div>
      </header>

      <div className={styles.dashboardGrid}>
        {/* Left: Upload & Stats */}
        <div className={styles.leftCol}>
          <div className={`card ${styles.uploadCard} ${dragActive ? styles.dragActive : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className={styles.uploadIcon}>☁️</div>
            <h3>Upload New Filing</h3>
            <p>Drag and drop company annual reports or quarterly filings (PDF/DOCX)</p>
            <button className="btn btn-primary" onClick={() => toast.success('Open file dialog')}>
              Select Files
            </button>
            <span className={styles.uploadHint}>AI handles table extraction & OCR automatically</span>
          </div>

          <div className={styles.statsRow}>
            <div className={`card ${styles.statMini}`}>
              <span className={styles.statLabel}>Analyzed</span>
              <span className={styles.statVal}>128</span>
            </div>
            <div className={`card ${styles.statMini}`}>
              <span className={styles.statLabel}>Confidence</span>
              <span className={styles.statVal}>96%</span>
            </div>
          </div>

          <div className="card">
            <h3 className={styles.cardTitle}>Module Under Construction</h3>
            <div className={styles.constructionNotice}>
              <p>We are actively working on integrating advanced AI models and data pipelines for the Filings Analyzer feature. This will be available in the upcoming v1.1 release.</p>
              <div className={styles.constructionVisual}>
                <div className={styles.loadingBar}><div className={styles.loadingProgress}></div></div>
                <span>Syncing with SEBI Edgar Data...</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Filing List & Preview */}
        <div className={styles.rightCol}>
          <div className="card">
            <h3 className={styles.cardTitle}>Recent Corporate Filings</h3>
            <div className={styles.tableWrapper}>
              <table className={styles.filingsTable}>
                <thead>
                  <tr>
                    <th>Document Name</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>AI Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {filings.map(f => (
                    <tr key={f.id}>
                      <td className={styles.fileName}>{f.name}</td>
                      <td className={styles.fileType}>{f.type}</td>
                      <td>{f.date}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles[f.status]}`}>
                          {f.status}
                        </span>
                      </td>
                      <td className={styles.confidenceCell}>
                        {f.status === 'analyzed' ? `${f.confidence}%` : '--'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={`card ${styles.previewCard}`}>
            <h3 className={styles.cardTitle}>AI Insight Preview</h3>
            <div className={styles.previewContent}>
              <div className={styles.previewPlaceholder}>
                <div className={styles.eyeIcon}>👁️</div>
                <p>Select a filing to see extracted financial summaries and management sentiment analysis.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
