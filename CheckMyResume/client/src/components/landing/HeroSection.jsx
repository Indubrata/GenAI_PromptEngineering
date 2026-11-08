import { useNavigate } from 'react-router-dom';
import { scrollToSection } from '../../utils/scrollToSection';
import { lazy, Suspense } from 'react';
const TalentAnimation = lazy(() => import('../ui/TalentAnimation'));
import './HeroSection.css';

export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="hero">
      <div className="container-hero hero__content">
        <div className="hero__copy">
        <h1 className="hero__title"><span className="hero__title-line">Your Resume.</span><span className="hero__title-line">Reimagined by AI.</span></h1>
        <p className="hero__subtitle">
          Upload a PDF, compare it with your target role, and refine your resume.
        </p>
        <div className="hero__actions">
          <button className="hero__primary-btn" onClick={() => scrollToSection('upload')}>
            Upload Resume
          </button>
          <button className="hero__secondary-btn" onClick={() => navigate('/editor')}>
            Build from Scratch
          </button>
        </div>
        </div>
        <div className="hero__illustration" aria-label="Illustration of a talent search">
          <Suspense fallback={<div className="hero__talent-animation" />}><TalentAnimation /></Suspense>
        </div>
      </div>
    </section>
  );
}
