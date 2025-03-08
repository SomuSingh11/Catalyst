import QuizCreation from "@/components/quiz/quiz-creation";
import React from "react";

export const metadata = {
  title: "Quizzy | Quiz",
};

function Page() {
  return (
    <div className="md:mt-64 mt-16">
      <QuizCreation />
    </div>
  );
}

export default Page;
