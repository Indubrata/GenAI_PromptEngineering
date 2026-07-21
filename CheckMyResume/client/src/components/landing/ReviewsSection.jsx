import { useEffect, useRef } from 'react';
import gsap from 'gsap';
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
  const marqueeRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Continuous scroll marquee animation
    const marquee = marqueeRef.current;
    if (marquee) {
      // Clone the content for seamless loop
      const content = marquee.innerHTML;
      marquee.innerHTML = content + content;
      
      gsap.to(marquee, {
        xPercent: -50,
        ease: 'none',
        duration: 20,
        repeat: -1
      });
    }
  }, []);

  return (
    <section id="reviews" className="reviews-section">
      <div className="container reviews__header">
        <h2 className="reviews__title">Don't just take our word for it.</h2>
        <p className="reviews__subtitle">Join thousands of professionals who beat the algorithm and landed their dream roles.</p>
      </div>

      <div className="reviews__marquee-container">
        <div className="reviews__marquee" ref={marqueeRef}>
          {REVIEWS.map((review, i) => (
            <div key={i} className="review-card glass hover-glow">
              <div className="review-card__header">
                <div className="review-card__avatar">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="review-card__name">{review.name}</h4>
                  <p className="review-card__role">{review.role}</p>
                </div>
                <div className="review-card__rating">
                  <Icon icon="ph:star-fill" color="var(--accent-gold)" />
                  <Icon icon="ph:star-fill" color="var(--accent-gold)" />
                  <Icon icon="ph:star-fill" color="var(--accent-gold)" />
                  <Icon icon="ph:star-fill" color="var(--accent-gold)" />
                  <Icon icon="ph:star-fill" color="var(--accent-gold)" />
                </div>
              </div>
              <p className="review-card__text">"{review.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
