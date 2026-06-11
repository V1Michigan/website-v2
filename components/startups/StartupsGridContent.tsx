import { LazyMotion, m, domAnimation } from "framer-motion";
import StartupCard from "../startup-card";

interface Company {
  name: string;
  domain: string;
  image: string;
  isComingSoon?: boolean;
}

interface StartupsGridContentProps {
  pageIndex: number;
  direction: number;
  companies: Company[];
}

export default function StartupsGridContent({
  pageIndex,
  direction,
  companies,
}: StartupsGridContentProps) {
  const containerVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="flex justify-center relative z-10">
      <div className="min-w-[28rem] px-3 sm:px-4 md:px-6 lg:px-8 mb-10">
        <div className="max-h-[75vh] overflow-hidden">
          <div className="relative">
            <LazyMotion features={domAnimation}>
              <m.div
                key={pageIndex}
                custom={direction}
                variants={containerVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="grid grid-cols-4 gap-4 mb-6"
              >
                {companies
                  .slice(0, 3 * 4)
                  .map((company) => (
                    <m.div key={company.name} variants={itemVariants}>
                      <StartupCard
                        image={company.image}
                        name={company.name}
                        domain={company.domain}
                      />
                    </m.div>
                  ))}
              </m.div>
            </LazyMotion>

            {/* Coming Soon Overlay for Fall 2025 */}
            {pageIndex === 1 && (
              <div className="absolute inset-x-0 top-0 flex justify-center pt-8 pointer-events-none z-10">
                <div className="bg-black/70 backdrop-blur-md rounded-2xl px-6 py-4 text-center border border-white/10">
                  <div className="text-xl sm:text-2xl font-instrument text-[#FEF9F5] mb-1">
                    Coming Soon
                  </div>
                  <div className="text-xs sm:text-sm font-inter text-[#CEC9C5]">
                    Amazing startups will be announced soon
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
