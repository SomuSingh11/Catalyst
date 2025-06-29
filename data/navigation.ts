
import {
    Binary,
    Bird,
    BirdIcon,
    BookOpen,
    Frame,
    LayoutDashboard,
    ShieldAlertIcon,
    Telescope,
    Tv,
    Wallet,
  } from "lucide-react";

  export const data = {
    user: {
      name: "k4ge",
      email: "k4ge@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        id: 1,
        name: "Catalyst",
        logo: Binary,
        plan: "Ordered Chaos - K4ge",
      },
    ],
    navMain: [
      {
        title: "GitWhiz",
        url: "#",
        icon: Bird,
        items: [
          {
            title: "Dashboard",
            url: "/gitwhiz/dashboard",
            icon:LayoutDashboard
          },
          {
            title: "Q&A",
            url: "/gitwhiz/qa",
            icon: ShieldAlertIcon
          },
          {
            title: "Meetings",
            url: "/gitwhiz/meetings",
            icon: Tv
          },
          {
            title: "Billings",
            url: "/gitwhiz/billings",
            icon: Wallet
          },
        ],
      },
      {
        title: "VidSage",
        url: "#",
        icon: Telescope,
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
      // {
      //   title: "Daily-Notes",
      //   url: "#",
      //   icon: Bot,
      //   items: [
      //     {
      //       title: "Today",
      //       url: "#",
      //     },
      //     {
      //       title: "Yesterday",
      //       url: "#",
      //     },
      //     {
      //       title: "01-01-2025",
      //       url: "#",
      //     },
      //   ],
      // },
      {
        title: "Algo Vault",
        url: "/tracker",
        icon: BookOpen,
        items: [
          {
            title: "Coming Soon..",
            url: "/algoVault/intro",
          },
          // {
          //   title: "LeetCode Top Interview 150",
          //   url: "/tracker/top-150",
          // },
          // {
          //   title: "Grokking Coding Interview Patterns",
          //   url: "/tracker/grokking-patterns",
          // },
          // {
          //   title: "Neetcode",
          //   url: "/tracker/neetcode",
          // },
          // {
          //   title: "Track Profile",
          //   url: "/tracker/track-profile",
          // },
          // {
          //   title: "Sean Prashad LeetCode Patterns",
          //   url: "/tracker/sean-prasad-patterns",
          // },
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
        name: "Create GitWhiz Project",
        url: "/gitwhiz/create",
        icon: BirdIcon,
      },
      // {
      //   name: "Roast My Resume",
      //   url: "#",
      //   icon: PieChart,
      // },
      // {
      //   name: "Kanban Todoist",
      //   url: "#",
      //   icon: Map,
      // },
    ],
  };