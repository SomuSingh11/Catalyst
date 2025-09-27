import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import MDEditor from "@uiw/react-md-editor";
import { BirdIcon, Code2, FileX } from "lucide-react";
import React from "react";
import CodeReferences from "../code-references";
import { WhizSavedQuestion } from "@/types/gitWhiz";
import SavedAnswerHeader from "@/components/utilities/saved-answer-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SavedAnswerSheetProps {
  question: WhizSavedQuestion;
}

function SavedAnswerSheet({ question }: SavedAnswerSheetProps) {
  return (
    <SheetContent
      className="sm:max-w-[80vw] w-full flex flex-col h-full p-4 sm:p-6 bg-white border-l border-gray-300"
      onOpenAutoFocus={(e) => e.preventDefault()}
    >
      {/* Header */}
      <SheetHeader className="flex-shrink-0 border-gray-300">
        <SheetTitle className="sr-only">Saved Question Details</SheetTitle>
        <SavedAnswerHeader question={question} />
      </SheetHeader>

      {/* Content */}
      <Tabs defaultValue="answer" className="flex-1 min-h-0 flex flex-col">
        <TabsList className="flex-shrink-0 flex gap-2 bg-white py-2 rounded-md w-full justify-center mb-4">
          <TabsTrigger value="answer" className="bg-gray-200">
            <BirdIcon className="mr-2 size-4" /> AI Response
          </TabsTrigger>
          <TabsTrigger value="references" className="bg-gray-200">
            <Code2 className="mr-2 size-4" /> Referenced Files (
            {Array.isArray(question?.filesReferences)
              ? question.filesReferences.length
              : 0}
            )
          </TabsTrigger>
        </TabsList>

        {/* AI Response Panel */}
        <TabsContent value="answer" className="flex-1 min-h-0 m-0 p-0">
          <div className="bg-white border border-gray-200 rounded-lg h-full overflow-y-auto p-3 sm:p-4">
            <div data-color-mode="light">
              <MDEditor.Markdown
                source={question.answer || "The AI did not provide a response."}
                className="w-full h-full"
              />
            </div>
          </div>
        </TabsContent>

        {/* Referenced Files Panel */}
        <TabsContent value="references" className="flex-1 min-h-0 m-0 p-0">
          {Array.isArray(question?.filesReferences) &&
          question.filesReferences.length > 0 ? (
            <div className="h-full rounded-lg overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
              <CodeReferences
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                fileReferences={question.filesReferences as any}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-sm text-gray-500">
              <FileX className="size-8 mb-2" />
              <p>No files were referenced for this Response.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </SheetContent>
  );
}

export default SavedAnswerSheet;
