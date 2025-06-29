export const metadata = {
  title: "Quizzy",
};

const QuizLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <main className="h-full flex items-center justify-center">
        {children}
      </main>
    </div>
  );
};

export default QuizLayout;
