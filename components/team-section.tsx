import TeamMember from "./team-member";

interface TeamMemberData {
  image: string;
  name: string;
  linkedinUrl: string;
}

interface TeamSectionProps {
  teamMembers: TeamMemberData[];
  attribution?: string;
}

export default function TeamSection({ teamMembers }: TeamSectionProps) {
  return (
    <div className="px-6 py-8">
      <h2 className="text-3xl font-bold font-instrument text-[#444] mb-6 text-center">
        Our Team
      </h2>
      <div className="flex justify-center -space-x-3 mb-4">
        {teamMembers.map((member, index) => (
          <TeamMember
            key={index}
            image={member.image}
            name={member.name}
            linkedinUrl={member.linkedinUrl}
            index={index}
          />
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
  );
}
