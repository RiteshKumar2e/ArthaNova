import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../../api/client';
import { toast } from 'react-hot-toast';
import styles from '../../../styles/pages/app/admin/ReportsAnalytics.module.css';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ReportsAnalytics() {
  const [range, setRange] = useState('LAST 30 DAYS');
  const [distribution, setDistribution] = useState({ free: 0, pro: 0, institutional: 0 });
  const [kpis, setKpis] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, [range]);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getReportsSummary();
      const data = response.data;
      setKpis(data.kpis || []);
      setStocks(data.topStocks || []);
      setDistribution(data.distribution || { free: 0, pro: 0, institutional: 0 });
    } catch (error) {
      toast.error('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (format) => {
    if (format === 'PDF') {
      const doc = new jsPDF();
      
      doc.setFontSize(22);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text("ARTHANOVA", 15, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text("ADMINISTRATIVE PERFORMANCE REPORT", 15, 26);
      
      doc.setDrawColor(0);
      doc.setLineWidth(1);
      doc.line(15, 30, 195, 30);
      
      doc.setFontSize(9);
      doc.setTextColor(50);
      doc.text(`GENERATED: ${new Date().toLocaleString()}`, 15, 38);
      doc.text(`SELECTED RANGE: ${range}`, 15, 43);
      
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("EXECUTIVE METRICS SUMMARY", 15, 55);
      
      const kpiData = kpis.length > 0 ? kpis.map(k => [k.label, k.value, k.change]) : [["PLATFORM REACH", "0.0", "NO DATA"]];
      
      autoTable(doc, {
        startY: 60,
        head: [['METRIC KEY', 'CURRENT VALUE', 'PERIOD GROWTH']],
        body: kpiData,
        theme: 'grid',
        headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontStyle: 'bold' },
        styles: { fontSize: 8, cellPadding: 5 }
      });
      
      const finalY = (doc).lastAutoTable.finalY || 60;
      doc.setFontSize(12);
      doc.text("ASSET ENGAGEMENT BREAKDOWN", 15, finalY + 15);
      
      const stockData = stocks.length > 0 ? stocks.map(s => [s.symbol, s.users, s.engagement, s.sentiment]) : [["NO DATA DETECTED", "-", "-", "-"]];
      
      autoTable(doc, {
        startY: finalY + 20,
        head: [['STOCK SYMBOL', 'ACTIVE USERS', 'ENGAGEMENT', 'SENTIMENT']],
        body: stockData,
        theme: 'striped',
        headStyles: { fillColor: [0, 82, 204], textColor: [255, 255, 255] },
        styles: { fontSize: 8 }
      });
      
      doc.save(`ArthaNova_Report_${range.replace(" ", "_")}.pdf`);
    }
  };

  return (
    <div className={styles.container + " animate-fadeIn"}>
      <div className={styles.noPrint}>
        <div className="page-header">
          <div>
            <h1 className="page-title">REPORTS & ANALYTICS 📈</h1>
            <p className="page-subtitle">PLATFORM USAGE, ENGAGEMENT METRICS, AND FINANCIAL REPORTING ACROSS ALL USER TIERS.</p>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <select 
              className="form-control" 
              style={{ width: 'auto', padding: '10px 14px', height: '44px', border: '3px solid #000', boxShadow: '3px 3px 0px #000', fontWeight: 950, fontSize: '0.65rem' }}
              value={range}
              onChange={(e) => setRange(e.target.value)}
            >
              <option value="TODAY">TODAY</option>
              <option value="LAST 7 DAYS">LAST 7 DAYS</option>
              <option value="LAST 30 DAYS">LAST 30 DAYS</option>
              <option value="YEAR TO DATE">YEAR TO DATE</option>
            </select>
            <button className="btn btn-primary btn-sm" style={{ padding: '0 18px', height: '44px' }} onClick={() => handleExport('PDF')}>📥 PDF DOWNLOAD</button>
          </div>
        </div>

        <div className={styles.kpiGrid}>
          {kpis.length > 0 ? kpis.map(kpi => (
            <div key={kpi.label} className={styles.kpiCard}>
              <div className={styles.kpiLabel}>{kpi.label}</div>
              <div className={styles.kpiValue}>{kpi.value}</div>
              <div className={styles.kpiChange} style={{ color: kpi.positive ? '#14a800' : '#FF3131' }}>
                {kpi.change} (VS LAST MONTH)
              </div>
            </div>
          )) : (
            [1,2,3,4].map(i => (
              <div key={i} className={styles.kpiCard} style={{ opacity: 0.5, borderStyle: 'dashed' }}>
                <div className={styles.kpiLabel}>METRIC {i}</div>
                <div className={styles.kpiValue}>0.0</div>
                <div className={styles.kpiChange}>NO DATA</div>
              </div>
            ))
          )}
        </div>

        <div className={styles.reportGrid}>
          <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>MOST ACTIVE STOCKS (24H)</h3>
              </div>
              <div className="table-responsive">
                <table className={styles.stockTable}>
                  <thead>
                      <tr>
                        <th>STOCK</th>
                        <th>USERS</th>
                        <th>ENGAGEMENT</th>
                        <th style={{ textAlign: 'center' }}>SENTIMENT</th>
                      </tr>
                  </thead>
                  <tbody>
                      {stocks.length > 0 ? stocks.map(stock => (
                        <tr key={stock.symbol}>
                            <td><strong className="text-upper">{stock.symbol}</strong></td>
                            <td><span style={{ fontWeight: 800 }}>{stock.users}</span></td>
                            <td><span style={{ fontSize: '0.6rem', fontWeight: 950 }}>{stock.engagement}</span></td>
                            <td>
                              <div style={{ display: 'flex', justifyContent: 'center' }}>
                                  <button className={`${styles.sentimentBtn} ${stock.sentiment === 'BULLISH' ? styles.bullish : stock.sentiment === 'BEARISH' ? styles.bearish : styles.moderate}`}>
                                    {stock.sentiment}
                                  </button>
                              </div>
                            </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center', padding: '60px 0', color: '#999', fontWeight: 900 }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>🔍</div>
                            NO ACTIVE STOCK DATA DETECTED FOR {range}
                          </td>
                        </tr>
                      )}
                  </tbody>
                </table>
              </div>
          </div>

          <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>USER TIER DISTRIBUTION</h3>
              </div>
              <div className={styles.chartArea}>
                { (distribution.free > 0 || distribution.pro > 0) ? (
                  <>
                    <div 
                      className={styles.pie} 
                      style={{ 
                        background: `conic-gradient(#0052CC 0% ${distribution.free}%, #00875A ${distribution.free}% ${distribution.free + distribution.pro}%, #FF991F ${distribution.free + distribution.pro}% 100%)`
                      }} 
                    />
                    <div className={styles.legend}>
                        <div className={styles.legendItem}><span style={{ color: '#0052CC', fontSize: '1.2rem' }}>■</span> FREE ({distribution.free}%)</div>
                        <div className={styles.legendItem}><span style={{ color: '#00875A', fontSize: '1.2rem' }}>■</span> PRO ({distribution.pro}%)</div>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#999', fontWeight: 900 }}>
                    <div style={{ width: 120, height: 120, borderRadius: '50%', border: '4px dashed #ccc', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>📉</div>
                    SYSTEM ANALYTICS UNAVAILABLE
                  </div>
                )}
              </div>
              <button className="btn btn-sm btn-secondary btn-full" style={{ borderTop: '4px solid #000' }} onClick={() => toast.success('Viewing revenue analysis...')}>VIEW REVENUE BREAKDOWN</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// End of file
