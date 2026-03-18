import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Premium Brand Logo Component for ArthaNova
 * @param {Object} props
 * @param {string} props.variant - 'dark' (default) or 'light'
 * @param {number} props.size - pixel size of the icon (default 24)
 * @param {boolean} props.withText - whether to show the "ArthaNova" text (default true)
 * @param {string} props.className - optional container className
 */
export default function BrandLogo({ 
  variant = 'dark', 
  size = 20, 
  withText = true, 
  className = "" 
}) {
  const isDark = variant === 'dark';
  const accentColor = "#60a5fa"; // Modern blue

  return (
    <Link 
      to="/" 
      className={`brand-logo-root ${className}`}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        textDecoration: 'none',
        padding: '2px'
      }}
    >
      <motion.div 
        className="brand-logo-icon-wrapper"
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        style={{
          width: size + 16,
          height: size + 16,
          background: isDark ? '#0f172a' : 'white',
          borderRadius: '11px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: isDark 
            ? `0 0 20px ${accentColor}22` 
            : '0 4px 12px rgba(0, 0, 0, 0.05)',
          border: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`,
          transition: 'all 0.3s ease'
        }}
      >
        <Zap 
          size={size} 
          fill={accentColor} 
          style={{ 
            color: accentColor,
            filter: `drop-shadow(0 0 8px ${accentColor}66)` 
          }} 
        />
      </motion.div>

      {withText && (
        <motion.span 
          className="brand-logo-text"
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            fontFamily: "'Outfit', 'Inter', sans-serif",
            fontSize: '1.35rem',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            background: isDark 
              ? 'linear-gradient(135deg, #0f172a 0%, #475569 100%)' 
              : 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block',
            paddingLeft: '2px'
          }}
        >
          ArthaNova
        </motion.span>
      )}
    </Link>
  );
}
