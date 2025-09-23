import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Bird, Brain, Loader2, Search, Sparkles } from "lucide-react";
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
  "Which file implements the authentication logic?",
  "Where is the user registration API defined?",
  "Which component renders the login form?",
  "Where is the database connection initialized?",
  "Which service handles external API calls?",
  "Where is the routing logic defined?",
  "Which files contain middleware functions?",
  "Where is input validation implemented?",
  "Which function handles error logging?",
  "Where are constants or config variables stored?",
  "Which file manages session handling?",
  "Where is authorization (role-based access) implemented?",
  "Which module defines the data models?",
  "Where is caching logic set up?",
  "Which function is responsible for file uploads?",
  "Where is the search functionality implemented?",
  "Which files define reusable utility functions?",
  "Where is state management configured?",
  "Which file is the entry point of the project?",
  "Where is the email/notification service implemented?",
  "Which function handles payment processing?",
  "Where is pagination logic implemented?",
  "Which files define environment-specific settings?",
  "Where are API response formats standardized?",
  "Which function or file handles rate limiting?",
];

function GitwhizCard({
  loading,
  onSubmit,
  question,
  setQuestion,
}: gitWhizCardProps) {
  const handleSuggestedQuestionClick = () => {
    const randomIndex = Math.floor(Math.random() * suggestedQuestions.length);
    const randomQuestion = suggestedQuestions[randomIndex];
    setQuestion(randomQuestion);
  };
  return (
    <div>
      <Card className="relative col-span-3 overflow-hidden border border-gray-300 shadow">
        <CardHeader className="relative ">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-secondary rounded-xl shadow">
              <Brain className="size-8 text-green-800" />
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
              <div className="flex items-center gap-2 text-sm font-light text-gray-800 font-code pb-2">
                <Search className="size-4" />
                What would you like to know about your project?
              </div>
              <Textarea
                placeholder="Ask anything about your codebase - tutorials, architecture, best practices, implementation details, or get suggestions for improvements..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-[80px] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 font-sans text-gray-800"
                disabled={loading}
              />
            </div>
            <div className="flex items-center justify-between gap-6 pt-3">
              <Button
                disabled={loading || !question.trim()}
                variant={"ghost"}
                className="text-slate-600 flex-1 hover:text-green-900 hover:bg-slate-100 rounded-lg h-11 border border-gray-300 transition-all duration-150 active:scale-95"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-5 animate-spin mr-2" />
                    Analyzing codebase...
                  </>
                ) : (
                  <>
                    <Bird className="size-5 mr-2" />
                    Ask GitWhiz AI
                  </>
                )}
              </Button>
              <Button
                variant={"ghost"}
                type="button"
                className="text-slate-600 flex-1 hover:bg-slate-100 hover:text-slate-800 rounded-lg h-11 border border-gray-300 transition-all duration-150 active:scale-95"
                disabled={loading}
                onClick={handleSuggestedQuestionClick}
              >
                <Sparkles className="size-5 mr-2" />
                Quick Suggestions
              </Button>
            </div>
          </form>

          <FeatureHighLights />
        </CardContent>
      </Card>
    </div>
  );
}

export default GitwhizCard;
