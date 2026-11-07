
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



  return (
    <div className="landing-page">
      <HeroSection />
      <UploadSection />
      <StorySection />
      <FeaturesSection />
      <ReviewsSection />
      <CTASection />
      <FAQSection />
    </div>
  );
}
