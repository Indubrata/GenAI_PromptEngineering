import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import SpecularButton from '../ui/SpecularButton';
import './HeroSection.css';
export default function HeroSection() {
  const navigate = useNavigate();
  return <section className="hero">
      {/* Page content */}
      <div className="container-hero hero__content">
        <h1 className="hero__title">
          Your Resume. Reimagined by AI.
        </h1>

        <p className="hero__subtitle">
          Stop getting rejected by ATS algorithms. CheckMyResume analyzes your
          PDF, identifies missing keywords, and generates a perfectly formatted,
          recruiter-ready profile in seconds.
        </p>

        <div className="hero__actions">
          <SpecularButton
            size="lg"
            onClick={() =>
              document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            Upload Resume
          </SpecularButton>

          <button
            className="hero__secondary-btn"
            onClick={() => navigate('/editor')}
          >
            Build from Scratch
            <Icon icon="ph:arrow-right-bold" width="16" height="16" />
          </button>
        </div>
      </div>

      <div className="hero__scroll-indicator">
        <div className="hero__scroll-mouse">
          <div className="hero__scroll-wheel" />
        </div>
        <span>Scroll to explore</span>
      </div>

  </section>;
}
