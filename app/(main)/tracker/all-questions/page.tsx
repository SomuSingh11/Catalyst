"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const questions = useState(null);
  useEffect(() => {
    const fetcher = async () => {
      try {
        const data = await fetch("http://localhost:3000/api/questions");
        const response = data.json();
        console.table(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetcher();
  }, []);
  return (
    <div className="p-4  rounded-lg">
      <h1 className="text-xl font-bold text-center">
        Your Progress Tracked Right here
      </h1>
      <div className="w-full bg-gray-300 rounded-lg mt-2">
        <div className="bg-green-500 h-6 rounded-lg">Hi</div>
      </div>
      {/* <LeetCodeTable /> */}
    </div>
  );
}
