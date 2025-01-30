"use client";

import * as React from "react";
import { useClerk } from "@clerk/nextjs";

import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "k4ge",
    email: "k4ge@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Catalyst",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Catalyst",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Catalyst",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Daily-Notes",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Today",
          url: "#",
        },
        {
          title: "Yesterday",
          url: "#",
        },
        {
          title: "01-01-2025",
          url: "#",
        },
      ],
    },
    {
      title: "LeetCode Tracker",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Quizzy",
      url: "/quizzy",
      icon: Frame,
    },
    {
      name: "Roast My Resume",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Kanban Todoist",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { signOut } = useClerk();
  // const { user } = useUser();
  // if (!user) return null;

  // const userData = {
  //   name: user.username || "Guest",
  //   email: user.emailAddresses[0]?.emailAddress || "No email",
  //   avatar: user.imageUrl || "/default-avatar.jpg",
  // };

  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} signOut={signOut} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
