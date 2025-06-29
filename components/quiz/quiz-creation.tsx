"use client";

import React from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { quizCreationSchema } from "@/schemas/form/quiz";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";

import { Input } from "@/components/ui/input";
import { BookOpen, CopyCheck, Loader2, Send, Sparkles } from "lucide-react";
import { Separator } from "../ui/separator";
import axios from "axios";
import { useRouter } from "next/navigation";
import LoadingQuestions from "./loading-questions";

type Input = z.infer<typeof quizCreationSchema>;

export default function QuizCreation() {
  const router = useRouter();
  const [showLoader, setShowLoader] = React.useState<boolean>(false);
  const [finished, setFinished] = React.useState<boolean>(false);
  // Function that executes the mutation
  const createQuiz = async ({ amount, topic, type }: Input) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/quizzy/create-quiz`,
      {
        amount,
        topic,
        type,
      }
    );
    return response.data;
  };

  const { mutate: getQuestions, isPending: isChecking } = useMutation({
    mutationFn: createQuiz,
  });

  const form = useForm<Input>({
    resolver: zodResolver(quizCreationSchema),
    defaultValues: {
      amount: 3,
      topic: "",
      type: "open_ended",
    },
  });

  function onSubmit(values: Input) {
    setShowLoader(true);
    getQuestions(
      {
        amount: values.amount,
        topic: values.topic,
        type: values.type,
      },
      {
        onSuccess: ({ quizzyId }) => {
          setFinished(true);
          setTimeout(() => {
            if (form.getValues("type") == "open_ended") {
              router.push(`/quizzy/quiz/open-ended/${quizzyId}`);
            } else {
              router.push(`/quizzy/quiz/mcq/${quizzyId}`);
            }
          }, 1000)
        },
        onError: (error) => {
          setShowLoader(false);
          console.log(error);
        },
      }
    );
  }

  form.watch();

  if(showLoader) {
    return <LoadingQuestions finished={finished}/>
  }

  return (
 <div className="">
  <Card className="relative col-span-3 overflow-hidden border border-gray-300 shadow-xl bg-white dark:bg-sidebar">
    
    {/* Card Header */}
    <CardHeader className="relative">
      <CardTitle className="flex items-center gap-3 text-2xl">
        <div className="p-3 bg-gray-200 rounded-xl shadow">
          <BookOpen className="size-8 text-black" />
        </div>
        <div>
          <span className="text-black">Quiz Generator</span>
          <div className="flex items-center gap-1 mt-1">
            <CopyCheck className="size-4 text-gray-600" />
            <span className="text-sm font-normal text-gray-600">
              AI-powered quiz creation
            </span>
          </div>
        </div>
      </CardTitle>
    </CardHeader>

    {/* Card Content */}
    <CardContent className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          {/* Topic Input */}
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-gray-800">Quiz Topic</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Machine Learning, History..."
                    {...field}
                    className="text-base py-3"
                  />
                </FormControl>
                <FormDescription>Select a topic for your quiz.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Quick Suggestions */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Sparkles className="size-4 text-gray-700" />
              Quick Suggestions:
            </div>
            <div className="flex flex-wrap gap-2">
              {["Web Development", "Artificial Intelligence", "Data Structures", "Aptitude", "Operating Systems"].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => form.setValue("topic", suggestion)}
                  className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-black rounded-full transition-all duration-200 border border-gray-300"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Amount Input */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-gray-800">Number of Questions</FormLabel>
                <FormControl>
                  <Input
                    placeholder="1 - 20"
                    {...field}
                    type="number"
                    min={1}
                    max={20}
                    onChange={(e) => form.setValue("amount", parseInt(e.target.value))}
                    className="text-base py-3"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Type Selection */}
          <div className="flex justify-between border border-gray-300 rounded-xl overflow-hidden">
            <Button
              className="w-1/2 rounded-none rounded-l-xl h-14 text-base"
              type="button"
              variant={form.getValues("type") === "mcq" ? "default" : "secondary"}
              onClick={() => form.setValue("type", "mcq")}
            >
              <CopyCheck className="mr-2" />
              Multiple Choice
            </Button>
            <Separator orientation="vertical" />
            <Button
              className="w-1/2 rounded-none rounded-r-xl h-14 text-base"
              type="button"
              variant={form.getValues("type") === "open_ended" ? "default" : "secondary"}
              onClick={() => form.setValue("type", "open_ended")}
            >
              <BookOpen className="mr-2" />
              Open Ended
            </Button>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isChecking}
            className="w-full h-14 text-lg font-semibold mt-2"
          >
            {isChecking ? (
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin" />
                Generating Quiz...
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Send className="h-4 w-4" />
                Create Quiz
              </div>
            )}
          </Button>
        </form>
      </Form>
    </CardContent>
  </Card>
</div>



  );
}
