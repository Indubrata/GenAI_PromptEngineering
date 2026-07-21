import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './ScoreMeter.css';

export default function ScoreMeter({ score = 0, isAnimating = false }) {
  const circleRef = useRef(null);
  const textRef = useRef(null);
  const [displayScore, setDisplayScore] = useState(0);

  // SVG dimensions and math
  const size = 240;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (isAnimating) {
      // Loop a pulsing waiting animation if still analyzing
      gsap.to(circleRef.current, {
        strokeDashoffset: circumference * 0.2, // Show a 80% ring spinning
        rotation: 360,
        transformOrigin: "50% 50%",
        repeat: -1,
        ease: "linear",
        duration: 2
      });
      return;
    }

    // Actual score reveal
    gsap.killTweensOf(circleRef.current);
    
    const targetOffset = circumference - (score / 100) * circumference;
    
    // Animate the stroke dash array
    gsap.fromTo(circleRef.current, 
      { strokeDashoffset: circumference, rotation: -90, transformOrigin: "50% 50%" },
      { 
        strokeDashoffset: targetOffset,
        rotation: -90, // Keep starting from top
        duration: prefersReducedMotion ? 0 : 2, 
        ease: "power3.out"
      }
    );

    // Animate the number counting up
    gsap.to({ val: 0 }, {
      val: score,
      duration: prefersReducedMotion ? 0 : 2,
      ease: "power3.out",
      onUpdate: function() {
        setDisplayScore(Math.round(this.targets()[0].val));
      }
    });

  }, [score, isAnimating, circumference]);

  // Determine color based on score
  let strokeColor = 'var(--error-text)'; // Red < 50
  if (score >= 50 && score < 75) strokeColor = 'var(--accent-gold)'; // Yellow 50-74
  if (score >= 75) strokeColor = 'var(--success-text)'; // Green 75+
  if (isAnimating) strokeColor = 'var(--accent-copper)'; // Loading state

  return (
    <div className="score-meter">
      <svg width={size} height={size} className="score-meter__svg">
        {/* Background track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--bg-muted)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          style={{ transition: 'stroke 0.3s ease' }}
        />
      </svg>
      
      <div className="score-meter__content">
        {isAnimating ? (
          <span className="score-meter__loading">Analyzing</span>
        ) : (
          <>
            <span className="score-meter__value" ref={textRef}>{displayScore}</span>
            <span className="score-meter__label">/ 100</span>
          </>
        )}
      </div>
    </div>
  );
}
