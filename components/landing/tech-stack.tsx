import Image from "next/image";

interface TechStackItem {
  name: string;
  icon: string;
}

interface LandingSectionProps {
  title: string;
  subtitle?: string;
  description: string;
  techStack?: TechStackItem[];
}

export default function LandingSection({
  title,
  subtitle,
  description,
  techStack = [],
}: LandingSectionProps) {
  return (
    <section className="min-h-screen py-20 lg:py-32 bg-black text-white flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl lg:text-6xl font-bold mb-6">
          {title}
          {subtitle && (
            <>
              <br />
              <span className="text-gray-400">{subtitle}</span>
            </>
          )}
        </h2>
        <p className="text-lg lg:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
          {description}
        </p>

        {techStack.length > 0 && (
          <div className="flex flex-wrap justify-center items-center gap-4 mt-10">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-sm font-medium"
              >
                <Image
                  src={tech.icon}
                  alt={tech.name}
                  width={20}
                  height={20}
                />
                {tech.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
