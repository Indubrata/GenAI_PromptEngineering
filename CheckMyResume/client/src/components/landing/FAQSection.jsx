import { useState } from 'react';
import { Icon } from '@iconify/react';
import './FAQSection.css';

const FAQS = [
  {
    question: "How does the ATS scoring work?",
    answer: "We use a dual-failover LLM architecture to parse your resume exactly like enterprise Applicant Tracking Systems do. It analyzes keyword density, semantic relevance to the job description, and formatting structure to generate a score out of 100."
  },
  {
    question: "Will my data be used to train AI?",
    answer: "Your resume is sent to our AI provider for analysis. Processing jobs and results are kept temporarily in the queue and scheduled for cleanup after one hour. Avoid including sensitive information that is not needed for your application."
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
  const toggleAccordion = (index) => setOpenIndex(current => current === index ? -1 : index);

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
          >
            <button className="faq__question" onClick={() => toggleAccordion(i)} aria-expanded={openIndex === i} aria-controls={`faq-answer-${i}`}>
              <h3>{faq.question}</h3>
              <div className="faq__icon">
                <Icon icon="ph:caret-down-bold" />
              </div>
            </button>
            <div 
              className="faq__answer-wrapper" 
              id={`faq-answer-${i}`}
              aria-hidden={openIndex !== i}
              inert={openIndex !== i ? true : undefined}
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
