import { Check, Search } from "lucide-react";
import React from "react";
import { gitwhizMockData } from "@/data/gitwhiz-mockdata";
import LandingDialog from "./mock-dialog";

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const FeatureItem = ({ icon, title, description }: FeatureItemProps) => (
  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-emerald-200/50 hover:border-emerald-300 hover:shadow-md transition-all duration-300">
    <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-2.5 rounded-xl shadow-sm flex-shrink-0">
      {icon}
    </div>

    <div>
      <p className="font-semibold text-slate-900 text-sm mb-1">{title}</p>
      <p className="text-xs text-slate-600 leading-relaxed">{description}</p>
    </div>
  </div>
);

export default function GitWhizMockSection() {
  const gridBgStyle = {
    backgroundColor: "#f0fdf4",
    backgroundImage:
      "linear-gradient(rgba(0, 128, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 128, 0, 0.05) 1px, transparent 1px)",
    backgroundSize: "2rem 2rem",
  };
  return (
    <section id="features" className="py-20 lg:py-24" style={gridBgStyle}>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-28">
        <div className="grid lg:grid-cols-3 gap-20 items-center">
          {/* Left Side - Text */}
          <div className="relative mx-auto max-w-sm group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500" />

            <div className="relative p-6 rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-50 to-teal-50/50 shadow-lg backdrop-blur-sm">
              <h2 className="text-2xl lg:text-3xl font-display font-bold text-slate-900 tracking-tight leading-tight mb-2">
                Instant Codebase Mastery
              </h2>

              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Treat your repository like a conversation. Get precise,
                context-aware explanations backed by deep analysis.
              </p>

              <div className="space-y-4">
                <FeatureItem
                  icon={<Search className="text-white w-5 h-5" />}
                  title="Intent Recognition"
                  description={
                    <>
                      AI grasps the{" "}
                      <span className="text-emerald-700 font-medium">
                        underlying intent
                      </span>{" "}
                      of your queries, connecting you to the right logic.
                    </>
                  }
                />

                <FeatureItem
                  icon={<Check className="text-white w-5 h-5" />}
                  title="Verifiable Citations"
                  description={
                    <>
                      Every answer includes{" "}
                      <span className="text-emerald-700 font-medium">
                        clickable citations
                      </span>{" "}
                      linking directly to source files.
                    </>
                  }
                />
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
