import './LineSidebar.css';
export default function LineSidebar({ items = [], activeIndex = 0, onItemClick }) {
  return <nav aria-label="Resume sections" className="resume-sections">
    {items.map((item, index) => <button key={item} type="button" aria-current={activeIndex === index ? 'true' : undefined} onClick={() => onItemClick(index)}>{item}</button>)}
  </nav>;
}
