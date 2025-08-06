'use client'

import { Plus, Minus } from 'lucide-react'

interface FAQItemProps {
  question: string;
  answer: string;
  isExpanded?: boolean;
  onToggle: () => void;
}

export default function FAQItem({ question, answer, isExpanded = false, onToggle }: FAQItemProps) {
  return (
    <div className="border border-gray-200 rounded-lg mb-3 bg-white">
      <button
        className="flex items-center justify-between w-full text-left p-4 hover:bg-gray-50 transition-colors duration-200"
        onClick={onToggle}
      >
        <span className="text-sm text-[#444444] pr-4 font-medium">{question}</span>
        <div className="flex-shrink-0">
          {isExpanded ? (
            <Minus className="w-4 h-4 text-gray-600 transition-transform duration-200" />
          ) : (
            <Plus className="w-4 h-4 text-gray-600 transition-transform duration-200" />
          )}
        </div>
      </button>

      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-4 pb-4 pt-0">
          <div className="text-sm text-gray-600 leading-relaxed">
            {answer}
          </div>
        </div>
      </div>
    </div>
  )
}
