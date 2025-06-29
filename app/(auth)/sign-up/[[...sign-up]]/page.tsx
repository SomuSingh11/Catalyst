"use client";

import { SignUp } from "@clerk/nextjs";
import React from 'react';
import { BarChart3, Brain, Github, Code, Zap, Target, Layers, Sparkles } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden flex items-center justify-center">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-gray-200 rounded-full animate-pulse opacity-20"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-gray-300 rounded-full animate-pulse opacity-15" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-black opacity-5 rounded-lg rotate-45 animate-bounce" style={{animationDelay: '0.5s'}}></div>

      {/* Main content */}
      <div className="relative z-20">
        <SignUp />
      </div>

      {/* Enhanced floating elements with animations */}
      <div className="absolute top-20 left-10 group cursor-pointer">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-lg border border-gray-200 transition-all duration-300 hover:scale-110 hover:rotate-3 hover:shadow-xl animate-float">
          <Github className="w-10 h-10 text-gray-700 transition-transform group-hover:scale-110" />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-black rounded-full animate-ping opacity-20"></div>
      </div>

      <div className="absolute top-32 right-16 group cursor-pointer">
        <div className="w-24 h-24 bg-gradient-to-br from-white to-gray-100 rounded-3xl flex items-center justify-center shadow-xl border border-gray-300 transition-all duration-300 hover:scale-110 hover:-rotate-3 hover:shadow-2xl animate-float" style={{animationDelay: '0.5s'}}>
          <Brain className="w-12 h-12 text-gray-800 transition-transform group-hover:scale-110" />
        </div>
        <div className="absolute top-1 right-1 w-3 h-3 bg-gray-400 rounded-full animate-pulse"></div>
      </div>

      <div className="absolute bottom-20 left-20 group cursor-pointer">
        <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center shadow-md border border-gray-400 transition-all duration-300 hover:scale-110 hover:rotate-6 hover:shadow-lg animate-float" style={{animationDelay: '1s'}}>
          <BarChart3 className="w-8 h-8 text-gray-700 transition-transform group-hover:scale-110" />
        </div>
      </div>

      {/* Additional floating elements for richness */}
      <div className="absolute top-1/2 left-16 group cursor-pointer">
        <div className="w-14 h-14 bg-black bg-opacity-5 rounded-full flex items-center justify-center border-2 border-gray-300 border-dashed transition-all duration-300 hover:scale-110 hover:bg-opacity-10 animate-float" style={{animationDelay: '1.5s'}}>
          <Code className="w-7 h-7 text-gray-600" />
        </div>
      </div>

      <div className="absolute bottom-1/3 right-12 group cursor-pointer">
        <div className="w-18 h-18 bg-gradient-to-tr from-gray-100 to-white rounded-2xl flex items-center justify-center shadow-lg border border-gray-200 transition-all duration-300 hover:scale-110 hover:-rotate-2 animate-float" style={{animationDelay: '2s'}}>
          <Zap className="w-9 h-9 text-gray-700" />
        </div>
      </div>

      <div className="absolute top-2/3 left-1/3 group cursor-pointer">
        <div className="w-12 h-12 bg-white bg-opacity-80 rounded-lg flex items-center justify-center shadow-md border border-gray-200 transition-all duration-300 hover:scale-110 hover:rotate-12 animate-float" style={{animationDelay: '2.5s'}}>
          <Target className="w-6 h-6 text-gray-600" />
        </div>
      </div>

      <div className="absolute top-16 right-1/3 group cursor-pointer">
        <div className="w-22 h-22 bg-gradient-to-bl from-gray-50 to-gray-200 rounded-full flex items-center justify-center shadow-lg border-2 border-gray-200 transition-all duration-300 hover:scale-110 hover:rotate-45 animate-float" style={{animationDelay: '3s'}}>
          <Layers className="w-10 h-10 text-gray-700" />
        </div>
      </div>

      <div className="absolute bottom-16 right-1/4 group cursor-pointer">
        <div className="w-15 h-15 bg-black bg-opacity-5 rounded-xl flex items-center justify-center border border-gray-300 transition-all duration-300 hover:scale-110 hover:-rotate-6 animate-float" style={{animationDelay: '3.5s'}}>
          <Sparkles className="w-8 h-8 text-gray-600" />
        </div>
      </div>

      {/* Subtle gradient orbs */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-radial from-gray-200 to-transparent rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-gradient-radial from-gray-100 to-transparent rounded-full opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
        
        .w-15 { width: 3.75rem; }
        .h-15 { height: 3.75rem; }
        .w-18 { width: 4.5rem; }
        .h-18 { height: 4.5rem; }
        .w-22 { width: 5.5rem; }
        .h-22 { height: 5.5rem; }
      `}</style>
    </div>
  );
}