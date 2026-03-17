import React from 'react';
import { motion } from 'framer-motion';

const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      ref={ref}
      className={`btn ${variantClass} ${sizeClass} ${className || ''}`}
      {...props}
    >
      {isLoading && (
        <div className="loader" style={{ width: '14px', height: '14px', border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', marginRight: '8px' }} />
      )}
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;
