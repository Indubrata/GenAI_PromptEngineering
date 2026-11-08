import { useRef } from 'react';
import { Icon } from '@iconify/react';
import './StorySection.css';



export default function StorySection() {
  const containerRef = useRef(null);
  const leftPinRef = useRef(null);
  const rightScrollRef = useRef(null);
  

  return (
    <section id="story" className="story-section" ref={containerRef}>
      <div className="container story__inner">
        
        {/* Left: Pinned Story Content */}
        <div className="story__left" ref={leftPinRef}>
          <div className="story__content">
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
          <div className="story__card reveal">
            <div className="story__card-icon">
              <Icon icon="ph:robot-bold" width="32" height="32" color="var(--text-secondary)" />
            </div>
            <h3>The ATS Filter</h3>
            <p>Companies use rigid software to scan for exact keyword matches. If you say "Customer Service" but they want "Client Relations", you're filtered out.</p>
          </div>

          <div className="story__card reveal">
            <div className="story__card-icon">
              <Icon icon="ph:brain-bold" width="32" height="32" color="var(--text-secondary)" />
            </div>
            <h3>AI Semantic Matching</h3>
            <p>Our dual-failover LLM engine understands the context of your experience and intelligently injects the exact terminology recruiters are searching for.</p>
          </div>

          <div className="story__card reveal">
            <div className="story__card-icon">
              <Icon icon="ph:check-circle-bold" width="32" height="32" color="var(--text-secondary)" />
            </div>
            <h3>Human-Grade Polish</h3>
            <p>We don't just stuff keywords. The AI rewrites bullet points to sound impactful, professional, and entirely human.</p>
          </div>
        </div>

      </div>
    </section>
  );
}
