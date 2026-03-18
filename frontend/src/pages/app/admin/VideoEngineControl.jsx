import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../../store/authStore';

export default function VideoEngineControl() {
  const [pipelines, setPipelines] = useState(null);
  const [loading, setLoading] = useState(true);
  const { accessToken } = useAuthStore();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get('/api/v1/admin/video/pipelines', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setPipelines(response.data);
      } catch (error) {
        console.error('Error fetching video engine status:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, [accessToken]);

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">Video Engine Control Panel 🎬</h1>
          <p className="page-subtitle">Manage automated stock video generation pipelines and rendering clusters.</p>
        </div>
        <button className="btn btn-primary">➕ Create New Job</button>
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-header">
            <h3>Render Jobs Status (Live)</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { id: 'JOB-901', name: 'NIFTY DAILY', progress: 85, status: 'Rendering' },
              { id: 'JOB-902', name: 'HDFCBANK ANALYSIS', progress: 42, status: 'Rendering' },
              { id: 'JOB-903', name: 'IPO HIGHLIGHTS', progress: 0, status: 'Waiting' },
            ].map(job => (
              <div key={job.id} style={{ paddingBottom: 12, borderBottom: '1px solid #DFE1E6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <strong>{job.name} <span style={{ fontSize: '0.7rem', color: '#5E6C84' }}>({job.id})</span></strong>
                  <span className={`badge ${job.status === 'Rendering' ? 'badge-primary' : 'badge-secondary'}`}>{job.status}</span>
                </div>
                <div className="progress" style={{ height: 6, width: '100%', borderRadius: 3, background: '#F4F5F7' }}>
                   <div style={{ height: 6, width: `${job.progress}%`, background: '#0052CC', borderRadius: 3 }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>GPU Rendering Cluster</h3>
          </div>
          <div style={{ padding: 16, height: 120, display: 'flex', gap: 24, alignItems: 'center' }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
               <div style={{ fontSize: '2rem', fontWeight: 700, color: '#00875A' }}>14</div>
               <div style={{ fontSize: '0.75rem', color: '#5E6C84' }}>Online Nodes</div>
            </div>
            <div style={{ height: '100%', width: 1, background: '#DFE1E6' }}></div>
            <div style={{ flex: 1, textAlign: 'center' }}>
               <div style={{ fontSize: '2rem', fontWeight: 700, color: '#0052CC' }}>82%</div>
               <div style={{ fontSize: '0.75rem', color: '#5E6C84' }}>Cluster Load</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, padding: 16, paddingTop: 0 }}>
             <button className="btn btn-sm btn-secondary" style={{ flex: 1 }}>Manage Cluster</button>
             <button className="btn btn-sm btn-secondary" style={{ flex: 1 }}>Clear Cache</button>
          </div>
        </div>
      </div>

      <div className="card">
         <div className="card-header">
            <h3>Recent Generated Videos</h3>
         </div>
         <div className="table-responsive">
            <table className="table">
               <thead>
                  <tr>
                     <th>Video Title</th>
                     <th>Job ID</th>
                     <th>Duration</th>
                     <th>Format</th>
                     <th>Status</th>
                     <th>Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {[
                    { title: 'Reliance Q3 Results Summary', id: 'V-901', duration: '1:12', format: 'MP4 (1080p)', status: 'Ready' },
                    { title: 'Nifty Bull Run Analysis March', id: 'V-902', duration: '0:58', format: 'MP4 (1080p)', status: 'Ready' },
                    { title: 'Zomato Share Price Forecast', id: 'V-903', duration: '1:45', format: 'MOV (High-res)', status: 'Ready' },
                  ].map(v => (
                    <tr key={v.id}>
                      <td><strong>{v.title}</strong></td>
                      <td>{v.id}</td>
                      <td>{v.duration}</td>
                      <td>{v.format}</td>
                      <td><span className="badge badge-success">{v.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                           <button className="btn btn-sm btn-secondary">Preview</button>
                           <button className="btn btn-sm btn-primary">Publish</button>
                        </div>
                      </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
