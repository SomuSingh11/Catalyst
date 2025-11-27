import React from "react";

import {
  BirdIcon,
  Code2,
  FileX,
  Loader2,
  MessageCircleQuestion,
} from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { Skeleton } from "@/components/ui/skeleton";
import AskQuestionHeader from "../gitWhiz/dashboard/askQuestion/ask-question-header";
import CodeReferences from "../gitWhiz/dashboard/code-references";

interface LandingProps {
  loading: boolean;
  question: string;
  answer: string;
  filesReferences: { fileName: string; sourceCode: string; summary: string }[];
}

function LandingDialog({
  loading,
  question,
  answer,
  filesReferences,
}: LandingProps) {
  return (
    <div className="max-w-[85vw] sm:max-w-[85vw] lg:max-w-[85vw] h-[80vh] sm:h-[60vh] lg:h-[75vh] flex flex-col bg-white p-3 sm:p-6 mx-auto">
      <div className="border-b pb-2 sm:pb-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <AskQuestionHeader loading={loading} />
        </div>
      </div>

      <div className="flex flex-col flex-1 gap-3 sm:gap-4 min-h-0">
        <div className="flex-1 overflow-auto flex flex-col gap-3 sm:gap-4">
          {/* Question */}
          <div className="bg-secondary/15 text-green-800 rounded-lg p-2 sm:p-4 border-l-4 border-green-900 flex-shrink-0">
            <div className="flex items-start gap-2">
              <MessageCircleQuestion className="size-4 sm:size-5 text-gray-800 mt-1 sm:mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed break-words">
                  {question}
                </p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="answer" className="flex-1 min-h-0 flex flex-col">
            <TabsList className="flex gap-2 bg-white py-2 rounded-md w-full justify-center">
              <TabsTrigger value="answer" className="bg-gray-200">
                <BirdIcon className="mr-2 size-4" /> AI Response
              </TabsTrigger>
              <TabsTrigger value="references" className="bg-gray-200">
                <Code2 className="mr-2 size-4" /> Referenced Files (
                {filesReferences.length})
              </TabsTrigger>
            </TabsList>

            {/* AI Response Panel */}
            <TabsContent value="answer" className="flex-1 min-h-0 mt-2">
              <div className="bg-white border border-gray-200 rounded-lg h-full overflow-y-auto p-3 sm:p-4">
                {loading && !answer ? (
                  <div className="space-y-3">
                    <div className="animate-pulse flex items-center gap-2 text-sm text-gray-500">
                      <Loader2 className="size-4 animate-spin" />
                      Analyzing your codebase and generating insights...
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-11/12" />
                  </div>
                ) : (
                  <div data-color-mode="light">
                    <MDEditor.Markdown
                      source={answer || "The AI did not provide a response."}
                      className="w-full h-full"
                    />
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Referenced Files Panel */}
            <TabsContent
              value="references"
              className="flex-1 min-h-0 overflow-y-auto scrollbar-thin mt-2 rounded-lg"
            >
              {filesReferences.length > 0 ? (
                <CodeReferences fileReferences={filesReferences} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-sm text-gray-500">
                  <FileX className="size-8 mb-2" />
                  <p>No files were referenced for this Response.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default LandingDialog;
