"use client";

import {FC} from "react";

interface TranscriptDisplayProps {
  transcription: string;
}

const TranscriptDisplay: FC<TranscriptDisplayProps> = ({transcription}) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold mb-2">Your Answer Transcript:</h3>
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {transcription}
        </p>
      </div>
    </div>
  );
};

export default TranscriptDisplay;
