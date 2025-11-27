import React, { useState, useEffect } from "react";
import {
  Pause,
  Play,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Network,
  ScanSearch,
  Github,
} from "lucide-react";
import { Button } from "../ui/button";
import { SignUpModal } from "./header";
import Link from "next/link";

export default function HeroSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  const steps = [
    {
      title: "Secure Synchronization",
      icon: <Github className="w-6 h-6" />,
      description: "Instant Ingestion",
      detail:
        "We establish a secure, encrypted link to your repository. In seconds, Catalyst creates a private, ephemeral mirror of your codebase, ready for deep analysis.",
      color: "bg-emerald-700/50",
      lightColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-600",
    },
    {
      title: "Cognitive Mapping",
      icon: <Network className="w-6 h-6" />,
      description: "Semantic Understanding",
      detail:
        "Our engine goes beyond reading text. It builds a mental model of your project's architecture, learning how modules interact and understanding the 'story' behind the code.",
      color: "bg-orange-700/50",
      lightColor: "bg-orange-50",
      borderColor: "border-orange-200",
      textColor: "text-orange-600",
    },
    {
      title: "Intent Recognition",
      icon: <ScanSearch className="w-6 h-6" />,
      description: "Contextual Filtering",
      detail:
        "When you ask a question, we don't just match keywords. The system understands your intent, instantly filtering through thousands of files to find the exact needle in the haystack.",
      color: "bg-blue-700/50",
      lightColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-600",
    },
    {
      title: "Expert Synthesis",
      icon: <Sparkles className="w-6 h-6" />,
      description: "Verifiable Insights",
      detail:
        "The AI acts as a senior engineer, synthesizing a clear, human-readable answer. Every insight is backed by direct proof, linked straight to your source files.",
      color: "bg-purple-700/50",
      lightColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-600",
    },
  ];

  useEffect(() => {
    if (!isAnimating) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAnimating, steps.length]);

  const handleStepClick = (index: number) => {
    setIsAnimating(false);
    setActiveStep(index);
  };

  return (
    <>
      <section className="relative py-16 lg:py-24 overflow-hidden bg-[#FFFDF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* LEFT COLUMN: Heading & CTA */}
            <div className="text-left space-y-8 font-display">
              <h1 className="text-5xl lg:text-7xl font-thin tracking-tight text-gray-900 leading-[1.1]">
                Understand code.
                <br />
                <span className="text-gray-400 font-light">
                  Accelerate logic.
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                Catalyst transforms how developers interact with repositories.
                <strong className="text-gray-900 font-semibold">
                  {" "}
                  GitWhiz
                </strong>{" "}
                analyzes your repo using semantic understanding, turning complex
                codebases into queryable insights.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button
                  className="px-8 group py-6 font-medium gap-2 hover:scale-105 transition-transform duration-200"
                  onClick={() => setIsSignUpModalOpen(true)}
                >
                  {" "}
                  Start Analyzing
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-200 group-hover:-rotate-45"
                  />
                </Button>
                <Button
                  variant={"link"}
                  className="px-8 py-6 group font-medium gap-2 hover:scale-105 transition-transform duration-200"
                >
                  {" "}
                  <Link href={"https://github.com/SomuSingh11/Catalyst"}>
                    Github
                  </Link>
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-200 group-hover:-rotate-45"
                  />
                </Button>
              </div>

              <div className="pt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-600">
                {[
                  "Fetch from GitHub",
                  "Semantic Search",
                  "AI Analysis",
                  "Quizzes",
                  "Visualizer",
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-600" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: Interactive Flow Diagram */}
            <div className="w-full">
              <div className="relative bg-white rounded-2xl p-4 lg:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100">
                <div className="absolute top-6 right-6 z-20">
                  <button
                    onClick={() => setIsAnimating(!isAnimating)}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {isAnimating ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                </div>

                <div>
                  <h3 className="text-lg font-semibold font-code text-gray-900">
                    The Intelligence Engine
                  </h3>
                </div>

                <div className="mt-4 flex gap-2 mb-8">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1 flex-1 rounded-full transition-all duration-700 ${
                        index === activeStep
                          ? "bg-gradient-to-r " + steps[activeStep].color
                          : "bg-gray-100"
                      }`}
                    />
                  ))}
                </div>

                <div className="relative overflow-hidden rounded-2xl mb-8 shadow-sm transition-all duration-500 h-48 sm:h-40">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${steps[activeStep].color} opacity-100 transition-opacity duration-500`}
                  ></div>

                  <div className="relative z-10 p-2 px-6 flex flex-col justify-center h-full">
                    <div className="flex items-center gap-4 mb-2 text-white">
                      <span className="bg-white/20 p-1 rounded-lg backdrop-blur-md">
                        {steps[activeStep].icon}
                      </span>
                      <span className="text-md font-bold tracking-wider uppercase opacity-100">
                        {steps[activeStep].title}
                      </span>
                    </div>
                    <p className="text-white/90 font-display text-sm leading-relaxed max-w-md">
                      {steps[activeStep].detail}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col relative space-y-0">
                  {steps.map((step, index) => (
                    <div key={index} className="relative">
                      <div
                        onClick={() => handleStepClick(index)}
                        className={`
                        relative z-10 cursor-pointer p-3 rounded-xl border transition-all duration-300 flex items-center gap-4
                        ${
                          activeStep === index
                            ? `${step.borderColor} border shadow-sm translate-x-2`
                            : "bg-white border-transparent hover:bg-gray-50"
                        }
                      `}
                      >
                        <div
                          className={`
                        w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300
                        ${
                          activeStep === index
                            ? "bg-white shadow-sm"
                            : "bg-gray-100"
                        }
                      `}
                        >
                          <div className={"text-gray-400"}>{step.icon}</div>
                        </div>

                        <div className="flex-1">
                          <h4
                            className={`font-semibold text-sm transition-colors ${
                              activeStep === index
                                ? "text-gray-900"
                                : "text-gray-500"
                            }`}
                          >
                            {step.title}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
        type="sign-up"
      />
    </>
  );
}
