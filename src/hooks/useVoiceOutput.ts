"use client";

import {useState, useCallback} from "react";

interface UseVoiceOutputReturn {
  generateVoice: (text: string) => Promise<string>;
  isGenerating: boolean;
  error: string | null;
}

export const useVoiceOutput = (): UseVoiceOutputReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateVoice = useCallback(async (text: string): Promise<string> => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-voice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({text}),
      });

      if (!response.ok) {
        throw new Error("Voice generation failed");
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      return audioUrl;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return {
    generateVoice,
    isGenerating,
    error,
  };
};
