interface StartupCardProps {
  image: string;
  name: string;
  domain: string;
}

export default function StartupCard({ image, name, domain }: StartupCardProps) {
  return (
    <div className="bg-white/10 rounded-xl p-3 md:p-4 text-center w-full h-32 md:h-40">
      <div className="w-12 h-12 md:w-20 md:h-20 rounded-lg overflow-hidden mb-2 mt-2 lg:mt-0 md:mb-3 mx-auto flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt={`${name} logo`}
            className="w-full h-full object-contain"
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
    </div>
  );
}
