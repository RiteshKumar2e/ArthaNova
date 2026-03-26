import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../../../api/client';
import styles from '../../../../styles/pages/app/user/research/VideoInsights.module.css'

export default function VideoInsightsPage() {
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState('60s');

  useEffect(() => {
    fetchUserVideos();
    const interval = setInterval(() => {
      fetchUserVideos();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchUserVideos = async () => {
    try {
      // Re-using the admin listing but filtered (or just as a demo)
      const response = await adminAPI.videoEngine.listJobs();
      setVideos(response.data.jobs || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminAPI.videoEngine.createJob({ 
        title: topic, 
        duration,
        quality: '1080P FULL HD',
        context: 'user_generated'
      });
      alert('AI IS NOW SYNTHESIZING YOUR MARKET VIDEO. IT WILL APPEAR BELOW SOON.');
      setTopic('');
      fetchUserVideos();
    } catch (error) {
      alert('GENERATION FAILED. CHECK API STATUS.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.videoContainer}>
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
                  {vid.status === 'COMPLETED' && (
                    <video 
                      src="https://assets.mixkit.co/videos/preview/mixkit-trading-candlesticks-on-a-digital-screen-28042-large.mp4" 
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
                    />
                  )}
                  <div className={styles.playIcon} style={{ position: 'relative', zIndex: 10 }}>
                    {vid.status === 'COMPLETED' ? '▶' : '⏳'}
                  </div>
                </div>
                <div className={styles.videoInfo}>
                  <h4 className={styles.videoTitle}>{vid.title}</h4>
                  <div className={styles.videoMeta}>
                    <span>{vid.duration}</span>
                    <span className={styles.statusDot} style={{ background: vid.status === 'COMPLETED' ? '#14a800' : '#ff9900' }}></span>
                    <span className={styles.statusText}>{vid.status}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
