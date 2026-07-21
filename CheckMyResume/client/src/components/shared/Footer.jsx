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
              <li><a href="#features">Features</a></li>
              <li><a href="#story">Our Story</a></li>
              <li><a href="#pricing">Pricing</a></li>
            </ul>
          </div>
          <div className="footer__column">
            <h4>Resources</h4>
            <ul>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            &copy; {year} CheckMyResume. All rights reserved.
          </p>
          <div className="footer__socials">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Icon icon="ph:github-logo-bold" width="20" height="20" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
