"use client";

import React from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { quizCreationSchema } from "@/schemas/form/quiz";

import {
  Card,
  CardContent,
  CardDescription,
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
import { BookOpen, CopyCheck, Loader2, Send } from "lucide-react";
import { Separator } from "../ui/separator";
import { BorderBeam } from "../magicui/border-beam";
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
    <div>
      <Card className="relative dark:bg-sidebar p-2">
        <CardHeader>
          <CardTitle className="font-bold text-2xl">Quiz Creation</CardTitle>
          <CardDescription>Choose a topic</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a Topic..." {...field} />
                    </FormControl>
                    <FormDescription>Please provide a topic.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Questions</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter an amount..."
                        {...field}
                        type="number"
                        min={1}
                        max={20}
                        onChange={(e) => {
                          form.setValue("amount", parseInt(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Button
                  className="w-1/2 rounded-none rounded-l-lg"
                  type="button"
                  variant={
                    form.getValues("type") === "mcq" ? "default" : "secondary"
                  }
                  onClick={() => {
                    form.setValue("type", "mcq");
                  }}
                >
                  <CopyCheck className="m-4 h-4 mr-2" />
                  Multiple Choice
                </Button>
                <Separator orientation="vertical" />
                <Button
                  className="w-1/2 rounded-none rounded-r-lg"
                  type="button"
                  variant={
                    form.getValues("type") === "open_ended"
                      ? "default"
                      : "secondary"
                  }
                  onClick={() => {
                    form.setValue("type", "open_ended");
                  }}
                >
                  <BookOpen className="m-4 h-4 mr-2" />
                  Open Ended
                </Button>
              </div>
              <Button 
                type="submit"
                disabled={isChecking}
                >
                  {isChecking ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin"/>
                    <span>Fetching questions!...</span>
                  </div>
                  ) : (
                  <div className="flex items-center gap-2">
                    <span>Submit</span>
                    <Send className="h-3 w-3"/>
                  </div>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <BorderBeam
          duration={6}
          size={100}
          className="from-transparent via-red-500 dark:via-red-200 to-transparent"
        />
        <BorderBeam
          duration={6}
          delay={3}
          size={100}
          className="from-transparent via-blue-500 dark:via-blue-200 to-transparent"
        />
      </Card>
    </div>
  );
}
