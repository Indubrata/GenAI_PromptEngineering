import { useNavigate } from 'react-router-dom';
import SpecularButton from '../ui/SpecularButton';
import './CTASection.css';

export default function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="cta-section container">
      <div className="cta__banner glass hover-glow">
        <div className="cta__content">
          <h2 className="cta__title">Stop guessing. Start matching.</h2>
          <p className="cta__subtitle">
            The job market is too competitive to leave your resume to chance. 
            Get past the ATS filters and in front of the hiring manager in seconds.
          </p>
          <div className="cta__actions">
            <SpecularButton size="lg" onClick={() => {
              document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Analyze My Resume Now
            </SpecularButton>
            <p className="cta__guarantee">No credit card required. 100% free analysis.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
