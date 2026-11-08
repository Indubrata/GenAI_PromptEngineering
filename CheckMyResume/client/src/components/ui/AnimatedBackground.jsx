import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './AnimatedBackground.css';

export default function AnimatedBackground() {
  const backgroundRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const background = backgroundRef.current;
    const updateVisibility = () => {
      if (background) background.dataset.paused = String(document.hidden);
    };
    updateVisibility();
    document.addEventListener('visibilitychange', updateVisibility);
    return () => document.removeEventListener('visibilitychange', updateVisibility);
  }, []);

  return (
    <div ref={backgroundRef} className={`animated-background${pathname === '/' ? '' : ' animated-background--quiet'}`} aria-hidden="true">
      <div className="animated-background__palette animated-background__palette--light">
        <div className="animated-background__glow" />
        <div className="animated-background__dust" />
      </div>
      <div className="animated-background__palette animated-background__palette--dark">
        <div className="animated-background__glow" />
        <div className="animated-background__dust" />
      </div>
    </div>
  );
}
