import { BentoDemo } from "@/components/quiz/dashboard";

export const metadata = {
  title: "Quizzly",
};

export default function Page() {
  return (
    <div className="h-full flex items-center justify-center lg:mt-10">
      <div className="max-w-7xl px-6">
        <BentoDemo />
      </div>
    </div>
  );
}
