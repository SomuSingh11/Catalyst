"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorScreenProps {
  error: string | null;
  onRetry: () => void;
}

export function ErrorGraphScreen({ error, onRetry }: ErrorScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-white/50 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4 max-w-sm text-center p-6">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-red-100" />
          <div className="h-12 w-12 flex items-center justify-center rounded-full bg-red-50 text-red-500 shadow-sm z-10">
            <AlertCircle className="h-6 w-6" />
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-medium text-gray-900">Analysis Failed</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            {error ||
              "An unexpected error occurred while processing the dependency graph."}
          </p>
        </div>

        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 mt-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm active:scale-95"
        >
          <RefreshCw className="h-3 w-3" />
          Try Again
        </button>
      </div>
    </div>
  );
}
