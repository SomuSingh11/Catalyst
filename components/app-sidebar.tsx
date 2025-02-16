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
      id: 1,
      name: "Catalyst",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      id: 2,
      name: "Catalyst",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      id: 3,
      name: "Catalyst",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
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
          title: "All Questions",
          url: "/tracker/all-questions",
        },
        {
          title: "LeetCode Top Interview 150",
          url: "/tracker/top-150",
        },
        {
          title: "Grokking Coding Interview Patterns",
          url: "/tracker/grokking-patterns",
        },
        {
          title: "Neetcode",
          url: "/tracker/neetcode",
        },
        {
          title: "Track Profile",
          url: "/tracker/track-profile",
        },
        {
          title: "Sean Prashad LeetCode Patterns",
          url: "/tracker/sean-prasad-patterns",
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

export function AppSidebar({
  profile,
  ...props
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
{ profile: any } & React.ComponentProps<typeof Sidebar>) {
  const { signOut } = useClerk();

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
        <NavUser user={profile} signOut={signOut} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
