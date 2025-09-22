"use client";
import React from "react";

import useProject from "@/hooks/use-project";
import { askQuestion } from "@/lib/actions/askQuestion";
import { readStreamableValue } from "ai/rsc";

import ResultDialog from "./askQuestion/result-dialog";
import GitwhizCard from "./askQuestion/gitWhizCard";

const AskQuestionCard = () => {
  const { project } = useProject();
  const [question, setQuestion] = React.useState<string>("");
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [filesReferences, setFilesReferences] = React.useState<
    { fileName: string; sourceCode: string; summary: string }[]
  >([]);
  const [answer, setAnswer] = React.useState<string>("");

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
      if (delta) setAnswer((ans) => ans + delta);
    }

    setLoading(false);
  };

  return (
    <>
      <ResultDialog
        projectId={project?.id || ""}
        isOpen={open}
        setOpen={setOpen}
        loading={loading}
        question={question}
        answer={answer}
        filesReferences={filesReferences}
      />

      <GitwhizCard
        loading={loading}
        onSubmit={onSubmit}
        question={question}
        setQuestion={setQuestion}
      />
    </>
  );
};

export default AskQuestionCard;
