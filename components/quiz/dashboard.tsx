import { CalendarIcon } from "@radix-ui/react-icons";
import { Activity, BrainCircuitIcon, Coffee } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import HotTopicsCloud from "@/components/quiz/components/hot-topic-cloud";
import AnimatedList from "@/components/quiz/components/animated-list-demo";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { Marquee } from "@/components/magicui/marquee";

const files = [
  {
    name: "quizzy",
    body: "Quizzfyyy: Your ultimate AI-driven quiz companion, ready to challenge your knowledge across countless topics!",
  },
  {
    name: "questions",
    body: "A vast collection of thought-provoking questions, designed to test your brainpower and keep you on your toes!",
  },
  {
    name: "types",
    body: "From rapid-fire rounds to deep-dive trivia, Quizzfyyy offers multiple quiz formats to match your style!",
  },
  {
    name: "ai-driven",
    body: "Powered by cutting-edge AI, Quizzfyyy adapts to your skill level and keeps every quiz exciting and unpredictable!",
  },
  {
    name: "history",
    body: "Did you know? Quizzfyyy has tested minds across centuries! (Okay, maybe not that long, but history quizzes are 🔥).",
  },
];

const features = [
  {
    Icon: BrainCircuitIcon,
    name: "Brain Gym Time!",
    description: "Flex those mental muscles with Quizzy.",
    href: "/quizzy/quiz",
    cta: "Start a Quiz",
    className: "col-span-3 lg:col-span-1",
    background: (
      <Marquee
        pauseOnHover
        className="absolute top-10 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] "
      >
        {files.map((f, idx) => (
          <figure
            key={idx}
            className={cn(
              "relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4",
              "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
              "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
              "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none"
            )}
          >
            <div className="flex flex-row items-center gap-2">
              <div className="flex flex-col">
                <figcaption className="text-sm font-medium dark:text-white ">
                  {f.name}
                </figcaption>
              </div>
            </div>
            <blockquote className="mt-2 text-xs">{f.body}</blockquote>
          </figure>
        ))}
      </Marquee>
    ),
  },
  {
    Icon: Activity,
    name: "Recent Activity",
    description: "You have played a total of 43 quizzes.",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-2",
    background: (
      <AnimatedList className="absolute right-2 top-4 h-[300px] w-full scale-75 border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-90" />
    ),
  },
  {
    Icon: Coffee,
    name: "Hot Topics",
    description: "Topics you don't wanna miss.",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-2",
    background: (
      <HotTopicsCloud className="absolute right-0 top-4 h-[300px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_0%,#000_100%)] group-hover:scale-105" />
    ),
  },
  {
    Icon: CalendarIcon,
    name: "Calendar",
    description: "Use the calendar to filter your files by date.",
    className: "col-span-3 lg:col-span-1",
    href: "#",
    cta: "Learn more",
    background: (
      <Calendar
        mode="single"
        selected={new Date(2022, 4, 11, 0, 0, 0)}
        className="absolute right-0 top-10 origin-top scale-75 rounded-md border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:scale-90"
      />
    ),
  },
];

export function BentoDemo() {
  return (
    <BentoGrid>
      {features.map((feature, idx) => (
        <BentoCard key={idx} {...feature} />
      ))}
    </BentoGrid>
  );
}
