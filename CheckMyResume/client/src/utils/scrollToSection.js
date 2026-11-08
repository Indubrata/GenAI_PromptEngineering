// Align visible content below the fixed navigation, excluding section padding.
export function scrollToSection(id) {
  const section = document.getElementById(id);
  if (!section) return;
  const target = id === 'features' ? section.querySelector('.features__header') || section : section;
  const nav = document.querySelector('.navbar');
  const clearance = Math.max(88, (nav?.getBoundingClientRect().bottom || 72) + 16);
  const top = window.scrollY + target.getBoundingClientRect().top - clearance;
  window.scrollTo({
    top: Math.max(0, top),
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
  });
}
