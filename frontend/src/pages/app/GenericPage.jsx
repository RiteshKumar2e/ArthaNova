import { useState, useEffect } from 'react'

export default function GenericPage({ title, description, icon }) {
  return (
    <div className="page-wrapper animate-fadeIn">
      <div className="page-header" style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '4px solid #000' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '1.5rem', fontWeight: 950, textTransform: 'uppercase' }}>{icon} {title?.toUpperCase()}</h1>
          <p className="page-subtitle" style={{ fontSize: '0.8rem', fontWeight: 800, color: '#666', textTransform: 'uppercase' }}>{description}</p>
        </div>
      </div>
      <div className="card" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '60px 20px', 
        textAlign: 'center',
        background: '#fff',
        border: '4px solid #000',
        boxShadow: '8px 8px 0px #000'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '15px' }}>{icon}</div>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '8px', fontWeight: 950, textTransform: 'uppercase' }}>Module Under Construction</h2>
        <p style={{ color: '#444', maxWidth: '380px', lineHeight: '1.5', fontWeight: 600, fontSize: '0.85rem' }}>
          We are actively working on integrating advanced AI models and data pipelines for the {title} feature. This will be available in the upcoming v1.1 release.
        </p>
        <button 
          className="btn btn-primary" 
          style={{ 
            marginTop: '25px', 
            fontWeight: 950, 
            textTransform: 'uppercase', 
            borderRadius: 0, 
            border: '3px solid #000',
            padding: '10px 20px',
            fontSize: '0.75rem'
          }} 
          onClick={() => window.history.back()}
        >
          ← Go Back
        </button>
      </div>
    </div>
  )
}
