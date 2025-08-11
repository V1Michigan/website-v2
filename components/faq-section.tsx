"use client";

import { useState } from "react";
import FAQItem from "./faq-item";

const faqData = [
  {
    question: "When and where is this?",
    answer:
      "Startup Week takes place over 5 days in Ann Arbor from September 29 - October 3. Expect a combination of virtual and in-person events!",
  },
  {
    question: "What will I need to do?",
    answer:
      "Apply to Startup Week, attend select events, and explore career opportunities within startups!",
  },
  {
    question: "What if I already have a job for the summer?",
    answer:
      "That's great! You can still participate in Startup Week events and network with other professionals. Many of our sessions are designed to be educational in nature and help you grow in whatever way.",
  },
  {
    question: "Who is this designed for?",
    answer:
      "Startup Week is designed for UMich Students interested in the startup ecosystem. Whether you're a developer, designer, product manager, or business professional, you'll find relevant content and networking opportunities.",
  }, //UPDATE
  {
    question: "What is V1?",
    answer:
      "V1 is the community for ambitious student builders — engineers, artists, designers, founders, scientists, and more. Our goal is to support ambitious, curious, and dirven students to do their best work.",
  },
  {
    question: "Can my company recruit at Startup Fair?",
    answer:
      "Yes! We welcome startups and growing companies to participate as recruiters. Please reach out to v1startupweek@umich.edu.",
  },
  {
    question: "Got another question?",
    answer:
      "We'd love to help! Reach out to us at v1startupweek@umich.edu.",
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
