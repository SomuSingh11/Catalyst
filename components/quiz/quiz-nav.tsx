// import { currentProfile } from "@/lib/current-profile";
import { Frame } from "lucide-react";
import Link from "next/link";
import React from "react";

const Navbar = async () => {
  // const currProfile = await currentProfile();

  return (
    <>
      <div className="border-b border-zinc-300 py-2 ">
        <div className="flex items-center justify-between h-full gap-2 mx-auto">
          {/* Logo */}
          <Link href={"/"} className="flex items-center gap-2 ">
            <p className="rounded-lg border-2 border-b-4 border-r-4 border-black px-2 py-1 text-xl font-bold transition-all hover:-translate-y-[2px] md:block dark:border-white">
              <Frame className="inline" />
              Prep with Quizzly !!!
            </p>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;

// Currently not used anywhere
