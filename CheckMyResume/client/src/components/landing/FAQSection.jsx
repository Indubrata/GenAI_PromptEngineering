import { useState, useRef } from 'react';
import { Icon } from '@iconify/react';
import gsap from 'gsap';
import './FAQSection.css';

const FAQS = [
  {
    question: "How does the ATS scoring work?",
    answer: "We use a dual-failover LLM architecture to parse your resume exactly like enterprise Applicant Tracking Systems do. It analyzes keyword density, semantic relevance to the job description, and formatting structure to generate a score out of 100."
  },
  {
    question: "Will my data be used to train AI?",
    answer: "No. We prioritize your privacy. Your resume data is processed in memory during the session and is never stored permanently or used to train any foundational models."
  },
  {
    question: "Is the generated resume ATS-friendly?",
    answer: "Yes! While some builders use complex HTML or image-based layouts that confuse parsers, our exports are specifically engineered to output clean, perfectly readable text layers in PDF format."
  },
  {
    question: "Can I use this without a specific job description?",
    answer: "Absolutely. If you don't provide a target job description, we analyze your resume against industry-standard benchmarks for your target role to ensure you have the baseline keywords needed."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0); // First one open by default
  const contentRefs = useRef([]);

  const toggleAccordion = (index) => {
    if (openIndex === index) {
      // Close the currently open one
      gsap.to(contentRefs.current[index], { height: 0, opacity: 0, duration: 0.3, ease: 'power2.out' });
      setOpenIndex(-1);
    } else {
      // Close previously open
      if (openIndex !== -1) {
        gsap.to(contentRefs.current[openIndex], { height: 0, opacity: 0, duration: 0.3, ease: 'power2.out' });
      }
      // Open new one
      setOpenIndex(index);
      gsap.fromTo(contentRefs.current[index], 
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
  };

  return (
    <section id="faq" className="faq-section container">
      <div className="faq__header">
        <h2 className="faq__title">Frequently Asked Questions</h2>
      </div>

      <div className="faq__list">
        {FAQS.map((faq, i) => (
          <div 
            key={i} 
            className={`faq__item ${openIndex === i ? 'faq__item--open' : ''}`}
            onClick={() => toggleAccordion(i)}
          >
            <div className="faq__question">
              <h3>{faq.question}</h3>
              <div className="faq__icon">
                <Icon icon="ph:caret-down-bold" />
              </div>
            </div>
            <div 
              className="faq__answer-wrapper" 
              ref={el => contentRefs.current[i] = el}
              style={{ height: i === 0 ? 'auto' : 0, opacity: i === 0 ? 1 : 0, overflow: 'hidden' }}
            >
              <div className="faq__answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
