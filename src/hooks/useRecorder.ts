"use client";

import {useState, useRef, useCallback} from "react";
import {AUDIO_CONFIG, ERROR_MESSAGES, TIMEOUTS} from "@/utils/constants";

interface UseAudioRecorderReturn {
  isRecording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  audioBlob: Blob | null;
  error: string | null;
}

export const useAudioRecorder = (): UseAudioRecorderReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  }, [isRecording]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({audio: true});
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: AUDIO_CONFIG.MIME_TYPE,
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: AUDIO_CONFIG.MIME_TYPE,
        });
        setAudioBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError(null);

      // Set maximum recording duration
      timeoutRef.current = setTimeout(() => {
        if (isRecording) {
          stopRecording();
        }
      }, TIMEOUTS.RECORDING_MAX_DURATION);
    } catch (err) {
      setError(ERROR_MESSAGES.MICROPHONE_ACCESS);
      console.error("Error accessing microphone:", err);
    }
  }, [isRecording, stopRecording]);

  return {
    isRecording,
    startRecording,
    stopRecording,
    audioBlob,
    error,
  };
};
