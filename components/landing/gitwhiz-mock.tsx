import { Check, Search } from "lucide-react";
import React from "react";
import { gitwhizMockData } from "@/data/gitwhiz-mockdata";
import LandingDialog from "./mock-dialog";

export default function GitWhizMockSection() {
  const gridBgStyle = {
    backgroundColor: "#f0fdf4",
    backgroundImage:
      "linear-gradient(rgba(0, 128, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 128, 0, 0.05) 1px, transparent 1px)",
    backgroundSize: "2rem 2rem",
  };
  return (
    <section id="features" className="py-12 lg:py-24" style={gridBgStyle}>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-28">
        <div className="grid lg:grid-cols-3 gap-20 items-center">
          {/* Left Side - Text */}
          <div className="border-2 border-emerald-600/40 sm:w-full rounded-lg bg-emerald-50 p-8 border-dashed">
            <h2 className="text-4xl lg:text-5xl font-display font-semibold mb-6 text-slate-900 tracking-tight">
              Instant Codebase Mastery
            </h2>

            <p className="text-base text-slate-700 mb-8 ">
              Stop digging through folders. Treat your repository like a
              conversation. GitWhiz delivers precise, context-aware explanations
              backed by deep architectural analysis.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Search className="text-emerald-700 w-10 h-8" />

                <div>
                  <p className="font-bold text-slate-900 text-lg">
                    Intent Recognition
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    Transcend basic keyword matching. The AI grasps the{" "}
                    <em>underlying intent</em> of your queries, connecting you
                    to the right logic even if variable names don&apos;t match.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Check className="text-emerald-700 w-10 h-8" />
                <div>
                  <p className="font-bold text-slate-900 text-lg">
                    Verifiable Citations
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    Eliminate hallucinations. Every answer includes clickable
                    citations linking directly to the source of truth in your
                    files.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Response Panel Only */}
          <div className="relative lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              <div>
                <LandingDialog
                  loading={false}
                  question={gitwhizMockData[0].question}
                  answer={gitwhizMockData[0].answer}
                  filesReferences={gitwhizMockData[0].filesReferences}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
