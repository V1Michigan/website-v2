import Image from "next/image";

interface EventCardProps {
  title: string;
  description: string;
  image: string;
}

export default function EventCard({
  title,
  description,
  image,
}: EventCardProps) {
  return (
    <div className="flex flex-col gap-3 p-4 md:p-6 border border-gray-200 rounded-lg bg-white h-full">
      <div className="flex-shrink-0 w-full">
        <div className="relative aspect-[16/9] md:aspect-[4/3] w-full">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="rounded-md object-cover"
          />
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <h3 className="text-lg md:text-xl font-medium font-instrument text-[#444] mb-2 md:mb-3">
          {title}
        </h3>
        <p className="text-sm font-inter text-[#444] leading-relaxed flex-1">
          {description}
        </p>
      </div>
    </div>
  );
}
