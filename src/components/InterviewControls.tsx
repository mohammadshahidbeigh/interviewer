"use client";

import {FC} from "react";

interface InterviewControlsProps {
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onEnd: () => void;
  isStarted: boolean;
  isPaused: boolean;
}

const InterviewControls: FC<InterviewControlsProps> = ({
  onStart,
  onPause,
  onResume,
  onEnd,
  isStarted,
  isPaused,
}) => {
  return (
    <div className="flex gap-4 justify-center">
      {!isStarted ? (
        <button
          onClick={onStart}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Start Interview
        </button>
      ) : (
        <>
          {isPaused ? (
            <button
              onClick={onResume}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Resume Interview
            </button>
          ) : (
            <button
              onClick={onPause}
              className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Pause Interview
            </button>
          )}
          <button
            onClick={onEnd}
            className="px-6 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            End Interview
          </button>
        </>
      )}
    </div>
  );
};

export default InterviewControls;
