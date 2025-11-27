import Image from "next/image";
import React from "react";

interface TechStackItem {
  name: string;
  icon: string;
}

interface LandingTechStackProps {
  title: string;
  subtitle?: string;
  description: string;
  techStack?: TechStackItem[];
}

export default function LandingTechStack({
  title,
  subtitle,
  description,
  techStack = [],
}: LandingTechStackProps) {
  const duplicatedTechStack = [...techStack, ...techStack];

  return (
    <section
      id="technology"
      className="py-16 lg:py-24 bg-[#FFFDF8] text-gray-900 flex items-center justify-center overflow-hidden"
    >
      <div className="w-full lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-2">
        <h2 className="text-4xl lg:text-5xl font-semibold mb-4 leading-tight font-display">
          {title}
          {subtitle && (
            <>
              <br />
              <span className="text-gray-500 font-thin">{subtitle}</span>
            </>
          )}
        </h2>
        <p className="lg:text-xl text-gray-600/60 mb-16 max-w-3xl mx-auto leading-relaxed ">
          {description}
        </p>

        {techStack.length > 0 && (
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#FFFDF8] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#FFFDF8] to-transparent z-10 pointer-events-none"></div>

            {/* Scrolling container */}
            <div className="overflow-hidden">
              <div className="inline-flex animate-scroll hover:pause">
                {duplicatedTechStack.map((tech, index) => (
                  <div
                    key={`${tech.name}-${index}`}
                    className="flex items-center gap-3 bg-white text-gray-800 px-6 py-4 mx-3 rounded-xl text-base font-medium shadow-sm hover:shadow-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 whitespace-nowrap group"
                  >
                    <Image
                      src={tech.icon}
                      alt={tech.name}
                      width={20}
                      height={20}
                      className="w-6 h-6 object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                    <span className="text-gray-800 pr-2">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
