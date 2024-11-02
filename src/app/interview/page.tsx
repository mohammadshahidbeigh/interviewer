"use client";

import { useState } from "react";
import Link from "next/link";
import { FaMicrophone, FaStop } from "react-icons/fa";

export default function InterviewPage() {
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentQuestion] = useState(1);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing] = useState(false);
  const [feedback] = useState("");
  const totalQuestions = 7;

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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Interview in Progress</h2>
              <div className="text-gray-600">
                Question {currentQuestion} of {totalQuestions}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
              ></div>
            </div>

            {/* Current Question Display */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl mb-4">
                Tell me about your experience with React...
              </h3>
            </div>

            {/* AI Voice Visualization */}
            <div className="flex flex-col items-center justify-center mb-8">
              <div
                className={`w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center mb-4 ${
                  isPaused ? "opacity-50" : "animate-pulse"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </div>

              {/* Recording Status */}
              {isListening && (
                <div className="text-green-600 mb-4 animate-pulse">
                  Listening...
                </div>
              )}
              {isProcessing && (
                <div className="text-blue-600 mb-4">Processing response...</div>
              )}
              {feedback && (
                <div className="text-gray-600 mb-4 text-center">{feedback}</div>
              )}

              {/* Voice Recording Controls */}
              <div className="mb-6">
                <button
                  onClick={() => setIsListening(!isListening)}
                  className={`p-6 rounded-full ${
                    isListening
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white transition-colors`}
                >
                  {isListening ? (
                    <FaStop className="h-6 w-6" />
                  ) : (
                    <FaMicrophone className="h-6 w-6" />
                  )}
                </button>
              </div>

              {/* Interview Controls */}
              <div className="flex gap-4">
                {isPaused ? (
                  <button
                    onClick={() => setIsPaused(false)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Resume Interview
                  </button>
                ) : (
                  <button
                    onClick={() => setIsPaused(true)}
                    className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    Pause Interview
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsPaused(false);
                    setIsInterviewStarted(false);
                  }}
                  className="px-6 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  End Interview
                </button>
              </div>
            </div>

            {currentQuestion === totalQuestions && (
              <div className="text-center bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">
                  Thank you for participating!
                </h3>
                <div className="flex gap-4 justify-center">
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    View Summary
                  </button>
                  <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Start New Interview
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
