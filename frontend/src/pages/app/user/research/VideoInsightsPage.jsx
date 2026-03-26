import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../../../api/client';
import styles from '../../../../styles/pages/app/user/research/VideoInsights.module.css'

export default function VideoInsightsPage() {
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState('60s');
  const [processingJob, setProcessingJob] = useState(null);
  const [progressMessage, setProgressMessage] = useState('');

  useEffect(() => {
    fetchUserVideos();
    const interval = setInterval(() => {
      fetchUserVideos();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Update progress message for processing job
  useEffect(() => {
    if (!processingJob) return;

    const progress = processingJob.progress || 0;
    let message = '';

    if (progress < 30) message = 'Analyzing market data...';
    else if (progress < 60) message = 'Generating video content...';
    else if (progress < 90) message = 'Synthesizing AI performance...';
    else message = 'Finalizing video...';

    setProgressMessage(message);
  }, [processingJob?.progress]);

  const fetchUserVideos = async () => {
    try {
      const response = await adminAPI.videoEngine.listJobs();
      const jobs = response.data.jobs || [];
      setVideos(jobs);

      // Check if processing job is complete
      if (processingJob) {
        const updated = jobs.find(j => j.id === processingJob.id);
        if (updated) {
          setProcessingJob(updated);
          if (updated.status === 'COMPLETED') {
            setTimeout(() => setProcessingJob(null), 3000);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await adminAPI.videoEngine.createJob({ 
        title: topic, 
        duration,
      });

      setProcessingJob(response.data.job);
      setTopic('');
      fetchUserVideos();
    } catch (error) {
      alert('GENERATION FAILED. CHECK API STATUS.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.videoContainer}>
      {/* Processing Popup */}
      {processingJob && (
        <div className={styles.popup} style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) scale(1)',
          background: 'rgba(26, 26, 46, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '2px solid #14a800',
          borderRadius: '16px',
          padding: '40px',
          textAlign: 'center',
          zIndex: 1000,
          minWidth: '400px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 20px rgba(20, 168, 0, 0.2)',
          animation: 'fadeInScale 0.4s ease-out'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎬</div>
          <h2 style={{ 
            color: '#14a800', 
            marginBottom: '10px', 
            fontSize: '24px', 
            fontWeight: '900',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            AI Video Generation
          </h2>
          <div style={{
            margin: '25px 0',
            height: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(90deg, #14a800 0%, #00ff00 100%)',
              width: `${processingJob.progress}%`,
              transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 0 10px #14a800'
            }}></div>
          </div>
          <p style={{ 
            color: '#fff', 
            marginBottom: '8px', 
            fontSize: '16px', 
            fontWeight: '600',
            minHeight: '24px'
          }}>{progressMessage}</p>
          <p style={{ color: '#14a800', fontSize: '14px', fontFamily: 'monospace', fontWeight: 'bold' }}>
            {processingJob.progress}% COMPLETE
          </p>
          <div style={{ marginTop: '20px', fontSize: '12px', color: '#666', fontStyle: 'italic' }}>
            TARGET: {processingJob.topic}
          </div>
        </div>
      )}

      {/* Overlay */}
      {processingJob && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.7)',
          zIndex: 999
        }}></div>
      )}

      <header className={styles.header}>
        <h1 className={styles.title}>AI VIDEO INSIGHTS ENGINE 🎬</h1>
        <p className={styles.subtitle}>GENERATE REAL-TIME VIDEO SUMMARIES OF INDIAN MARKET MOVEMENTS.</p>
      </header>

      <section className={styles.generateSection}>
        <div className={styles.card}>
          <h3>CREATE NEW AI VIDEO</h3>
          <form onSubmit={handleGenerate} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>SUMMARIZE TOPIC / SYMBOL</label>
              <input 
                className={styles.input}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="E.G. NIFTY 50 RECAP or RELIANCE Q3" 
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>VIDEO LENGTH</label>
              <select className={`${styles.select} neo-select`} value={duration} onChange={(e) => setDuration(e.target.value)}>
                <option>30s (SHORTS)</option>
                <option>60s (SQUARE)</option>
                <option>120s (WIDE)</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary btn-full shadow-sm" disabled={loading}>
              {loading ? 'SYNTHESIZING...' : 'GENERATE AI VIDEO'}
            </button>
          </form>
        </div>
      </section>

      <section className={styles.videosSection}>
        <h2 className={styles.sectionTitle}>YOUR GENERATED INSIGHTS</h2>
        <div className={styles.videoGrid}>
          {videos.length === 0 ? (
            <div className={styles.emptyState}>
              <p>NO VIDEOS GENERATED YET. START YOUR FIRST PIPELINE ABOVE.</p>
            </div>
          ) : (
            videos.map((vid) => (
              <div key={vid.id} className={styles.videoCard}>
                <div className={styles.videoThumb}>
                  {vid.status === 'COMPLETED' && vid.videoUrl && (
                    <video 
                      src={vid.videoUrl} 
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
                    />
                  )}
                  {vid.status !== 'COMPLETED' && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column'
                    }}>
                      <div style={{
                        fontSize: '32px',
                        marginBottom: '10px',
                        animation: 'spin 2s linear infinite'
                      }}>⏳</div>
                      <div style={{ fontSize: '12px', color: '#14a800' }}>
                        {vid.progress}%
                      </div>
                    </div>
                  )}
                  <div className={styles.playIcon} style={{ position: 'relative', zIndex: 10 }}>
                    {vid.status === 'COMPLETED' ? '▶' : '⏳'}
                  </div>
                </div>
                <div className={styles.videoInfo}>
                  <h4 className={styles.videoTitle}>{vid.topic || vid.title}</h4>
                  <div className={styles.videoMeta}>
                    <span>{vid.duration}</span>
                    <span className={styles.statusDot} style={{ 
                      background: vid.status === 'COMPLETED' ? '#14a800' : vid.status === 'FAILED' ? '#ff4444' : '#ff9900' 
                    }}></span>
                    <span className={styles.statusText}>{vid.status}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </div>
  );
}
