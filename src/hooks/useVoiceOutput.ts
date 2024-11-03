"use client";

import {useState, useCallback} from "react";
import {ERROR_MESSAGES, TIMEOUTS} from "@/utils/constants";

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
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        TIMEOUTS.VOICE_GENERATION_TIMEOUT
      );

      const response = await fetch("/api/deepgramTTS", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({text}),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(ERROR_MESSAGES.VOICE_GENERATION_FAILED);
      }

      const audioBlob = await response.blob();
      return URL.createObjectURL(audioBlob);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : ERROR_MESSAGES.NETWORK_ERROR;
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
