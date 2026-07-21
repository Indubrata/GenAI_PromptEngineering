import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isLanding = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    if (!isLanding) {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <nav className="navbar__inner container" aria-label="Main navigation">
        <button className="navbar__logo" onClick={() => navigate('/')}>
          <Icon icon="ph:sparkle-bold" width="24" height="24" className="navbar__logo-icon" />
          <span className="navbar__logo-text">CheckMyResume</span>
        </button>

        {isLanding && (
          <ul className={`navbar__links ${mobileOpen ? 'navbar__links--open' : ''}`}>
            <li><button onClick={() => scrollToSection('features')}>Features</button></li>
            <li><button onClick={() => scrollToSection('story')}>Story</button></li>
            <li><button onClick={() => scrollToSection('reviews')}>Reviews</button></li>
            <li><button onClick={() => scrollToSection('faq')}>FAQ</button></li>
          </ul>
        )}

        <div className="navbar__actions">
          <ThemeToggle />
          <button
            className="navbar__mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <Icon icon={mobileOpen ? 'ph:x-bold' : 'ph:list-bold'} width="24" height="24" />
          </button>
        </div>
      </nav>
    </header>
  );
}
