"use client"

import { Plus } from "lucide-react"

interface FAQItemProps {
  question: string
  isExpanded?: boolean
  onToggle?: () => void
}

export default function FAQItem({ question, isExpanded = false, onToggle }: FAQItemProps) {
  return (
    <div className="border-b border-gray-200 pb-4">
      <button className="flex items-center justify-between w-full text-left" onClick={onToggle}>
        <span className="text-sm text-gray-700 pr-4">{question}</span>
        <Plus className="w-4 h-4 text-gray-400 flex-shrink-0" />
      </button>
    </div>
  )
}
