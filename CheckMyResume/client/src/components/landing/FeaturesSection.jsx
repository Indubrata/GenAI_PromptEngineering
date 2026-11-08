import { useRef } from 'react';
import { Icon } from '@iconify/react';
import './FeaturesSection.css';



export default function FeaturesSection() {
  const gridRef = useRef(null);

  return (
    <section id="features" className="features-section container">
      <div className="features__header">
        <h2 className="features__title">The Ultimate Resume Toolkit.</h2>
        <p className="features__subtitle">Everything you need to beat the ATS and impress the hiring manager, packed into one seamless experience.</p>
      </div>

      {/* Gapless Bento Grid per gpt-taste skill */}
      <div className="bento-grid" ref={gridRef}>
        
        {/* Large Feature: Real-time Editor */}
        <div className="bento-card bento-card--large reveal">
          <div className="bento-card__content">
            <div className="bento-card__icon">
              <Icon icon="ph:magic-wand-bold" width="28" height="28" />
            </div>
            <h3>Guided Resume Editor</h3>
            <p>Edit your experience, education, and skills with practical writing tips. Keep every detail accurate and ready to share.</p>
          </div>

        </div>

        {/* Medium Feature: Keyword Matching */}
        <div className="bento-card bento-card--medium reveal">
          <div className="bento-card__content">
            <div className="bento-card__icon">
              <Icon icon="ph:crosshair-bold" width="28" height="28" />
            </div>
            <h3>Precision Keyword Matching</h3>
            <p>We extract exact phrases from your target job description and weave them naturally into your experience.</p>
          </div>
        </div>

        {/* Medium Feature: Formatting */}
        <div className="bento-card bento-card--medium reveal">
          <div className="bento-card__content">
            <div className="bento-card__icon">
              <Icon icon="ph:layout-bold" width="28" height="28" />
            </div>
            <h3>ATS-Proof Formatting</h3>
            <p>Export to beautifully typeset PDFs that parse perfectly in Workday, Greenhouse, and Lever.</p>
          </div>
        </div>

        {/* Small Feature: Live Scraping */}
        <div className="bento-card bento-card--small reveal">
          <div className="bento-card__content">
            <div className="bento-card__icon">
              <Icon icon="ph:magnifying-glass-bold" width="28" height="28" />
            </div>
            <h3>Live Job Scraping</h3>
            <p>Find hidden roles that perfectly match your newly optimized resume.</p>
          </div>
        </div>

        {/* Small Feature: Outreach */}
        <div className="bento-card bento-card--small reveal">
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
