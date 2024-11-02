"use client";

import {FC} from "react";

interface VoiceOutputProps {
  audioUrl: string;
}

const VoiceOutput: FC<VoiceOutputProps> = ({audioUrl}) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold mb-4">AI Response</h3>
      <audio controls src={audioUrl} className="w-full">
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default VoiceOutput;
