import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Icon } from '@iconify/react';
import './FeaturesSection.css';

gsap.registerPlugin(ScrollTrigger);

export default function FeaturesSection() {
  const gridRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Card stacking animation on scroll (from gpt-taste skill)
    const cards = gsap.utils.toArray('.bento-card');
    
    cards.forEach((card, i) => {
      gsap.fromTo(card,
        { 
          opacity: 0,
          y: 60,
          scale: 0.95 
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  }, []);

  return (
    <section id="features" className="features-section container">
      <div className="features__header">
        <h2 className="features__title">The Ultimate Resume Toolkit.</h2>
        <p className="features__subtitle">Everything you need to beat the ATS and impress the hiring manager, packed into one seamless experience.</p>
      </div>

      {/* Gapless Bento Grid per gpt-taste skill */}
      <div className="bento-grid" ref={gridRef}>
        
        {/* Large Feature: Real-time Editor */}
        <div className="bento-card bento-card--large hover-glow">
          <div className="bento-card__content">
            <div className="bento-card__icon">
              <Icon icon="ph:magic-wand-bold" width="28" height="28" />
            </div>
            <h3>Real-Time AI Editor</h3>
            <p>Watch the AI rewrite your bullets for maximum impact as you type. No more guessing what recruiters want to read.</p>
          </div>
          <div className="bento-card__visual bento-card__visual--editor">
            {/* Decorative visual representation */}
            <div className="fake-editor">
              <div className="fake-line"><span className="fake-text w-60"></span><span className="fake-highlight">Analyzed</span></div>
              <div className="fake-line"><span className="fake-text w-80"></span></div>
              <div className="fake-line"><span className="fake-text w-40"></span></div>
            </div>
          </div>
        </div>

        {/* Medium Feature: Keyword Matching */}
        <div className="bento-card bento-card--medium hover-glow">
          <div className="bento-card__content">
            <div className="bento-card__icon">
              <Icon icon="ph:crosshair-bold" width="28" height="28" />
            </div>
            <h3>Precision Keyword Matching</h3>
            <p>We extract exact phrases from your target job description and weave them naturally into your experience.</p>
          </div>
        </div>

        {/* Medium Feature: Formatting */}
        <div className="bento-card bento-card--medium hover-glow">
          <div className="bento-card__content">
            <div className="bento-card__icon">
              <Icon icon="ph:layout-bold" width="28" height="28" />
            </div>
            <h3>ATS-Proof Formatting</h3>
            <p>Export to beautifully typeset PDFs that parse perfectly in Workday, Greenhouse, and Lever.</p>
          </div>
        </div>

        {/* Small Feature: Live Scraping */}
        <div className="bento-card bento-card--small hover-glow">
          <div className="bento-card__content">
            <div className="bento-card__icon">
              <Icon icon="ph:magnifying-glass-bold" width="28" height="28" />
            </div>
            <h3>Live Job Scraping</h3>
            <p>Find hidden roles that perfectly match your newly optimized resume.</p>
          </div>
        </div>

        {/* Small Feature: Outreach */}
        <div className="bento-card bento-card--small hover-glow">
          <div className="bento-card__content">
            <div className="bento-card__icon">
              <Icon icon="ph:envelope-simple-bold" width="28" height="28" />
            </div>
            <h3>Recruiter Outreach</h3>
            <p>Generate highly personalized LinkedIn messages to hiring managers.</p>
          </div>
        </div>

      </div>
    </section>
  );
}
