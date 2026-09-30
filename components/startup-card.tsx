interface StartupCardProps {
  image: string;
  name: string;
  domain: string;
  website: string;
}

export default function StartupCard({ image, name, domain, website }: StartupCardProps) {
  return (
    <a
      href={website}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${name} website (opens in a new tab)`}
      className="block bg-white/10 rounded-xl p-3 md:p-4 text-center w-full min-h-32 md:min-h-40 hover:bg-white/20 focus-visible:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E5AC61] motion-safe:transition-colors"
    >
      <div className={`w-12 h-12 md:w-20 md:h-20 rounded-lg overflow-hidden mb-2 mt-2 lg:mt-0 md:mb-3 mx-auto flex items-center justify-center ${name === "Forus" ? "bg-white" : ""}`}>
        {image ? (
          <img
            src={image}
            alt={`${name} logo`}
            className={`w-full h-full object-contain ${name === "Forus" ? "p-1" : ""}`}
          />
        ) : (
          <div className="w-full h-full bg-gray-400 rounded-lg"></div>
        )}
      </div>
      <div className="text-[11px] md:text-xs font-medium font-inter text-[#FEF9F5] mb-1 leading-tight">
        {name}
      </div>
      <div className="text-[9px] md:text-[10px] font-medium font-inter text-[#CEC9C5] leading-tight">
        {domain}
      </div>
    </a>
  );
}
