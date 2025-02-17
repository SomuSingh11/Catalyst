const QuizLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <main className="h-full flex items-center justify-center md:mt-10">
        {children}
      </main>
    </div>
  );
};

export default QuizLayout;
