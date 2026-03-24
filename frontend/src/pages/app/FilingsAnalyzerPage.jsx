import { useState } from 'react'
import styles from '../../styles/pages/app/FilingsAnalyzerPage.module.css'
import toast from 'react-hot-toast'

export default function FilingsAnalyzerPage() {
  const [filings, setFilings] = useState([])
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
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>FILINGS ANALYZER</h1>
          <p className={styles.pageSubtitle}>EXTRACT INSTITUTIONAL-GRADE INSIGHTS FROM 10-K, 10-Q, AND ANNUAL REPORTS</p>
        </div>
        <div className={styles.premiumBadge}>
          ✨ AI v1.1 BETA
        </div>
      </div>

      <div className={styles.dashboardGrid}>
        {/* Left: Upload & Stats */}
        <div className={styles.leftCol}>
          <div className={`${styles.card} ${styles.uploadCard} ${dragActive ? styles.dragActive : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              multiple={true} 
              style={{ display: 'none' }} 
              id="file-upload-input"
              onChange={(e) => {
                if (e.target.files?.length) {
                  toast.success(`${e.target.files.length} file(s) selected for analysis!`);
                }
              }}
            />
            <div className={styles.uploadIcon}>☁️</div>
            <h3>UPLOAD NEW FILING</h3>
            <p>Drag and drop company annual reports or quarterly filings (PDF/DOCX)</p>
            <button 
              className="btn btn-primary btn-sm" 
              onClick={() => document.getElementById('file-upload-input').click()} 
              style={{ border: '3px solid #000' }}
            >
              SELECT FILES
            </button>
            <span className={styles.uploadHint}>AI handles table extraction & OCR automatically</span>
          </div>

          <div className={styles.statsRow}>
            <div className={styles.statMini}>
              <span className={styles.statLabel}>ANALYZED</span>
              <span className={styles.statVal}>0</span>
            </div>
            <div className={styles.statMini}>
              <span className={styles.statLabel}>CONFIDENCE</span>
              <span className={styles.statVal}>N/A</span>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>MODULE UNDER CONSTRUCTION</div>
            <div className={styles.constructionNotice}>
              <p>WE ARE ACTIVELY WORKING ON INTEGRATING ADVANCED AI MODELS AND DATA PIPELINES FOR THE FILINGS ANALYZER FEATURE. THIS WILL BE AVAILABLE IN THE UPCOMING V1.1 RELEASE.</p>
              <div className={styles.constructionVisual}>
                <div className={styles.loadingBar}><div className={styles.loadingProgress}></div></div>
                <span>SYNCING WITH SEBI EDGAR DATA...</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Filing List & Preview */}
        <div className={styles.rightCol}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>RECENT CORPORATE FILINGS</div>
            <div className={styles.tableWrapper}>
              <table className={styles.filingsTable}>
                <thead>
                  <tr>
                    <th>DOCUMENT NAME</th>
                    <th>CATEGORY</th>
                    <th>DATE</th>
                    <th>STATUS</th>
                    <th>AI CONFIDENCE</th>
                  </tr>
                </thead>
                <tbody>
                  {filings.map(f => (
                    <tr key={f.id}>
                      <td className={styles.fileName}>{f.name}</td>
                      <td className={styles.fileType}>{f.type}</td>
                      <td>{f.date}</td>
                      <td>
                        <span className="badge badge-info">
                          {f.status?.toUpperCase()}
                        </span>
                      </td>
                      <td className={styles.confidenceCell}>
                        {f.status === 'analyzed' ? `${f.confidence}%` : '--'}
                      </td>
                    </tr>
                  ))}
                  {filings.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', fontWeight: 900, color: '#888' }}>
                        NO RECENT FILINGS FOUND
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>AI INSIGHT PREVIEW</div>
            <div className={styles.previewContent}>
              <div className={styles.previewPlaceholder}>
                <div className={styles.eyeIcon}>👁️</div>
                <p>SELECT A FILING TO SEE EXTRACTED FINANCIAL SUMMARIES AND MANAGEMENT SENTIMENT ANALYSIS.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
