"use client";

import {FC} from "react";
import {FaMicrophone, FaStop} from "react-icons/fa";
import Link from "next/link";

interface InterviewControlsProps {
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onEnd: () => void;
  onRecordingToggle: () => void;
  isStarted: boolean;
  isPaused: boolean;
  isListening: boolean;
  isProcessing: boolean;
  isCompleted: boolean;
  questionCount: number;
  totalQuestions: number;
  isGenerating?: boolean;
}

const InterviewControls: FC<InterviewControlsProps> = ({
  onStart,
  onPause,
  onResume,
  onEnd,
  onRecordingToggle,
  isStarted,
  isPaused,
  isListening,
  isProcessing,
  isCompleted,
  questionCount,
  totalQuestions,
  isGenerating,
}) => {
  if (!isStarted) {
    return (
      <div
        className="flex flex-col items-center justify-center h-full gap-8"
        role="region"
        aria-label="Interview Start Screen"
      >
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Ready to Begin Your Interview?
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed">
            You&apos;ll be asked questions through voice and can respond
            verbally. The AI interviewer will provide feedback and follow-up
            questions based on your responses.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            {/* Feature indicators */}
            <div className="flex items-center text-sm text-gray-300">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Voice Interaction
            </div>
            <div className="flex items-center text-sm text-gray-300">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Real-time Feedback
            </div>
          </div>
        </div>
        <div className="flex gap-6">
          <button
            onClick={onStart}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl font-medium flex items-center"
            aria-label="Start the interview"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Proceed with the Interview
          </button>
          <Link
            href="/"
            className="px-8 py-4 border-2 border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-all transform hover:scale-105 font-medium flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="max-w-4xl mx-auto"
      role="region"
      aria-label="Interview Controls"
    >
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-200">
            Interview in Progress
          </h2>
          <div className="flex items-center gap-2">
            <span
              className="px-3 py-1 bg-blue-900/50 text-blue-200 rounded-full font-medium"
              role="status"
              aria-label={`Question ${questionCount} of ${totalQuestions}`}
            >
              Question {questionCount} of {totalQuestions}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        className="w-full bg-gray-700 rounded-full h-2.5 mb-6"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={(questionCount / totalQuestions) * 100}
        aria-label="Interview progress"
      >
        <div
          className="bg-blue-500 h-2.5 rounded-full"
          style={{width: `${(questionCount / totalQuestions) * 100}%`}}
        ></div>
      </div>

      {/* AI Generation Status */}
      {isGenerating && (
        <div
          className="flex items-center justify-center mb-4"
          role="status"
          aria-live="polite"
        >
          <div
            className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"
            aria-hidden="true"
          ></div>
          <span className="ml-3 text-blue-400">Generating AI response...</span>
        </div>
      )}

      {/* Voice Recording Controls */}
      <div
        className="flex flex-col items-center justify-center mb-8"
        role="region"
        aria-label="Voice Recording Controls"
      >
        <button
          onClick={onRecordingToggle}
          disabled={isPaused || isProcessing}
          className={`w-20 h-20 rounded-full ${
            isListening ? "bg-red-600 animate-pulse" : "bg-blue-600"
          } flex items-center justify-center mb-4 shadow-lg`}
          aria-label={isListening ? "Stop recording" : "Start recording"}
          aria-pressed={isListening}
        >
          {isListening ? (
            <FaStop className="h-8 w-8" aria-hidden="true" />
          ) : (
            <FaMicrophone className="h-8 w-8" aria-hidden="true" />
          )}
        </button>

        {/* Recording Status */}
        <div role="status" aria-live="polite">
          {isListening && (
            <div className="text-green-400 mb-4 animate-pulse">
              Listening to your answer...
            </div>
          )}
          {isProcessing && (
            <div className="text-blue-400 mb-4">Processing response...</div>
          )}
        </div>

        {/* Interview Controls */}
        <div className="flex gap-4 mt-4">
          {isPaused ? (
            <button
              onClick={onResume}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              aria-label="Resume interview"
            >
              Resume Interview
            </button>
          ) : (
            <button
              onClick={onPause}
              className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              aria-label="Pause interview"
            >
              Pause Interview
            </button>
          )}
          <button
            onClick={onEnd}
            className="px-6 py-2 text-red-400 border border-red-600 rounded-lg hover:bg-red-900/20 transition-colors"
            aria-label="End interview"
          >
            End Interview
          </button>
        </div>
      </div>

      {isCompleted && (
        <div
          className="text-center bg-green-900/20 p-6 rounded-lg border border-green-500"
          role="alert"
          aria-live="polite"
        >
          <h3 className="text-xl font-semibold mb-4 text-green-400">
            Interview completed successfully!
          </h3>
          <div className="flex gap-4 justify-center">
            <button
              onClick={onEnd}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              aria-label="Start new interview"
            >
              Start New Interview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewControls;
