import Image from "next/image";
import { Avatar, AvatarImage } from "../ui/avatar";

export default function Footer() {
  return (
    <footer id="connect" className="bg-white border-t border-gray-200 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center space-x-2 mb-2">
            <Image src="/binaryLogo.svg" height={20} width={20} alt="logo" />
            <span className="text-xl font-bold text-black">Catalyst</span>
          </div>
          <p className="text-gray-600 text-sm">
            AI-powered productivity tools for developers.
          </p>
          <p className="text-gray-500 text-xs mt-2">© 2025 Catalyst</p>
        </div>

        <div className="flex items-center space-x-6">
          <a
            href="https://github.com/SomuSingh11"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-black transition-colors"
          >
            <Image
              src="/icons/github.svg"
              height={25}
              width={25}
              alt="github"
            />
          </a>
          <a
            href="https://x.com/SomuSingh_"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-black transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 1227"
              className="w-6 h-6 fill-current"
            >
              <path d="M714.3 550.6L1176 0H1070.3L667.2 481.3 340.8 0H0L487.5 703.4 0 1227h105.7l424.7-495.4 343.4 495.4H1200L714.3 550.6zM588.9 677.9l-49-70.1L169 82.3h128.5l316.7 451.5 49 70.1 379.8 542.7H914.2L588.9 677.9z" />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/somusingh11/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-black transition-colors"
          >
            <Image
              src="/icons/linkdin.svg"
              height={25}
              width={25}
              alt="linkdin"
            />
          </a>
          <a
            href="https://devfolio.co/@K4ge"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-black transition-colors"
          >
            <Image
              src="/icons/devfolio.svg"
              height={25}
              width={25}
              alt="devfolio"
            />
          </a>
          <Avatar>
            <AvatarImage
              src="https://avatars.githubusercontent.com/u/170082343?s=96&v=4"
              alt="@shadcn"
            />
          </Avatar>
        </div>
      </div>
    </footer>
  );
}
