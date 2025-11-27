"use client";

import React from "react";
import LandingHeading from "@/components/landing/header";
import Footer from "@/components/landing/footer";
import LandingTechStack from "@/components/landing/technology";
import HeroSection from "@/components/landing/hero";
import GitWhizMockSection from "@/components/landing/gitwhiz-mock";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#FFFDF8] text-gray-900">
      <LandingHeading />
      <HeroSection />

      <GitWhizMockSection />

      <LandingTechStack
        title="The engine behind the intelligence"
        subtitle="speed, safety, and scalability."
        description="Crafted with the best tools in the ecosystem to provide you with a fast, type-safe, and incredibly powerful platform."
        techStack={[
          { name: "Next.js", icon: "/icons/next.svg" },
          { name: "Gemini", icon: "/icons/gemini.svg" },
          { name: "Clerk Auth", icon: "/icons/clerk.png" },
          { name: "TypeScript", icon: "/icons/ts.svg" },
          { name: "tRPC", icon: "/icons/trpc.svg" },
          { name: "NeonDB", icon: "/icons/neondb.svg" },
          { name: "Prisma", icon: "/icons/prisma.svg" },
          { name: "Tailwind CSS", icon: "/icons/tailwind.svg" },
          { name: "Render", icon: "/icons/render.svg" },
        ]}
      />
      <Footer />
    </div>
  );
};

export default LandingPage;
