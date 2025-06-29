"use client";
import { BookOpen, Code2, LayoutDashboard, Sparkles, ArrowLeft, Star, Zap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SheetsLanding() {
  return (
    <div className="bg-white text-black px-4 relative mt-10">
      
      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="max-w-2xl text-center space-y-8">
          
          {/* Header with enhanced styling */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4 group">
              <div className="p-3 bg-black/10 hover:bg-black/20 rounded-2xl border border-black/20 backdrop-blur-sm group-hover:scale-105 transition-transform duration-300">
                <BookOpen className="w-8 h-8 text-black" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-black tracking-tight">
                AlgoVault
              </h1>
            </div>
            
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-xl mx-auto">
              Your comprehensive vault for algorithmic patterns, coding challenges, and{" "}
              <span className="text-black font-semibold">interview mastery</span>
            </p>
          </div>

          {/* Enhanced platform badges */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { name: "LeetCode Top 150", icon: LayoutDashboard },
              { name: "Grokking Patterns", icon: Code2 },
              { name: "Sean Prashad", icon: Target },
              { name: "NeetCode", icon: Sparkles }
            ].map((platform, index) => (
              <div
                key={platform.name}
                className="flex items-center gap-2 px-4 py-2 bg-black/10 hover:bg-black/20 rounded-full border border-black/20 backdrop-blur-sm hover:scale-105 transition-all duration-300 hover:shadow-lg group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <platform.icon className="w-4 h-4 text-black group-hover:rotate-6 transition-transform duration-300" />
                <span className="text-xs font-medium text-black">{platform.name}</span>
              </div>
            ))}
          </div>

          {/* Enhanced CTA section */}
          <div className="relative">
            <div className="absolute inset-0 bg-black/5 rounded-3xl blur-xl"></div>
            <div className="relative border border-black/20 bg-black/5 backdrop-blur-xl rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-center gap-2 text-black mb-3">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium">Coming Soon</span>
                <Star className="w-4 h-4 fill-current" />
              </div>
              
              <Button
                disabled
                className="bg-black text-white hover:bg-gray-800 px-10 py-3 text-base font-semibold rounded-2xl border-0 shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                <Sparkles className="w-4 h-4 mr-2 text-white" />
                Launch AlgoVault
              </Button>
              
              <p className="text-gray-600 text-sm">
                Be the first to unlock the ultimate algorithmic pattern vault
              </p>
            </div>
          </div>

          {/* Enhanced features */}
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                icon: Code2,
                title: "Smart Code Editor",
                description: "Real-time insights and pattern recognition"
              },
              {
                icon: Zap,
                title: "AI Explanations",
                description: "Intelligent breakdowns of complex algorithms"
              }
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="p-4 bg-black/10 hover:bg-black/20 rounded-2xl border border-black/20 backdrop-blur-sm hover:scale-105 transition-all duration-300 group"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-black/10 rounded-xl group-hover:bg-black/20 transition-colors duration-300">
                    <feature.icon className="w-5 h-5 text-black" />
                  </div>
                  <h3 className="text-base font-semibold text-black">{feature.title}</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Enhanced back link */}
          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2 text-gray-600 hover:text-black bg-black/10 hover:bg-black/20 rounded-full border border-black/20 backdrop-blur-sm transition-all duration-300 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}