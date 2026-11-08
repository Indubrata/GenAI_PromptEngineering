import { useEffect } from 'react';

const DESKTOP_MOTION = '(min-width: 769px) and (hover: hover) and (pointer: fine) and (not (any-pointer: coarse)) and (prefers-reduced-motion: no-preference)';

export default function useScrollReveal() {
  useEffect(() => {
    const media = window.matchMedia(DESKTOP_MOTION);
    const elements = [...document.querySelectorAll('.landing-page > section, .footer')];
    let observer;
    const configure = () => {
      observer?.disconnect();
      if (!media.matches) {
        elements.forEach(element => element.removeAttribute('data-scroll-reveal'));
        return;
      }
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.dataset.scrollReveal = 'visible';
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });
      elements.forEach(element => {
        // Never hide content already reached, including deep links and browser back.
        if (element.getBoundingClientRect().top < window.innerHeight - 40 || element.dataset.scrollReveal === 'visible') {
          element.dataset.scrollReveal = 'visible';
        } else {
          element.dataset.scrollReveal = 'pending';
          observer.observe(element);
        }
      });
    };
    configure();
    media.addEventListener('change', configure);
    return () => {
      observer?.disconnect();
      media.removeEventListener('change', configure);
      elements.forEach(element => element.removeAttribute('data-scroll-reveal'));
    };
  }, []);
}
