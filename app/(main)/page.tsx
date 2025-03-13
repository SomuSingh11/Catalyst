import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Construction, Database, Layers, Lock, Sparkles, Code2, Palette, Bot, FileCode2, BookOpen, Trophy, History } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  const techStack = [
    { name: "Neon DB", icon: <Database className="h-6 w-6" />, description: "Serverless Postgres Database" },
    { name: "Next.js", icon: <Image src="/next.svg" width={24} height={24} alt="Next.js" />, description: "React Framework" },
    { name: "Tailwind CSS", icon: <Palette className="h-6 w-6" />, description: "Utility-first CSS Framework" },
    { name: "Clerk", icon: <Lock className="h-6 w-6" />, description: "Authentication & User Management" },
    { name: "Gemini AI", icon: <Bot className="h-6 w-6" />, description: "AI Language Model" },
    { name: "React Query", icon: <Layers className="h-6 w-6" />, description: "Data Synchronization" },
    { name: "Prisma", icon: <Database className="h-6 w-6" />, description: "ORM for TypeScript" },
    { name: "TypeScript", icon: <FileCode2 className="h-6 w-6" />, description: "Typed JavaScript" }
  ];
  const features = [
    { title: "Learn", icon: <BookOpen className="h-6 w-6" />, description: "Explore various topics", href: "/quizzy/quiz" },
    { title: "Challenge", icon: <Trophy className="h-6 w-6" />, description: "Test your knowledge", href: "/quizzy/quiz" },
    { title: "Track", icon: <History className="h-6 w-6" />, description: "Monitor progress", href: "/quizzy/history" },
  ];
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 overflow-hidden -mt-40">
      <div className="max-w-[600px] space-y-6">
        <div className="p-8 rounded-xl border bg-gradient-to-br from-background via-muted/5 to-muted/10 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-full bg-primary/10">
              <Construction className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Welcome to Quizzy!
            </h1>
          </div>
          <div className="space-y-6">
            <p className="text-lg leading-relaxed text-foreground/80 font-medium">
              Quizzy is an AI-powered quiz application that helps you test and improve your knowledge across various topics. 
              Create custom quizzes, track your progress, and challenge yourself with both multiple-choice and open-ended questions.
            </p>
            <div className="p-4 rounded-lg bg-muted/30 border border-primary/10">
              <p className="text-muted-foreground text-sm italic">
                Note: The rest of the website is currently under construction. More exciting features coming soon!
              </p>
            </div>
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Code2 className="h-4 w-4 mr-2" />
              Tech Stack
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="h-6 w-6 text-primary" />
                Technologies Powering Quizzy
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-6">
              {techStack.map((tech, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg border hover:bg-accent/50 transition-all">
                  <div className="p-2 rounded-lg bg-muted">
                    {tech.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold">{tech.name}</h4>
                    <p className="text-sm text-muted-foreground">{tech.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
