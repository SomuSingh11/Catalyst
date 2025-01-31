import Navbar from "@/components/quiz/quiz-nav";

const QuizLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div>
        <Navbar />
      </div>

      <main>{children}</main>
    </div>
  );
};

export default QuizLayout;
