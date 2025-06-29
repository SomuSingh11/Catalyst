"use client";

import React, { useState, useEffect } from 'react';
import { ArrowRight, Github, BarChart3, Brain, CheckCircle, Star, Users, Menu, X, Bird} from 'lucide-react';
import LandingSection from '@/components/landing/tech-stack';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

const LandingPage = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Bird className="w-6 h-6" />,
      title: "GitWhiz",
      subtitle: "Repository Intelligence",
      description: "Analyze and visualize GitHub repositories with AI commit summaries, repository insights, and project dashboards.",
      benefits: [
      "AI-generated commit summaries",
      "Works with any public or private repo",
      "Ask AI questions about your codebase",
      "AI-powered project & file-level insights",
    ]
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI Quizzy",
      subtitle: "Smart Learning Platform",
      description: "Interactive AI-generated coding quizzes with progress tracking and personalized learning.",
       benefits: [
      "AI-generated MCQs & open-ended challenges",
      "Detailed reports: correct, incorrect, explanations",
    ]
    }
  ];


  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md transition-all duration-300 ${
        isScrolled ? 'border-b border-gray-200' : ''
      }`}>
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Image src="/binaryLogo.svg" height={28} width={28} alt="logo" />
              <span className="text-2xl font-bold text-black">Catalyst</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-12 font-semibold">
              <a
                href="#features"
                className="text-gray-700 hover:text-black transition-all duration-300 px-4 py-2 rounded-full hover:bg-gray-50 hover:shadow-md border border-transparent hover:border-gray-200 relative group"
              >
                <span className="relative z-10">Features</span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>

              <a
                href="#tech"
                className="text-gray-700 hover:text-black transition-all duration-300 px-4 py-2 rounded-full hover:bg-gray-50 hover:shadow-md border border-transparent hover:border-gray-200 relative group"
              >
                <span className="relative z-10">Technology</span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>

              <a
                href="#contact"
                className="text-gray-700 hover:text-black transition-all duration-300 px-4 py-2 rounded-full hover:bg-gray-50 hover:shadow-md border border-transparent hover:border-gray-200 relative group"
              >
                <span className="relative z-10">Contact</span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <button 
                className="text-gray-600 hover:text-black transition-colors"
                onClick={() => router.push("/sign-in")}
                >Log in</button>
              <button 
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                onClick={() => router.push("/sign-up")}
                >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-600 hover:text-black transition-colors">Features</a>
                <a href="#contact" className="text-gray-600 hover:text-black transition-colors">Contact</a>
                <div className="pt-4 border-t border-gray-200">
                  <button className="w-full text-left text-gray-600 hover:text-black transition-colors mb-2">Log in</button>
                  <button className="w-full bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

          {/* Hero Section */}
          <section className="relative py-20 lg:py-32 overflow-hidden min-h-screen">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

                      {/* Left Side - Text Content */}
                      <div className="text-center lg:text-left max-w-xl mx-auto lg:mx-0">
                          <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                              The AI productivity platform
                              <br />
                              <span className="text-gray-500">that works for you.</span>
                          </h1>
                          <p className="text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed">
                              One place where developers find every answer, automate the busywork, and accelerate their coding journey.
                          </p>
                          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                              <button 
                                className="bg-black text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                                onClick={() => router.push("/sign-up")}
                                >
                                  Get Catalyst free
                                  <ArrowRight className="w-5 h-5" />
                              </button>
                              <button 
                                className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-gray-400 transition-colors"
                                onClick={() => router.push("/sign-in")}
                                >
                                  Existing User?
                              </button>
                          </div>
                      </div>

                      {/* Right Side - GIF */}
                      <div className="flex justify-center lg:justify-end">
                          <img
                              src="/catalyst.gif" // Place your gif inside public folder
                              alt="Landing Animation"
                              className="w-72 h-72 lg:w-[500px] lg:h-[500px] object-contain"
                          />
                      </div>
                  </div>
              </div>

              {/* Floating elements */}
              <div className="absolute top-20 left-10 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center opacity-50">
                  <Github className="w-8 h-8 text-gray-400" />
              </div>
              <div className="absolute top-32 right-16 w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center opacity-60">
                  <Brain className="w-10 h-10 text-gray-400" />
              </div>
              <div className="absolute bottom-20 left-20 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center opacity-40">
                  <BarChart3 className="w-6 h-6 text-gray-400" />
              </div>
          </section>




      {/* Features Section */}
      <section id="features" className="py-20 lg:py-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Feature List */}
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-12">
                Everything you need to
                <br />
                <span className="text-gray-500">code smarter.</span>
              </h2>
              
              <div className="space-y-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                      activeFeature === index ? 'bg-black text-white' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveFeature(index)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${
                        activeFeature === index ? 'bg-white/20' : 'bg-white'
                      }`}>
                        <div className={activeFeature === index ? 'text-white' : 'text-black'}>
                          {feature.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold">{feature.title}</h3>
                          <span className={`text-sm px-2 py-1 rounded ${
                            activeFeature === index ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                          }`}>
                            New
                          </span>
                        </div>
                        <p className="text-sm font-medium mb-2 opacity-80">{feature.subtitle}</p>
                        <p className="opacity-70 mb-4">{feature.description}</p>
                        <ul className="space-y-1">
                          {feature.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm opacity-70">
                              <CheckCircle className="w-4 h-4" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Preview */}
            <div className="relative">
              <div className="bg-gray-900 rounded-2xl p-8 text-white min-h-[500px] flex flex-col justify-center">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    {features[activeFeature].icon}
                    <h3 className="text-2xl font-bold">{features[activeFeature].title}</h3>
                  </div>
                  <p className="text-gray-300 text-lg">{features[activeFeature].subtitle}</p>
                </div>
                
                {/* Mock Interface */}
                <div className="bg-gray-800 rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="text-gray-400 text-sm">
                      {activeFeature === 0 ? 'repository-insights.catalyst.dev' : 'quiz-platform.catalyst.dev'}
                    </div>
                  </div>
                  
                  {activeFeature === 0 ? (
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                      <div className="grid grid-cols-3 gap-4 mt-6">
                        <div className="bg-gray-700 h-20 rounded flex items-center justify-center">
                          <BarChart3 className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="bg-gray-700 h-20 rounded flex items-center justify-center">
                          <Users className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="bg-gray-700 h-20 rounded flex items-center justify-center">
                          <Star className="w-6 h-6 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-green-400 text-sm">Question 1 of 10</div>
                      <div className="text-lg font-medium">What is the time complexity of binary search?</div>
                      <div className="space-y-2">
                        <div className="bg-gray-700 p-3 rounded cursor-pointer hover:bg-gray-600">A) O(n)</div>
                        <div className="bg-green-600 p-3 rounded">B) O(log n) ✓</div>
                        <div className="bg-gray-700 p-3 rounded cursor-pointer hover:bg-gray-600">C) O(n²)</div>
                        <div className="bg-gray-700 p-3 rounded cursor-pointer hover:bg-gray-600">D) O(1)</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Used Section */}
         <section id="tech">
             <LandingSection
              title="Powered by modern web technologies"
              subtitle="trusted by developers worldwide."
              description="Catalyst is built with battle-tested, scalable tools — giving you the performance and flexibility you deserve."
              techStack={[
                  { name: "Next.js", icon: "/icons/next.svg" },
                  { name: "Gemini", icon: "/icons/gemini.svg" },
                  { name: "Clerk Auth", icon: "/icons/clerk.png" },
                  { name: "TypeScript", icon: "/icons/ts.svg" },
                  { name: "Langchain", icon: "/icons/langchain.svg" },
                  { name: "tRPC", icon: "/icons/trpc.svg" },
                  { name: "NeonDB", icon: "/icons/neondb.svg" },
                  { name: "Prisma", icon: "/icons/prisma.svg" },
                  { name: "Tailwind CSS", icon: "/icons/tailwind.svg" },
                  { name: "Vercel", icon: "/icons/vercel.svg" },
              ]}
          />
         </section>





          {/* Footer */}
          <footer id="contact" className="bg-white border-t border-gray-200 py-10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">

                  {/* Left - Logo & Description */}
                  <div className="flex flex-col items-center md:items-start text-center md:text-left">
                      <div className="flex items-center space-x-2 mb-2">
                          <Image src="/binaryLogo.svg" height={20} width={20} alt="logo" />
                          <span className="text-xl font-bold text-black">Catalyst</span>
                      </div>
                      <p className="text-gray-600 text-sm">
                          AI-powered productivity tools for developers.
                      </p>
                      <p className="text-gray-500 text-xs mt-2">
                          © 2025 Catalyst 
                      </p>
                  </div>

                  {/* Right - Social Links */}
                  <div className="flex items-center space-x-6">
                    <a href="https://github.com/SomuSingh11" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black transition-colors">
                          <Image src="/icons/github.svg" height={25} width={25} alt="github" />
                      </a>
                      <a href="https://x.com/SomuSingh_" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black transition-colors">
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1227" className="w-6 h-6 fill-current">
                              <path d="M714.3 550.6L1176 0H1070.3L667.2 481.3 340.8 0H0L487.5 703.4 0 1227h105.7l424.7-495.4 343.4 495.4H1200L714.3 550.6zM588.9 677.9l-49-70.1L169 82.3h128.5l316.7 451.5 49 70.1 379.8 542.7H914.2L588.9 677.9z" />
                          </svg>
                      </a>
                      <a href="https://www.linkedin.com/in/somusingh11/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black transition-colors">
                          <Image src="/icons/linkdin.svg" height={25} width={25} alt="linkdin" />
                      </a>
                      <a href="https://devfolio.co/@K4ge" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black transition-colors">
                          <Image src="/icons/devfolio.svg" height={25} width={25} alt="devfolio" />
                      </a>
                      <Avatar>
                          <AvatarImage src="https://avatars.githubusercontent.com/u/170082343?s=96&v=4" alt="@shadcn" />
                      </Avatar>
                  </div>

              </div>
          </footer>

    </div>
  );
};

export default LandingPage;