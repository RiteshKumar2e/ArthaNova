import { useNavigate } from 'react-router-dom'

export default function GenericPage({ title, description, icon }) {
  const navigate = useNavigate()

  return (
    <div className="page-wrapper animate-fadeIn">
      <div className="page-header" style={{ borderBottom: '4px solid #000', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>{icon}</span> 
            {title?.toUpperCase()}
          </h1>
          <p className="page-subtitle" style={{ color: '#000', fontWeight: 900, opacity: 0.6 }}>{description?.toUpperCase()}</p>
        </div>
      </div>

      <div className="card" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '80px 40px', 
        textAlign: 'center',
        background: '#fff',
        border: '4px solid #000',
        boxShadow: '12px 12px 0px #000',
        margin: '20px auto',
        maxWidth: '800px'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>{icon}</div>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '12px', fontWeight: 950, textTransform: 'uppercase', color: '#000' }}>
          Module Under Construction
        </h2>
        <p style={{ color: '#333', maxWidth: '450px', lineHeight: '1.6', fontWeight: 700, fontSize: '0.95rem' }}>
          We are actively working on integrating advanced AI models and data pipelines for the {title} feature. This will be available in the upcoming v1.1 release.
        </p>
        <button 
          className="btn" 
          style={{ 
            marginTop: '35px', 
            fontWeight: 950, 
            textTransform: 'uppercase', 
            borderRadius: 0, 
            border: '4px solid #000',
            padding: '14px 32px',
            fontSize: '0.85rem',
            background: '#C4FF00',
            boxShadow: '6px 6px 0px #000',
            cursor: 'pointer'
          }} 
          onClick={() => navigate(-1)}
        >
          ← Go Back
        </button>
      </div>
    </div>
  )
}
