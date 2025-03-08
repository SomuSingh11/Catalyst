"use client";

import { cn } from "@/lib/utils";
import { AnimatedList } from "@/components/magicui/animated-list";

interface Item {
  name: string;
  description: string;
  icon: string;
  color: string;
  time: string;
}

let notifications = [
  {
    name: "Payment received",
    description: "Magic UI",
    time: "15m ago",

    icon: "💸",
    color: "#00C9A7",
  },
  {
    name: "User signed up",
    description: "Magic UI",
    time: "10m ago",
    icon: "👤",
    color: "#FFB800",
  },
  {
    name: "New message",
    description: "Magic UI",
    time: "5m ago",
    icon: "💬",
    color: "#FF3D71",
  },
  {
    name: "New event",
    description: "Magic UI",
    time: "2m ago",
    icon: "🗞️",
    color: "#1E86FF",
  },
];

notifications = Array.from({ length: 10 }, () => notifications).flat();

const Notification = ({ name, description, icon, color, time }: Item) => {
  return (
    <figure
      className={cn(
        "relative mx-auto h-[80px] w-full max-w-[600px] cursor-pointer overflow-hidden rounded-2xl p-4",
        // animation styles
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        // light styles
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles
        "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
      )}
    >
      <div className="flex flex-row items-center gap-6 h-full">
        <div
          className="flex size-12 shrink-0 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: color,
          }}
        >
          <span className="text-xl">{icon}</span>
        </div>
        <div className="flex flex-col justify-center min-w-0">
          <figcaption className="flex flex-row items-center text-lg font-medium dark:text-white">
            <span className="text-sm sm:text-lg truncate">{name}</span>
            <span className="mx-2 shrink-0">·</span>
            <span className="text-xs text-gray-500 shrink-0">{time}</span>
          </figcaption>
          <p className="text-sm font-normal dark:text-white/60 truncate">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
};

interface HistoryItem {
  topic: string;
  gameType: 'mcq' | 'open_ended';
  timeStarted: Date;
  accuracy?: number;
}

export default function AnimatedListDemo({
  className,
  items,
}: {
  className?: string;
  items?: HistoryItem[];
}) {
  const historyNotifications = items?.map(item => ({
    name: item.topic,
    description: `${item.gameType === 'mcq' ? 'Multiple Choice' : 'Open Ended'} Quiz`,
    time: new Date(item.timeStarted).toLocaleString(),
    icon: item.gameType === 'mcq' ? "📝" : "✍️",
    color: (item.accuracy ?? 0) >= 75 ? "#1a1a1a" :
           (item.accuracy ?? 0) >= 40 ? "#404040" : "#666666",
  })) || notifications;

  return (
    <div className={cn(
      "relative flex h-[500px] w-full flex-col overflow-hidden p-2",
      className
    )}>
      <AnimatedList>
        {historyNotifications.reverse().map((item, idx) => (
          <Notification {...item} key={idx} />
        ))}
      </AnimatedList>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
    </div>
  );
}
