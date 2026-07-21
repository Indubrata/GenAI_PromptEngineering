import { useEffect } from 'react';
import useScrollReveal from '../../hooks/useScrollReveal';
import HeroSection from './HeroSection';
import UploadSection from './UploadSection';
import StorySection from './StorySection';
import FeaturesSection from './FeaturesSection';
import ReviewsSection from './ReviewsSection';
import CTASection from './CTASection';
import FAQSection from './FAQSection';
import './LandingPage.css';

export default function LandingPage() {
  useScrollReveal();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="landing-page">
      <HeroSection />
      <UploadSection />
      <StorySection />
      <FeaturesSection />
      <ReviewsSection />
      <CTASection />
      <FAQSection />
    </main>
  );
}
