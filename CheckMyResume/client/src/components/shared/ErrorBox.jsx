import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import './ErrorBox.css';

export default function ErrorBox() {
  const [error, setError] = useState(null);

  useEffect(() => {
    // Custom event listener for global application errors
    const handleAppError = (e) => {
      setError(e.detail?.message || 'An unexpected error occurred.');
      
      // Auto-dismiss after 8 seconds
      setTimeout(() => {
        setError(null);
      }, 8000);
    };

    window.addEventListener('app-error', handleAppError);
    return () => window.removeEventListener('app-error', handleAppError);
  }, []);

  if (!error) return null;

  return (
    <div className="error-box reveal slide-up visible" role="alert">
      <Icon icon="ph:warning-circle-bold" width="24" height="24" className="error-box__icon" />
      <div className="error-box__content">
        <strong>Error</strong>
        <p>{error}</p>
      </div>
      <button 
        className="error-box__close" 
        onClick={() => setError(null)}
        aria-label="Dismiss error"
      >
        <Icon icon="ph:x-bold" width="16" height="16" />
      </button>
    </div>
  );
}
