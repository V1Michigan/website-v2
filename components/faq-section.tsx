"use client";

import { useState } from "react";
import FAQItem from "./faq-item";

const faqData = [
  {
    question: "What if I already have a job for the summer?",
    answer:
      "That's great! You can still participate in Startup Week events and network with other professionals. Many of our sessions are designed to help you grow in your current role and make valuable connections for the future.",
  },
  {
    question: "When and where is this?",
    answer:
      "Startup Week takes place over 5 days in Ann Arbor from September 29 - October 3. Expect a combination of virtual and in-person events!",
  },
  {
    question: "Who is this designed for?",
    answer:
      "Startup Week is designed for UMich Students and anyone interested in the startup ecosystem. Whether you're a developer, designer, product manager, or business professional, you'll find relevant content and networking opportunities.",
  }, //UPDATE
  {
    question: "What is V1?",
    answer:
      "V1 is the community for ambitious student builders — engineers, artists, designers, founders, scientists, and more. We provide the most driven students with an extraordinary network, exclusive opportunities within startups, and mentorship to grow and achieve great things.",
  },
  {
    question: "How do I prepare?",
    answer:
      "Come with an open mind and your resume updated! We recommend researching the participating companies, preparing your elevator pitch, and thinking about what type of role or company culture interests you most. Dress code is business casual.",
  },
  {
    question: "Can my company recruit at Startup Fair?",
    answer:
      "Yes! We welcome startups and growing companies to participate as recruiters. Please reach out to our partnerships team for information about sponsorship packages and recruiting opportunities. Space is limited and allocated on a first-come, first-served basis.",
  },
  {
    question: "Got another question?",
    answer:
      "We'd love to help! Reach out to us at team@v1michigan.com or follow us on social media for the latest updates.",
  },
];

export default function FAQSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold font-instrument text-[#444] mb-6 text-center">
        Questions? We Got You.
      </h2>
      <div className="space-y-3">
        {faqData.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            isExpanded={expandedIndex === index}
            onToggle={() => toggleItem(index)}
          />
        ))}
      </div>
    </div>
  );
}
