"use client";

import {FC, useEffect, useRef, useState} from "react";
import {FaPlay, FaPause} from "react-icons/fa";

interface VoiceOutputProps {
  audioUrl: string;
}

const VoiceOutput: FC<VoiceOutputProps> = ({audioUrl}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      setIsLoading(true);
      setError(null);

      const handleCanPlay = () => {
        setIsLoading(false);
        audio.play().catch((error) => {
          console.error("Error playing audio:", error);
          setError("Failed to play audio response");
        });
      };

      const handleError = (e: Event) => {
        console.error("Audio loading error:", e);
        setError("Failed to load audio response");
        setIsLoading(false);
      };

      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => setIsPlaying(false);

      audio.addEventListener("canplay", handleCanPlay);
      audio.addEventListener("error", handleError);
      audio.addEventListener("play", handlePlay);
      audio.addEventListener("pause", handlePause);
      audio.addEventListener("ended", handleEnded);

      audio.load();

      return () => {
        audio.removeEventListener("canplay", handleCanPlay);
        audio.removeEventListener("error", handleError);
        audio.removeEventListener("play", handlePlay);
        audio.removeEventListener("pause", handlePause);
        audio.removeEventListener("ended", handleEnded);
      };
    }
  }, [audioUrl]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  return (
    <div className="p-6 mb-6">
      <div className="flex items-center justify-center mb-4 relative">
        {/* AI Avatar Circle */}
        <div
          className={`w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center cursor-pointer relative ${
            isPlaying ? "animate-pulse" : ""
          }`}
          onClick={togglePlayPause}
        >
          {/* Ripple Effect */}
          {isPlaying && (
            <>
              <div className="absolute inset-0 rounded-full bg-blue-500 opacity-25">
                <div className="w-full h-full animate-ping" />
              </div>
              <div className="absolute inset-0 rounded-full bg-purple-500 opacity-25">
                <div className="w-full h-full animate-pulse" />
              </div>
            </>
          )}

          {/* Play/Pause Icon */}
          <div className="relative z-10">
            {isPlaying ? (
              <FaPause className="text-white w-6 h-6" />
            ) : (
              <FaPlay className="text-white w-6 h-6 ml-1" />
            )}
          </div>
        </div>

        {/* Audio Waves */}
        {isPlaying && (
          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 flex justify-center gap-1 h-4">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="w-1 rounded-full bg-gradient-to-t from-blue-500 via-purple-500 to-pink-500"
                style={{
                  animationName: "bounce",
                  animationDuration: `${0.5 + Math.random() * 0.5}s`,
                  animationTimingFunction: "ease",
                  animationIterationCount: "infinite",
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Status Messages */}
      <div className="text-center">
        {isLoading && (
          <div className="text-gray-600 dark:text-gray-400 animate-pulse">
            Loading AI response...
          </div>
        )}
        {error && <div className="text-red-600 dark:text-red-400">{error}</div>}
        {isPlaying && (
          <div className="text-blue-600 dark:text-blue-400 animate-pulse"></div>
        )}
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={audioUrl} className="hidden" preload="auto" />
    </div>
  );
};

export default VoiceOutput;
