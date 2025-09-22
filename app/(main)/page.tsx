"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Database,
  Layers,
  Lock,
  Sparkles,
  Code2,
  Palette,
  Bot,
  FileCode2,
  Users,
  Zap,
  Brain,
  CheckCircle,
  BarChart3,
  Star,
  Bird,
} from "lucide-react";
import Link from "next/link";

export default function Page() {
  const [activeApp, setActiveApp] = useState(0);

  const applications = [
    {
      id: "gitwhiz",
      title: "GitWhiz",
      subtitle: "Github Repository Intelligence",
      description:
        "Comprehensive GitHub analytics platform providing deep insights into repositories, contributions, and development patterns with AI commit summaries, repository insights, and project dashboards.",
      icon: <Bird className="w-6 h-6" />,
      status: "Fully Functional",
      statusType: "success",
      route: "/gitwhiz",
      benefits: [
        "Real-time GitHub data sync",
        "Advanced analytics & insights",
        "AI-generated commit summaries",
        "Works with any public or private repo",
        "Ask AI questions about your codebase",
        "AI-powered project & file-level insights",
      ],
      techStack: [
        {
          name: "Next.js",
          icon: <Layers className="w-6 h-6 text-black" />,
          description: "React Framework",
        },
        {
          name: "Tailwind CSS",
          icon: <Palette className="w-6 h-6 text-cyan-500" />,
          description: "Utility-first CSS Framework",
        },
        {
          name: "Clerk",
          icon: <Lock className="w-6 h-6 text-purple-500" />,
          description: "Authentication & User Management",
        },
        {
          name: "React Query",
          icon: <Sparkles className="w-6 h-6 text-yellow-500" />,
          description: "Data Synchronization",
        },
        {
          name: "TypeScript",
          icon: <FileCode2 className="w-6 h-6 text-blue-600" />,
          description: "Typed JavaScript",
        },
        {
          name: "tRPC",
          icon: <Code2 className="w-6 h-6 text-pink-500" />,
          description: "End-to-End Typesafe API",
        },
        {
          name: "Vercel",
          icon: <Zap className="w-6 h-6 text-black" />,
          description: "Deployment Platform",
        },
        {
          name: "Prisma",
          icon: <Code2 className="w-6 h-6 text-indigo-500" />,
          description: "ORM for TypeScript",
        },
        {
          name: "Neon DB",
          icon: <Database className="w-6 h-6 text-blue-500" />,
          description: "Serverless Postgres Database",
        },
        {
          name: "Gemini AI",
          icon: <Bot className="w-6 h-6 text-green-500" />,
          description: "AI Language Model",
        },
      ],
    },
    {
      id: "quizzy",
      title: "Quizzy",
      subtitle: "AI-Powered Quiz Platform",
      description:
        "Test and improve your knowledge across various topics with AI-generated questions, track your progress, and challenge yourself with both multiple-choice and open-ended questions.",
      icon: <Brain className="w-6 h-6" />,
      status: "Under Construction",
      statusType: "warning",
      route: "/quizzy",
      benefits: [
        "AI-generated custom quizzes",
        "Multiple question formats",
        "Adaptive difficulty levels",
        "Detailed reports: correct, incorrect, explanations",
      ],
      techStack: [
        {
          name: "Next.js",
          icon: <Layers className="w-6 h-6 text-black" />,
          description: "React Framework",
        },
        {
          name: "Tailwind CSS",
          icon: <Palette className="w-6 h-6 text-cyan-500" />,
          description: "Utility-first CSS Framework",
        },
        {
          name: "Clerk",
          icon: <Lock className="w-6 h-6 text-purple-500" />,
          description: "Authentication & User Management",
        },
        {
          name: "React Query",
          icon: <Sparkles className="w-6 h-6 text-yellow-500" />,
          description: "Data Synchronization",
        },
        {
          name: "TypeScript",
          icon: <FileCode2 className="w-6 h-6 text-blue-600" />,
          description: "Typed JavaScript",
        },
        {
          name: "Vercel",
          icon: <Zap className="w-6 h-6 text-black" />,
          description: "Deployment Platform",
        },
        {
          name: "Prisma",
          icon: <Code2 className="w-6 h-6 text-indigo-500" />,
          description: "ORM for TypeScript",
        },
        {
          name: "Neon DB",
          icon: <Database className="w-6 h-6 text-blue-500" />,
          description: "Serverless Postgres Database",
        },
        {
          name: "Gemini AI",
          icon: <Bot className="w-6 h-6 text-green-500" />,
          description: "AI Language Model",
        },
      ],
    },
  ];

  const currentApp = applications[activeApp];

  return (
    <div className="bg-white flex items-center justify-center mt-6">
      <section className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Application List */}
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-12">
                Everything you need to
                <br />
                <span className="text-gray-500">grow as a developer.</span>
              </h2>

              <div className="space-y-6">
                {applications.map((app, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                      activeApp === index
                        ? "bg-black text-white"
                        : "bg-white hover:bg-gray-100 border border-gray-200"
                    }`}
                    onClick={() => setActiveApp(index)}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-2 rounded-lg ${
                          activeApp === index ? "bg-white/20" : "bg-gray-100"
                        }`}
                      >
                        <div
                          className={
                            activeApp === index ? "text-white" : "text-black"
                          }
                        >
                          {app.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold">{app.title}</h3>
                          <span
                            className={`text-sm px-2 py-1 rounded ${
                              activeApp === index
                                ? "bg-white/20 text-white"
                                : app.statusType === "success"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {app.statusType === "success" ? "Live" : "Beta"}
                          </span>
                        </div>
                        <p className="text-sm font-medium mb-2 opacity-80">
                          {app.subtitle}
                        </p>
                        <p className="opacity-70 mb-4 text-sm">
                          {app.description}
                        </p>
                        <ul className="space-y-1">
                          {app.benefits.map((benefit, i) => (
                            <li
                              key={i}
                              className="flex items-center gap-2 text-sm opacity-70"
                            >
                              <CheckCircle className="w-4 h-4" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Preview */}
            <div className="relative">
              <div className="bg-black rounded-2xl p-8 text-white min-h-[500px] flex flex-col justify-center">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    {currentApp.icon}
                    <h3 className="text-2xl font-bold">{currentApp.title}</h3>
                  </div>
                  <p className="text-gray-300 text-lg">{currentApp.subtitle}</p>
                </div>

                {/* Mock Interface */}
                <div className="bg-gray-900 rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full" />
                      <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                      <div className="w-3 h-3 bg-green-400 rounded-full" />
                    </div>
                    <div className="text-gray-400 text-sm">
                      {currentApp.id === "quizzy"
                        ? "quizzy.myapp.dev"
                        : "gitwhiz.myapp.dev"}
                    </div>
                  </div>

                  {currentApp.id === "quizzy" ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-sm">Topic</span>
                          <span className="px-2 py-1 text-white rounded-lg bg-gray-700 text-sm">
                            Data Structures
                          </span>
                        </div>
                        <div className="flex items-center text-gray-400 text-sm">
                          <div className="w-4 h-4 mr-1">⏱</div>
                          <span>02:15</span>
                        </div>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4">
                        <div className="flex items-start gap-4">
                          <div className="text-center border-r border-gray-600 pr-4">
                            <div className="text-lg font-bold">3</div>
                            <div className="text-sm text-gray-400">10</div>
                          </div>
                          <div className="flex-1">
                            <p className="text-white text-base">
                              What is the time complexity of searching in a
                              balanced binary search tree?
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {["O(n)", "O(log n)", "O(n²)", "O(1)"].map(
                          (option, i) => (
                            <div
                              key={i}
                              className={`p-4 rounded-lg flex items-center gap-3 cursor-pointer transition-colors ${
                                option === "O(log n)"
                                  ? "bg-white text-black"
                                  : "bg-gray-800 hover:bg-gray-700 text-white"
                              }`}
                            >
                              <div className="border border-gray-600 rounded px-2 py-1 text-sm">
                                {i + 1}
                              </div>
                              <span>{option}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-medium">
                          Repository Analytics
                        </div>
                        <div className="text-green-400 text-sm">Live Data</div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gray-800 p-4 rounded flex flex-col items-center justify-center h-20">
                          <BarChart3 className="w-6 h-6 text-blue-400 mb-1" />
                          <div className="text-sm text-gray-400">Commits</div>
                        </div>
                        <div className="bg-gray-800 p-4 rounded flex flex-col items-center justify-center h-20">
                          <Users className="w-6 h-6 text-purple-400 mb-1" />
                          <div className="text-sm text-gray-400">
                            Contributors
                          </div>
                        </div>
                        <div className="bg-gray-800 p-4 rounded flex flex-col items-center justify-center h-20">
                          <Star className="w-6 h-6 text-yellow-400 mb-1" />
                          <div className="text-sm text-gray-400">Stars</div>
                        </div>
                      </div>
                      <div className="bg-gray-800 rounded p-4 mt-4">
                        <div className="text-sm text-gray-400 mb-2">
                          Recent Activity
                        </div>
                        <div className="space-y-1 text-sm">
                          <div>• Updated README.md</div>
                          <div>• Merged pull request #42</div>
                          <div>• Added new feature branch</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-6">
                  <Link
                    href={
                      currentApp.id === "gitwhiz"
                        ? `${currentApp.route}/create`
                        : currentApp.route
                    }
                  >
                    <Button className="bg-white text-black hover:bg-gray-200 px-6">
                      Launch {currentApp.title}
                    </Button>
                  </Link>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="border-white text-black hover:bg-white hover:text-black px-6"
                      >
                        View Tech Stack
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-center mb-4">
                          {currentApp.title} Tech Stack
                        </DialogTitle>
                        <p className="text-center text-gray-600 mb-6">
                          Technologies Powering {currentApp.title}
                        </p>
                      </DialogHeader>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentApp.techStack.map((tech, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            {tech.icon}
                            <div>
                              <h4 className="font-semibold text-gray-800">
                                {tech.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {tech.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="fixed bottom-6 right-4 z-50">
                  <div className="bg-black text-white text-xs px-4 py-2 rounded-lg shadow-lg opacity-80 hover:opacity-100 transition">
                    Dark Mode In Development
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
