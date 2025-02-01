"use client";

import Link from "next/link";

export default function TrackerLandingPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-5">
        <h1 className="text-4xl md:text-5xl font-bold">
          Track Your Progress Effortlessly
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-800 max-w-2xl">
          Keep an eye on your coding journey with topic tracking, pattern
          analytics, and company-wise insights.
        </p>
        <Link href="/tracker/dashboard">
          <button className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold transition">
            Start Tracking
          </button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-16 px-5 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          title="📌 Topic Tracking"
          description="Monitor your progress in Data Structures, Algorithms, and more."
        />
        <FeatureCard
          title="🔍 Pattern Insights"
          description="Recognize coding patterns like Sliding Window, Two Pointers, and DP."
        />
        <FeatureCard
          title="🏢 Company-Wise Analysis"
          description="Prepare for interviews with company-specific problem tracking."
        />
      </section>

      {/* Call to Action Section */}
      <section className="bg-blue-600 text-center py-12 px-5">
        <h2 className="text-3xl font-bold">Ready to Level Up?</h2>
        <p className="text-lg mt-2">
          Start tracking your progress now and ace your coding interviews.
        </p>
        <Link href="/tracker/dashboard">
          <button className="mt-4 bg-white text-blue-600 px-6 py-3 rounded-lg text-lg font-semibold transition hover:bg-gray-200">
            Get Started
          </button>
        </Link>
      </section>
      {/* Call to Action Section */}
      <section className="bg-blue-600 text-center py-12 px-5">
        <h2 className="text-3xl font-bold">Ready to Level Up?</h2>
        <p className="text-lg mt-2">
          Start tracking your progress now and ace your coding interviews.
        </p>
        <Link href="/tracker/dashboard">
          <button className="mt-4 bg-white text-blue-600 px-6 py-3 rounded-lg text-lg font-semibold transition hover:bg-gray-200">
            Get Started
          </button>
        </Link>
      </section>
    </main>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-gray-300 mt-2">{description}</p>
    </div>
  );
}
