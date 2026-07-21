import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './MagneticCursor.css';

export default function MagneticCursor() {
  const cursorDotRef = useRef(null);
  const cursorOutlineRef = useRef(null);
  const requestRef = useRef(null);
  
  // State for cursor positions
  const mouse = useRef({ x: 0, y: 0 });
  const outline = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Respect reduced motion preference - don't show custom cursor if they prefer reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || 'ontouchstart' in window) return; // Also don't show on touch devices

    const dot = cursorDotRef.current;
    const out = cursorOutlineRef.current;

    // Use GSAP quickSetter for maximum performance instead of React state for mouse coordinates
    const setDotX = gsap.quickSetter(dot, "x", "px");
    const setDotY = gsap.quickSetter(dot, "y", "px");
    const setOutX = gsap.quickSetter(out, "x", "px");
    const setOutY = gsap.quickSetter(out, "y", "px");

    const onMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      
      // Instantly move the dot
      setDotX(mouse.current.x);
      setDotY(mouse.current.y);
    };

    // Animation loop for the lagging outline
    const render = () => {
      // Lerp (linear interpolation) for smooth magnetic delay
      outline.current.x += (mouse.current.x - outline.current.x) * 0.15;
      outline.current.y += (mouse.current.y - outline.current.y) * 0.15;

      setOutX(outline.current.x);
      setOutY(outline.current.y);

      requestRef.current = requestAnimationFrame(render);
    };

    // Handle magnetic hover effects on specific elements (like buttons, links, etc.)
    const onMouseEnterMagnetic = () => {
      gsap.to(out, { scale: 1.5, backgroundColor: 'rgba(212, 175, 55, 0.1)', borderColor: 'rgba(212, 175, 55, 0.5)', duration: 0.3 });
    };

    const onMouseLeaveMagnetic = () => {
      gsap.to(out, { scale: 1, backgroundColor: 'transparent', borderColor: 'var(--accent-copper-soft)', duration: 0.3 });
    };

    // Attach event listeners
    window.addEventListener('mousemove', onMouseMove);
    requestRef.current = requestAnimationFrame(render);

    // Find all clickable elements to add the magnetic effect
    const interactables = document.querySelectorAll('a, button, input, .hover-glow');
    interactables.forEach(el => {
      el.addEventListener('mouseenter', onMouseEnterMagnetic);
      el.addEventListener('mouseleave', onMouseLeaveMagnetic);
    });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(requestRef.current);
      
      interactables.forEach(el => {
        el.removeEventListener('mouseenter', onMouseEnterMagnetic);
        el.removeEventListener('mouseleave', onMouseLeaveMagnetic);
      });
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={cursorDotRef}></div>
      <div className="cursor-outline" ref={cursorOutlineRef}></div>
    </>
  );
}
