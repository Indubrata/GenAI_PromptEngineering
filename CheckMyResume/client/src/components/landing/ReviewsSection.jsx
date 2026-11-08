import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import './ReviewsSection.css';

const REVIEWS = [
  { name: 'Sarah J.', role: 'Product Designer', text: 'CheckMyResume caught 5 keywords I missed. Landed an interview at Figma 3 days later.' },
  { name: 'Michael T.', role: 'Senior Engineer', text: 'The ATS formatting alone is worth it. It completely bypassed the Workday filter that was rejecting me.' },
  { name: 'Elena R.', role: 'Marketing Lead', text: 'The AI rewriting sounds more like me than I do. It perfectly captured my strategic impact.' },
  { name: 'David K.', role: 'Data Scientist', text: 'Finally, a tool that actually understands technical jargon and maps it to recruiter expectations.' },
  { name: 'Priya M.', role: 'Frontend Developer', text: 'Went from 0 callbacks to 3 interviews in a week. The live preview editor is magic.' },
];

export default function ReviewsSection() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const timer = setInterval(() => {
      if (!document.hidden && !motion.matches) setActive(current => (current + 1) % REVIEWS.length);
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="reviews" className="reviews-section" aria-label="Customer reviews">
      <div className="container reviews__header">
        <h2 className="reviews__title">What people are saying.</h2>
        <p className="reviews__subtitle">Feedback shared through our feedback form.</p>
      </div>
      <div className="reviews__stage">
        {REVIEWS.map((review, index) => {
          const offset = (index - active + REVIEWS.length) % REVIEWS.length;
          const position = offset === 0 ? 'center' : offset === 1 ? 'right' : offset === REVIEWS.length - 1 ? 'left' : 'hidden';
          return (
            <article key={review.name} className={`review-card review-card--${position}`} aria-hidden={position !== 'center'}>
              <div className="review-card__avatar">{review.name.charAt(0)}</div>
              <div className="review-card__rating" aria-label="5 out of 5 stars">
                {[0, 1, 2, 3, 4].map(star => <Icon key={star} icon="ph:star-fill" aria-hidden="true" />)}
              </div>
              <p className="review-card__text">“{review.text}”</p>
              <div><h3 className="review-card__name">{review.name}</h3><p className="review-card__role">{review.role}</p></div>
            </article>
          );
        })}
      </div>

    </section>
  );
}
