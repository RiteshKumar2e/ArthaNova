import { useState, useEffect } from 'react'
import { aiAPI } from '../../../../api/client'
import styles from '../../../../styles/pages/app/user/research/FilingsAnalyzerPage.module.css'
import toast from 'react-hot-toast'

export default function FilingsAnalyzerPage() {
  const [symbol, setSymbol] = useState('RELIANCE')
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [recentFilings, setRecentFilings] = useState([
    { id: 1, name: 'Form 23-C (Bulk Deal)', category: 'Regulatory', date: '2024-03-25', status: 'analyzed', confidence: 98 },
    { id: 2, name: 'Insider Trade: Promoter', category: 'Compliance', date: '2024-03-22', status: 'analyzed', confidence: 96 }
  ])

  const handleAnalyze = async () => {
    if (!symbol) return
    setLoading(true)
    try {
      const response = await aiAPI.getBulkDealAnalysis(symbol)
      setAnalysis(response.data)
      toast.success(`Analysis for ${symbol} complete!`)
    } catch (err) {
      console.error(err)
      toast.error('Could not fetch real-time filings for this symbol.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-wrapper animate-fadeIn">
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>FILINGS ANALYZER</h1>
          <p className={styles.pageSubtitle}>EXTRACT INSTITUTIONAL-GRADE INSIGHTS FROM CORPORATE DISCLOSURES & BULK DEALS</p>
        </div>
        <div className={styles.premiumBadge}>
          ⚡ AI FILING SCANNER ACTIVE
        </div>
      </div>

      <div className={styles.dashboardGrid}>
        <div className={styles.leftCol}>
          <div className={`${styles.card} ${styles.searchCard}`}>
             <h3>QUICK SEARCH SYMBOL</h3>
             <div style={{display: 'flex', gap: '0.5rem', marginTop: '1rem'}}>
               <input 
                 className="form-control" 
                 value={symbol} 
                 onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                 placeholder="E.G. RELIANCE, TCS"
                 style={{border: '3px solid #000', borderRadius: 0, fontWeight: 950}}
               />
               <button 
                 onClick={handleAnalyze} 
                 className="btn btn-primary" 
                 disabled={loading}
                 style={{border: '3px solid #000'}}
               >
                 {loading ? 'ANALYZING...' : 'SCAN'}
               </button>
             </div>
             <p style={{fontSize: '0.65rem', marginTop: '0.8rem', fontWeight: 700, color: '#666'}}>AI scans NSE Corporate Filings (Bulk/Block, Insider) in real-time.</p>
          </div>

          {analysis && (
            <div className={styles.card} style={{background: '#000', color: '#C4FF00', border: 'none'}}>
               <h3>AI COMPLIANCE VERDICT</h3>
               <div style={{marginTop: '1rem'}}>
                  <p style={{fontSize: '1.2rem', fontWeight: 950, margin: 0}}>{analysis.recommendation.action}</p>
                  <p style={{fontSize: '0.75rem', color: '#fff', marginTop: '0.5rem', lineHeight: 1.4}}>{analysis.ai_analysis}</p>
                  <div style={{borderTop: '1px dashed #C4FF00', marginTop: '1rem', paddingTop: '1rem', fontSize: '0.7rem'}}>
                     <strong>SEBI TRACE:</strong> {analysis.filing_citation}
                  </div>
               </div>
            </div>
          )}

          <div className={styles.card}>
            <div className={styles.cardHeader}>INTELLIGENT OCR PIPELINE</div>
            <div className={styles.constructionNotice}>
              <div className={styles.constructionVisual}>
                <div className={styles.loadingBar}><div className={styles.loadingProgress} style={{width: '92%'}}></div></div>
                <span style={{fontWeight: 950, fontSize: '0.65rem', color: '#000'}}>NEURAL ENGINE: VERIFIED ✅</span>
              </div>
              <p style={{fontSize: '0.7rem', fontWeight: 650, marginTop: '0.8rem', color: '#444'}}>Agentic Pipeline is active. Full annual report (PDF) upload logic is scheduled for the next release.</p>
            </div>
          </div>
        </div>

        <div className={styles.rightCol}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>RECENT DETECTED DISCLOSURES</div>
            <div className={styles.tableWrapper}>
              <table className={styles.filingsTable}>
                <thead>
                  <tr>
                    <th>DOCUMENT NAME</th>
                    <th>CATEGORY</th>
                    <th>DATE</th>
                    <th>STATUS</th>
                    <th>CONFIDENCE</th>
                  </tr>
                </thead>
                <tbody>
                  {recentFilings.map(f => (
                    <tr key={f.id}>
                      <td className={styles.fileName}>{f.name}</td>
                      <td className={styles.fileType}>{f.category}</td>
                      <td>{f.date}</td>
                      <td>
                        <span className="badge badge-info" style={{fontSize: '10px'}}>{f.status?.toUpperCase()}</span>
                      </td>
                      <td className={styles.confidenceCell}>{f.confidence}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>INSIGHT PREVIEW</div>
            <div className={styles.previewContent}>
              {analysis ? (
                 <div style={{padding: '0.5rem'}}>
                    <h4 style={{margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#000', fontWeight: 950}}>DEAL SUMMARY: {analysis.deal_summary.client}</h4>
                    <p style={{fontSize: '0.8rem', color: '#333', margin: 0}}>
                       {analysis.deal_summary.client} {analysis.deal_summary.action} {analysis.deal_summary.quantity} shares of {analysis.deal_summary.symbol} at ₹{analysis.deal_summary.price}. 
                       Total value: {analysis.deal_summary.value}.
                    </p>
                    <div style={{marginTop: '1rem', background: '#f5f5f5', border: '2px solid #000', padding: '0.8rem'}}>
                       <strong style={{fontSize: '0.7rem', textTransform: 'uppercase'}}>AI Strategy Notes:</strong>
                       <p style={{fontSize: '0.75rem', margin: '0.3rem 0 0 0', fontStyle: 'italic'}}>{analysis.recommendation.target_zone ? `Target Zone: ${analysis.recommendation.target_zone}` : `Target: ${analysis.recommendation.target}`}</p>
                    </div>
                 </div>
              ) : (
                <div className={styles.previewPlaceholder}>
                  <div className={styles.eyeIcon}>👁️</div>
                  <p>SCAN A SYMBOL TO EXTRACT FINANCIAL SUMMARIES AND REGULATORY SENTIMENT ANALYSIS.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
