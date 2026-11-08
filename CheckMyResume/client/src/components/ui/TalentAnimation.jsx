import { useEffect, useRef } from 'react';
import lottie from 'lottie-web/build/player/lottie_light';
import animationData from '../../assets/animations/talent-search.json';

export default function TalentAnimation() {
  const containerRef = useRef(null);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    let animation;
    try {
      animation = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: false,
        animationData: structuredClone(animationData),
        rendererSettings: { preserveAspectRatio: 'xMidYMid meet', progressiveLoad: false },
      });
    } catch {
      return undefined;
    }
    const syncPlayback = () => {
      if (motion.matches) animation.goToAndStop(0, true);
      else if (visible && !document.hidden) animation.play();
      else animation.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    });
    observer.observe(containerRef.current);
    motion.addEventListener('change', syncPlayback);
    document.addEventListener('visibilitychange', syncPlayback);
    return () => {
      observer.disconnect();
      motion.removeEventListener('change', syncPlayback);
      document.removeEventListener('visibilitychange', syncPlayback);
      animation.destroy();
    };
  }, []);

  return <div ref={containerRef} className="hero__talent-animation" aria-hidden="true" />;
}
