"use client";

import Link from "next/link";
import {FaMicrophone} from "react-icons/fa";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-73px)] gap-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold mb-4">Welcome to AI Interviewer</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
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
          className="rounded-full animate-pulse"
        />
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
          <FaMicrophone className="text-2xl" />
          <p className="text-lg">
            Click Start and speak naturally - I&apos;ll listen and respond
          </p>
        </div>

        <Link
          href="/interview"
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          Start Interview
          <FaMicrophone className="text-lg" />
        </Link>
      </div>
    </div>
  );
}
