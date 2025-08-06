import TeamMember from "./team-member"

interface TeamSectionProps {
  teamMembers: string[]
  attribution?: string
}

export default function TeamSection({
  teamMembers
}: TeamSectionProps) {
  return (
    <div className="px-6 py-8">
      <div className="flex justify-center space-x-2 mb-4">
        {teamMembers.map((member, index) => (
          <TeamMember key={index} image={member} index={index} />
        ))}
      </div>

      {/* <div className="text-center">
        <div className="flex justify-center space-x-4">
          <div className="w-5 h-5 bg-gray-300 rounded"></div>
          <div className="w-5 h-5 bg-gray-300 rounded"></div>
          <div className="w-5 h-5 bg-gray-300 rounded"></div>
        </div>
      </div> */}
    </div>
  )
}
