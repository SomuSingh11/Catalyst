import React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AskQuestionHeader from "./ask-question-header";
import { toast } from "sonner";
import {
  BirdIcon,
  Code2,
  Download,
  FileX,
  Loader2,
  MessageCircleQuestion,
} from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import CodeReferences from "../code-references";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { Skeleton } from "@/components/ui/skeleton";

interface ResultDialogProps {
  isOpen: boolean;
  projectId: string;
  setOpen: (open: boolean) => void;
  loading: boolean;
  question: string;
  answer: string;
  filesReferences: { fileName: string; sourceCode: string; summary: string }[];
}

function ResultDialog({
  isOpen,
  projectId,
  setOpen,
  loading,
  question,
  answer,
  filesReferences,
}: ResultDialogProps) {
  const saveAnswer = api.whizProject.saveAnswer.useMutation();
  const utils = api.useUtils();

  const saveButton = async () => {
    await saveAnswer.mutateAsync(
      {
        projectId,
        question,
        answer,
        filesReferences,
      },
      {
        onSuccess: async () => {
          toast.success("Answer saved successfully!");
          await utils.whizProject.getSavedQuestions.invalidate({
            projectId,
          });
        },
        onError: () => {
          toast.error("Failed to save answer!");
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="max-w-[80vw] h-[90vh] flex flex-col bg-white">
        <DialogHeader className="border-b pb-2 flex-shrink-0">
          <DialogTitle className="flex items-center gap-3">
            <AskQuestionHeader loading={loading} />
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col flex-1 gap-4 min-h-0">
          <div className="flex-1 overflow-auto flex flex-col gap-4 ">
            {/* Question */}
            <div className="bg-secondary/15 text-green-800 rounded-lg p-4 border-l-4 border-green-900 flex-shrink-0">
              <div className="flex items-start gap-2">
                <MessageCircleQuestion className="size-5 text-gray-800 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-700">{question}</p>
                </div>
              </div>
            </div>

            <Tabs
              defaultValue="answer"
              className="flex-1 min-h-0 flex flex-col"
            >
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
                <div className="bg-white border border-gray-200 rounded-lg h-full overflow-y-auto p-6">
                  {loading && !answer ? (
                    <div className="p-4 space-y-3">
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
                    <p>No files were referenced for this Respose.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            disabled={saveAnswer.isPending || loading || !answer}
            onClick={saveButton}
            variant={"outline"}
          >
            {saveAnswer.isPending ? (
              <>
                <Loader2 className="mr-2 size-4 text-green-800 animate-spin" />
                Saving
              </>
            ) : (
              <>
                <Download className="mr-2 size-4" />
                Save Answer
              </>
            )}
          </Button>
          <Button type="button" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ResultDialog;
