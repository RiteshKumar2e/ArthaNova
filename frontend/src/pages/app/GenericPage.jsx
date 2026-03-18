import { useState, useEffect } from 'react'

export default function GenericPage({ title, description, icon }) {
  return (
    <div className="page-wrapper animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">{icon} {title}</h1>
          <p className="page-subtitle">{description}</p>
        </div>
      </div>
      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>{icon}</div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Module Under Construction</h2>
        <p style={{ color: '#5E6C84', maxWidth: '400px', lineHeight: '1.6' }}>We are actively working on integrating advanced AI models and data pipelines for the {title} feature. This will be available in the upcoming v1.1 release.</p>
        <button className="btn btn-primary" style={{ marginTop: '30px' }} onClick={() => window.history.back()}>
          ← Go Back
        </button>
      </div>
    </div>
  )
}
