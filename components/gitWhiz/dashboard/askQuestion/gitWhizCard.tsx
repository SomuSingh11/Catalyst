import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Lightbulb, Loader2, Search, Sparkles } from "lucide-react";
import React from "react";
import FeatureHighLights from "./feature-highlights";
import { Button } from "@/components/ui/button";

interface gitWhizCardProps {
  loading: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  question: string;
  setQuestion: (value: string) => void;
}

const suggestedQuestions = [
  "How do I add a new feature to this project?",
  "Where should I implement user authentication?",
  "Which files handle the database connections?",
  "How can I improve the performance of this component?",
  "What's the best way to add error handling here?",
];

function GitwhizCard({
  loading,
  onSubmit,
  question,
  setQuestion,
}: gitWhizCardProps) {
  return (
    <div>
      <Card className="relative col-span-3 overflow-hidden border border-gray-300 shadow bg-white">
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-gray-200 rounded-xl shadow">
              <Brain className="size-8 text-black" />
            </div>
            <div>
              <span className="text-gray-800 font-display">Ask GitWhiz AI</span>
              <div className="flex items-center gap-1 mt-1">
                <Sparkles className="size-4 text-gray-600" />
                <span className="text-sm font-normal text-gray-600">
                  Get intelligent insights about your codebase
                </span>
              </div>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                <Search className="size-4" />
                What would you like to know about your project?
              </div>
              <Textarea
                placeholder="Ask anything about your codebase - tutorials, architecture, best practices, implementation details, or get suggestions for improvements..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-[50px]"
                disabled={loading}
              />
            </div>

            {/* Suggested Questions */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Lightbulb className="size-4 text-gray-700" />
                Quick suggestions:
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.slice(0, 3).map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setQuestion(suggestion)}
                    className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-black rounded-full transition-all duration-200 border border-gray-300"
                    disabled={loading}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <Button
              disabled={loading || !question.trim()}
              className="w-full bg-black hover:bg-gray-900 text-white shadow hover:shadow-lg transition-all duration-200 rounded-xl h-10"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="size-5 animate-spin mr-2" />
                  Analyzing codebase...
                </>
              ) : (
                <>
                  <Brain className="size-5 mr-2" />
                  Ask GitWhiz AI
                </>
              )}
            </Button>
          </form>

          <FeatureHighLights />
        </CardContent>
      </Card>
    </div>
  );
}

export default GitwhizCard;
