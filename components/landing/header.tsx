import { SignIn, SignUp } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "../ui/button";

export const SignUpModal = ({
  isOpen,
  onClose,
  type,
}: {
  isOpen: boolean;
  onClose: () => void;
  type: string | null;
}) => {
  if (!isOpen || !type) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl">
        {type === "sign-up" ? (
          <SignUp routing="hash" />
        ) : (
          <SignIn routing="hash" />
        )}
        <Button
          onClick={onClose}
          variant={"ghost"}
          className="text-gray-500 hover:text-black mt-1 w-full"
        >
          <p>Close</p>
        </Button>
      </div>
    </div>
  );
};

export default function LandingHeading() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [type, setType] = useState<string | null>(null);

  const handleStartLearningClick = () => {
    setIsSignUpModalOpen(true);
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header className={`sticky top-0 z-50 bg-[#FFFDF8]/95 backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Image src="/binaryIcon.svg" height={28} width={28} alt="logo" />
              <span className="text-2xl font-semibold text-black">
                Catalyst
              </span>
            </div>
            <nav className="hidden md:flex items-center space-x-8 font-medium">
              <a
                href="#features"
                className="text-gray-600 hover:text-black transition-all"
              >
                Features
              </a>
              <a
                href="#technology"
                className="text-gray-600 hover:text-black transition-all"
              >
                Technology
              </a>
              <a
                href="https://github.com/SomuSingh11/Catalyst"
                className="text-gray-600 hover:text-black transition-all"
              >
                Github
              </a>
              <a
                href="#connect"
                className="text-gray-600 hover:text-black transition-all"
              >
                Connect
              </a>

              <a
                href="https://somusblog.hashnode.dev/"
                className="text-gray-600 hover:text-black transition-all"
              >
                Blog
              </a>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <button
                className="text-gray-600 hover:text-black transition-colors"
                onClick={() => {
                  setType("sign-in");
                  handleStartLearningClick();
                }}
              >
                Log in
              </button>
              <button
                className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-300"
                onClick={() => {
                  setType("sign-up");
                  handleStartLearningClick();
                }}
              >
                Start learning
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <a
                  href="#features"
                  className="text-gray-600 hover:text-black transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#technology"
                  className="text-gray-600 hover:text-black transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Technology
                </a>
                <a
                  href="https://github.com/SomuSingh11/Catalyst"
                  className="text-gray-600 hover:text-black transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Github
                </a>
                <a
                  href="#connect"
                  className="text-gray-600 hover:text-black transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Connect
                </a>
                <a
                  href="https://somusblog.hashnode.dev/"
                  className="text-gray-600 hover:text-black transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Blog
                </a>
                <div className="pt-4 border-t border-gray-200">
                  <button
                    className="w-full bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-300"
                    onClick={() => handleStartLearningClick()}
                  >
                    Start learning
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
      <SignUpModal
        type={type}
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
      />
    </>
  );
}
