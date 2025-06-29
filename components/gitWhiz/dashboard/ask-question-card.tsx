"use client";
import React from "react";

import useProject from "@/hooks/use-project";
import { askQuestion } from "@/lib/actions/askQuestion";
import { readStreamableValue } from "ai/rsc";
import MDEditor from "@uiw/react-md-editor";
import CodeReferences from "@/components/gitWhiz/dashboard/code-references";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Code2, Download, Lightbulb, Loader2, MessageCircleQuestion, Search, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import useRefetch from "@/hooks/use-fetch";
import AskQuestionHeader from "@/components/gitWhiz/dashboard/askQuestion/ask-question-header";
import FeatureHighLights from "./askQuestion/feature-highlights";

const AskQuestionCard = () => {
    const { project } = useProject();
    const [question, setQuestion] = React.useState<string>("");
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [filesReferences, setFilesReferences] = React.useState<{ fileName: string; sourceCode: string; summary: string }[]>([]);
    const [answer, setAnswer] = React.useState<string>("");
    const saveAnswer = api.whizProject.saveAnswer.useMutation();

    const suggestedQuestions = [
        "How do I add a new feature to this project?",
        "Where should I implement user authentication?",
        "Which files handle the database connections?",
        "How can I improve the performance of this component?",
        "What's the best way to add error handling here?"
    ];

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setAnswer("");
        setFilesReferences([]);
        e.preventDefault();
        if (!project?.id) return;

        setLoading(true);
        setOpen(true);

        const { output, filesReferences } = await askQuestion(question, project.id);
        setFilesReferences(filesReferences);

        for await (const delta of readStreamableValue(output)) {
            if (delta) setAnswer(ans => ans + delta);
        }

        setLoading(false);
    };

    const refetch = useRefetch();

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-[80vw] max-h-[90vh] overflow-auto bg-white">
                    <DialogHeader className="border-b pb-4">
                        <DialogTitle className="flex items-center gap-3">
                            <AskQuestionHeader loading={loading} />
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 overflow-hidden flex flex-col gap-4">
                        <div className="flex-1 overflow-auto flex flex-col gap-4 p-2">
                            {/* Question */}
                            <div className="bg-gray-100 rounded-lg p-4 border-l-4 border-gray-500">
                                <div className="flex items-start gap-2">
                                    <MessageCircleQuestion className="size-5 text-gray-800 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-medium text-black mb-1">Your Question</h4>
                                        <p className="text-gray-700">{question}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Answer */}
                            <div className="flex-1 min-h-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <Brain className="size-5 text-gray-800" />
                                    <h4 className="font-medium text-black">AI Response</h4>
                                </div>

                                <div className="bg-white border border-gray-300 rounded-lg h-full">
                                    <MDEditor.Markdown
                                        source={answer || (loading ? "🤖 Analyzing your codebase and generating insights..." : "Waiting for response...")}
                                        className="w-full h-full  p-4 pb-0 overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 hover:scrollbar-thumb-gray-500 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Code References */}
                            {filesReferences.length > 0 && (
                                <div className="pt-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Code2 className="size-5 text-gray-800" />
                                        <h4 className="font-medium text-black">Referenced Files</h4>
                                    </div>
                                    <CodeReferences fileReferences={filesReferences} />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            disabled={saveAnswer.isPending}
                            onClick={async () => {
                                await saveAnswer.mutateAsync({
                                    projectId: project!.id,
                                    question,
                                    answer,
                                    filesReferences
                                }, {
                                    onSuccess: () => {
                                        toast.success("Answer saved successfully!");
                                        refetch();
                                    },
                                    onError: () => {
                                        toast.error("Failed to save answer!");
                                    }
                                });
                            }}
                            variant={"outline"}
                        >
                            <Download className="mr-2" />
                            Save Answer
                        </Button>
                        <Button type="button" onClick={() => setOpen(false)}>
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Card className="relative col-span-3 overflow-hidden border border-gray-300 shadow bg-white">
                <CardHeader className="relative">
                    <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="p-2 bg-gray-200 rounded-xl shadow">
                            <Brain className="size-8 text-black" />
                        </div>
                        <div>
                            <span className="text-black">Ask GitWhiz AI</span>
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
                                onChange={e => setQuestion(e.target.value)}
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
        </>
    );
};

export default AskQuestionCard;
