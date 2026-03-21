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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minHeight: 120, alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>🎥</div>
            <p style={{ color: '#5E6C84', fontSize: '0.85rem' }}>No active rendering jobs at the moment.</p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>GPU Rendering Cluster</h3>
          </div>
          <div style={{ padding: 16, height: 120, display: 'flex', gap: 24, alignItems: 'center' }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
               <div style={{ fontSize: '2rem', fontWeight: 700, color: '#00875A' }}>0</div>
               <div style={{ fontSize: '0.75rem', color: '#5E6C84' }}>Online Nodes</div>
            </div>
            <div style={{ height: '100%', width: 1, background: '#DFE1E6' }}></div>
            <div style={{ flex: 1, textAlign: 'center' }}>
               <div style={{ fontSize: '2rem', fontWeight: 700, color: '#0052CC' }}>0%</div>
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
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: 40, color: '#97A0AF' }}>
                      No videos have been generated yet.
                    </td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
