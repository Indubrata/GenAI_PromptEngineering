import { useTheme } from '../../context/ThemeContext';
import { Icon } from '@iconify/react';
import './ThemeToggle.css';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span className={`theme-toggle__icon ${theme === 'light' ? 'theme-toggle__icon--active' : ''}`}>
        <Icon icon="ph:sun-bold" width="20" height="20" />
      </span>
      <span className={`theme-toggle__icon ${theme === 'dark' ? 'theme-toggle__icon--active' : ''}`}>
        <Icon icon="ph:moon-bold" width="20" height="20" />
      </span>
    </button>
  );
}
