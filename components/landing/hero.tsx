import React, { useState, useEffect } from "react";
import {
  Pause,
  Play,
  ArrowRight,
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
        "Instantly mirrors your repository into a secure, ephemeral sandbox via an encrypted read-only handshake.",
      color: "bg-emerald-700/50",
      borderColor: "border-emerald-200",
    },
    {
      title: "Cognitive Mapping",
      icon: <Network className="w-6 h-6" />,
      description: "Semantic Understanding",
      detail:
        "Our engine transforms complex logic into a semantic web, teaching the AI the story behind your architecture.",
      color: "bg-orange-700/50",
      borderColor: "border-orange-200",
    },
    {
      title: "Intent Recognition",
      icon: <ScanSearch className="w-6 h-6" />,
      description: "Contextual Retrieval",
      detail:
        "Executes a deep semantic search to retrieve the exact code segments that match the underlying intent of your query.",
      color: "bg-blue-700/50",
      borderColor: "border-blue-200",
    },
    {
      title: "Expert Synthesis",
      icon: <Sparkles className="w-6 h-6" />,
      description: "Verifiable Insights",
      detail:
        "The LLM synthesizes an answer using only the retrieved context, forcing accuracy and providing clickable citations to the source files.",
      color: "bg-purple-700/50",
      borderColor: "border-purple-200",
    },
  ];

  useEffect(() => {
    if (!isAnimating) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [isAnimating, steps.length]);

  const handleStepClick = (index: number) => {
    setIsAnimating(false);
    setActiveStep(index);
  };

  return (
    <>
      <section className="relative py-20 lg:py-24 overflow-hidden bg-[#FFFDF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            {/* LEFT COLUMN: Heading & CTA */}
            <div className="text-center lg:text-left space-y-8 font-display mx-auto">
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

              <div className="flex flex-col sm:flex-row gap-4 pt-2 items-center justify-center lg:justify-start">
                <Button
                  className="min-w-[180px] px-8 group py-6 font-medium gap-2 hover:scale-105 transition-transform duration-200"
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
                  asChild
                  variant="link"
                  className="min-w-[180px] px-8 py-6 group font-medium gap-2 hover:scale-105 transition-transform duration-200 border border-dashed inline-flex items-center"
                >
                  <Link
                    href="https://github.com/SomuSingh11/Catalyst"
                    target="_blank"
                  >
                    Github
                    <ArrowRight
                      size={18}
                      className="transition-transform duration-200 group-hover:-rotate-45"
                    />
                  </Link>
                </Button>
              </div>
            </div>

            {/* RIGHT COLUMN: Interactive Flow Diagram */}
            <div className="max-w-sm mx-auto">
              <div className="relative bg-white rounded-2xl p-4 lg:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold font-code text-gray-900">
                    The Intelligence Engine
                  </h3>
                  <button
                    onClick={() => setIsAnimating(!isAnimating)}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {isAnimating ? <Pause size={18} /> : <Play size={18} />}
                  </button>
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

                <div className="relative overflow-hidden rounded-2xl mb-8 shadow-sm h-28 transition-all duration-500">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${steps[activeStep].color} transition-opacity duration-500`}
                  />

                  <div className="relative z-10 flex h-full flex-col justify-center px-4">
                    <p className="text-white/90 text-sm leading-relaxed max-w-md">
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
                            ? `${step.color} shadow-md`
                            : "bg-gray-100"
                        }
                      `}
                        >
                          <div
                            className={
                              activeStep === index
                                ? `text-white/90`
                                : "text-gray-400"
                            }
                          >
                            {step.icon}
                          </div>
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
