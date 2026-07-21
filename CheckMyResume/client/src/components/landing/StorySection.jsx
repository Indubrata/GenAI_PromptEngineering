import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Icon } from '@iconify/react';
import './StorySection.css';

gsap.registerPlugin(ScrollTrigger);

export default function StorySection() {
  const containerRef = useRef(null);
  const leftPinRef = useRef(null);
  const rightScrollRef = useRef(null);
  
  useEffect(() => {
    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    
    // GSAP ScrollTrigger for pinned section (scroll-experience skill)
    // Left side pins, right side scrolls
    const mm = gsap.matchMedia();
    
    mm.add("(min-width: 1024px)", () => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: leftPinRef.current,
        pinSpacing: false,
      });
      
      // Parallax effect on the images in the right column
      const cards = gsap.utils.toArray('.story__card');
      cards.forEach((card, i) => {
        gsap.fromTo(card, 
          { y: 100, opacity: 0 },
          { 
            y: 0, 
            opacity: 1,
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              end: "top 30%",
              scrub: 1
            }
          }
        );
      });
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section id="story" className="story-section" ref={containerRef}>
      <div className="container story__inner">
        
        {/* Left: Pinned Story Content */}
        <div className="story__left" ref={leftPinRef}>
          <div className="story__content">
            <div className="story__badge">The Problem</div>
            <h2 className="story__title">Your resume is being read by a robot. It should be written by one.</h2>
            <p className="story__text">
              Over 75% of resumes are rejected by Applicant Tracking Systems (ATS) before a human ever sees them. Even if you have the perfect experience, missing a single keyword can cost you the interview.
            </p>
            <p className="story__text">
              CheckMyResume bridges the gap between your experience and the algorithm's expectations.
            </p>
            
            <ul className="story__stats">
              <li>
                <strong>2.5x</strong>
                <span>Higher interview rate</span>
              </li>
              <li>
                <strong>10k+</strong>
                <span>ATS algorithms bypassed</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right: Scrolling Visuals */}
        <div className="story__right" ref={rightScrollRef}>
          <div className="story__card glass">
            <div className="story__card-icon" style={{ backgroundColor: 'color-mix(in srgb, var(--error-bg) 50%, transparent)' }}>
              <Icon icon="ph:robot-bold" width="32" height="32" color="var(--error-text)" />
            </div>
            <h3>The ATS Filter</h3>
            <p>Companies use rigid software to scan for exact keyword matches. If you say "Customer Service" but they want "Client Relations", you're filtered out.</p>
          </div>

          <div className="story__card glass">
            <div className="story__card-icon" style={{ backgroundColor: 'var(--accent-gold-soft)' }}>
              <Icon icon="ph:brain-bold" width="32" height="32" color="var(--accent-gold)" />
            </div>
            <h3>AI Semantic Matching</h3>
            <p>Our dual-failover LLM engine understands the context of your experience and intelligently injects the exact terminology recruiters are searching for.</p>
          </div>

          <div className="story__card glass">
            <div className="story__card-icon" style={{ backgroundColor: 'color-mix(in srgb, var(--success-text) 20%, transparent)' }}>
              <Icon icon="ph:check-circle-bold" width="32" height="32" color="var(--success-text)" />
            </div>
            <h3>Human-Grade Polish</h3>
            <p>We don't just stuff keywords. The AI rewrites bullet points to sound impactful, professional, and entirely human.</p>
          </div>
        </div>

      </div>
    </section>
  );
}
