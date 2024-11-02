"use client";

import {useState} from "react";
import Link from "next/link";

export default function InterviewPage() {
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);

  return (
    <div className="min-h-[calc(100vh-73px)] p-8">
      {!isInterviewStarted ? (
        <div className="flex flex-col items-center justify-center h-full gap-8">
          <div className="text-center max-w-2xl">
            <h1 className="text-3xl font-bold mb-4">
              Ready to Begin Your Interview?
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              You&apos;ll be asked questions and can respond verbally. The AI
              interviewer will provide feedback and follow-up questions based on
              your responses.
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setIsInterviewStarted(true)}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Interview
            </button>
            <Link
              href="/"
              className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Go Back
            </Link>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Interview in Progress
            </h2>
            {/* Question Display Component will go here */}
            {/* Voice Recording Component will go here */}
            {/* Interview Controls Component will go here */}
          </div>
          <button
            onClick={() => setIsInterviewStarted(false)}
            className="px-6 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            End Interview
          </button>
        </div>
      )}
    </div>
  );
}
