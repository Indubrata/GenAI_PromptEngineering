import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <div className="footer__logo">
            <Icon icon="ph:sparkle-bold" width="24" height="24" className="footer__logo-icon" />
            <span className="footer__logo-text">CheckMyResume</span>
          </div>
          <p className="footer__tagline">
            Your Resume. Reimagined by AI.
          </p>
        </div>

        <div className="footer__links-grid">
          <div className="footer__column">
            <h4>Product</h4>
            <ul>
              <li><Link to="/#features">Features</Link></li>
              <li><Link to="/#story">Our Story</Link></li>
              <li><Link to="/#upload">Analyze Resume</Link></li>
            </ul>
          </div>
          <div className="footer__column">
            <h4>Resources</h4>
            <ul>
              <li><Link to="/#faq">FAQ</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            &copy; {year} CheckMyResume. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  );
}
