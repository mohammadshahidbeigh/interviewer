"use client";

import {useState, useCallback} from "react";
import {useInterview} from "../context/InterviewContext";
import {useAudioRecorder} from "./useRecorder";

interface UseInterviewFlowReturn {
  handleStartAnswer: () => Promise<void>;
  handleStopAnswer: () => Promise<void>;
  isProcessing: boolean;
}

export const useInterviewFlow = (): UseInterviewFlowReturn => {
  const {
    setCurrentQuestion,
    setTranscription,
    setAudioUrl,
    setIsRecording,
    currentQuestion,
  } = useInterview();
  const {startRecording, stopRecording, audioBlob} = useAudioRecorder();
  const [isProcessing, setIsProcessing] = useState(false);

  const getNextQuestion = useCallback(
    async (transcription: string) => {
      try {
        const response = await fetch("/api/next-question", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentQuestion,
            answer: transcription,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to get next question");
        }

        const data = await response.json();
        return data.question;
      } catch (error) {
        console.error("Error getting next question:", error);
        return null;
      }
    },
    [currentQuestion]
  );

  const handleStartAnswer = useCallback(async () => {
    setIsRecording(true);
    await startRecording();
  }, [setIsRecording, startRecording]);

  const handleStopAnswer = useCallback(async () => {
    setIsProcessing(true);
    stopRecording();
    setIsRecording(false);

    if (audioBlob) {
      try {
        // Create form data with audio blob
        const formData = new FormData();
        formData.append("audio", audioBlob);

        // Send audio for transcription
        const transcriptionResponse = await fetch("/api/transcribe", {
          method: "POST",
          body: formData,
        });

        if (!transcriptionResponse.ok) {
          throw new Error("Transcription failed");
        }

        const {transcription} = await transcriptionResponse.json();
        setTranscription(transcription);

        // Get next question based on transcription
        const nextQuestion = await getNextQuestion(transcription);
        if (nextQuestion) {
          setCurrentQuestion(nextQuestion);
        }

        // Generate AI voice response
        const voiceResponse = await fetch("/api/generate-voice", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: nextQuestion,
          }),
        });

        if (!voiceResponse.ok) {
          throw new Error("Voice generation failed");
        }

        const voiceBlob = await voiceResponse.blob();
        const voiceUrl = URL.createObjectURL(voiceBlob);
        setAudioUrl(voiceUrl);
      } catch (error) {
        console.error("Error processing answer:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  }, [
    audioBlob,
    getNextQuestion,
    setAudioUrl,
    setCurrentQuestion,
    setIsRecording,
    setTranscription,
    stopRecording,
  ]);

  return {
    handleStartAnswer,
    handleStopAnswer,
    isProcessing,
  };
};
