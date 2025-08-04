import FAQItem from "./faq-item"

interface FAQSectionProps {
  questions: string[]
}

export default function FAQSection({ questions }: FAQSectionProps) {
  return (
    <div className="px-6 py-4">
      <h2 className="text-xl font-medium text-gray-900 mb-6 text-center">Questions? We got you.</h2>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <FAQItem key={index} question={question} />
        ))}
      </div>
    </div>
  )
}
