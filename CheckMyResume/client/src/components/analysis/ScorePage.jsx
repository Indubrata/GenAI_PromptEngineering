import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import ScoreMeter from '../ui/ScoreMeter.jsx';
import './ScorePage.css';

export default function ScorePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  
  const [status, setStatus] = useState('connecting');
  const [message, setMessage] = useState('Connecting to analysis engine...');
  const [score, setScore] = useState(0);
  const [resumeData, setResumeData] = useState(null);
  const [error] = useState(null);

  useEffect(() => {
    const data = location.state?.data;
    if (!data) { navigate('/#upload', { replace: true }); return; }
    setResumeData(data);
    setScore(Number.isFinite(data.atsScore) ? Math.max(0, Math.min(100, data.atsScore)) : 0);
    setStatus('complete');
    setMessage('Analysis complete!');
  }, [location.state, navigate]);

  // Entrance animation for content once complete
  useEffect(() => {
    if (status === 'complete' && containerRef.current) {
      const animation = gsap.fromTo(containerRef.current.querySelector('.score-page__details'), 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.5, stagger: 0.2, ease: 'power3.out' }
      );
      return () => animation.kill();
    }
  }, [status]);

  if (status === 'error') {
    return (
      <div className="score-page score-page--error">
        <h1 className="score-page__title">Something went wrong</h1>
        <p className="score-page__error-msg">{error}</p>
        <button className="btn-primary" onClick={() => navigate('/')}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="score-page" ref={containerRef}>
      <div className="score-page__hero">
        <ScoreMeter score={score} isAnimating={status !== 'complete'} />
        <h1 className="score-page__title">
          {status === 'complete' ? 'Your ATS Score' : 'Analyzing Resume'}
        </h1>
        <p className="score-page__status-msg">{message}</p>
      </div>

      {status === 'complete' && resumeData && (
        <div className="score-page__details">
          <div className="score-card">
            <h3>AI Feedback Summary</h3>
            <p>
              {resumeData.feedback || "Your resume exhibits strong structure but could improve in quantifiable metrics."}
            </p>
          </div>

          <div className="score-card">
            <h3>Extracted Experience</h3>
            <ul>
              {resumeData.experience?.map((exp, idx) => (
                <li key={idx}>
                  <strong>{exp.role}</strong> at {exp.company}
                </li>
              ))}
            </ul>
          </div>

          <button 
            className="btn-primary score-page__action"
            onClick={() => navigate('/editor', { state: { resumeData, score } })}
          >
            Edit Resume to Improve Score
          </button>
        </div>
      )}
    </div>
  );
}
