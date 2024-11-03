"use client";

import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-73px)] gap-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Welcome to AI Interviewer
        </h1>
        <p className="text-lg text-gray-300">
          Practice your interview skills with our AI-powered interviewer. Get
          real-time feedback and improve your responses in a stress-free
          environment.
        </p>
      </div>
      <div className="relative w-32 h-32 mb-4">
        <Image
          src="/vercel.svg"
          alt="AI Interviewer Avatar"
          fill
          className="rounded-full animate-pulse bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500"
        />
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-3 text-gray-300">
          <p className="text-lg">
            Click Start and speak naturally - I&apos;ll listen and respond
          </p>
        </div>

        <Link
          href="/interview"
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors flex items-center gap-2 shadow-lg"
        >
          Start Interview
        </Link>
      </div>
    </div>
  );
}
