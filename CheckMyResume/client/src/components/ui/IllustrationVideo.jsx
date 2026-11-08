import { useEffect, useRef } from 'react';
import './IllustrationVideo.css';

export default function IllustrationVideo({ src, className = '', active = true }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let inView = false;
    const sync = () => {
      if (active && inView && !document.hidden && !motion.matches) video.play().catch(() => {});
      else video.pause();
    };
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); });
    observer.observe(video);
    document.addEventListener('visibilitychange', sync);
    motion.addEventListener('change', sync);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      motion.removeEventListener('change', sync);
      video.pause();
    };
  }, [active]);

  return <video ref={videoRef} className={`illustration-video ${className}`} src={src} muted loop playsInline preload="metadata" aria-hidden="true" />;
}
