"use client";

import {FC, useEffect, useRef, useState} from "react";

interface VoiceOutputProps {
  audioUrl: string;
}

const VoiceOutput: FC<VoiceOutputProps> = ({audioUrl}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      setIsLoading(true);
      setError(null);

      // Wait for audio to be loaded before attempting to play
      const handleCanPlay = () => {
        setIsLoading(false);
        audioRef.current?.play().catch((error) => {
          console.error("Error playing audio:", error);
          setError("Failed to play audio response");
        });
      };

      const handleError = (e: Event) => {
        console.error("Audio loading error:", e);
        setError("Failed to load audio response");
        setIsLoading(false);
      };

      audioRef.current.addEventListener("canplay", handleCanPlay);
      audioRef.current.addEventListener("error", handleError);

      // Load the new audio URL
      audioRef.current.load();

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener("canplay", handleCanPlay);
          audioRef.current.removeEventListener("error", handleError);
        }
      };
    }
  }, [audioUrl]);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold mb-4">AI Response</h3>
      {isLoading && (
        <div className="text-gray-600 dark:text-gray-400 mb-2">
          Loading audio response...
        </div>
      )}
      {error && (
        <div className="text-red-600 dark:text-red-400 mb-2">{error}</div>
      )}
      <audio
        ref={audioRef}
        controls
        src={audioUrl}
        className="w-full"
        preload="auto"
      >
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default VoiceOutput;
