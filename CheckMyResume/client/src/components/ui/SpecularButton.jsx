import './SpecularButton.css';
export default function SpecularButton({ children, size = 'lg', disabled = false, onClick, className = '', type = 'button' }) {
  return <button type={type} disabled={disabled} onClick={onClick} className={`specular-button specular-button--${size} ${className}`}>
    <span className="specular-button__label">{children}</span>
  </button>;
}
