import React from "react";
import GitwhizCardMock from "./gitwhiz-mockcard";

export default function GitWhizQuerySection() {
  const gridBgStyle = {
    backgroundColor: "#f0fdf4",
    backgroundImage:
      "linear-gradient(rgba(0, 128, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 128, 0, 0.05) 1px, transparent 1px)",
    backgroundSize: "2rem 2rem",
  };

  return (
    <section id="gitwhiz-query" className="py-12 lg:py-24" style={gridBgStyle}>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-28">
        <div className="flex gap-20 items-center justify-center">
          {/* Left Side - Query Card */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="">
                <GitwhizCardMock />
              </div>
            </div>
          </div>

          <div className="max-w-md">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ask Questions Naturally
            </h2>
            <p className="text-lg text-gray-700">
              Simply type your question in plain English. GitWhiz AI understands
              context and provides intelligent answers about your entire
              codebase.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
