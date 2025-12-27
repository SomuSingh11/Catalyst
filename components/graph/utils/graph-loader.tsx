"use client";

import { Network } from "lucide-react";

export function LoadingGraphScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-white/50 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-gray-200" />
          <div className="absolute inset-0 rounded-full border-t border-emerald-500 animate-spin" />

          <div className="h-12 w-12 flex items-center justify-center rounded-full bg-white shadow-sm z-10">
            <Network className="h-5 w-5 text-emerald-600 animate-pulse" />
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-sm font-medium text-gray-900">
            Analyzing Project
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            This may take a few seconds...
          </p>
        </div>
      </div>
    </div>
  );
}
