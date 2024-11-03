"use client";

import {useState, useCallback} from "react";
import {useInterview} from "../context/InterviewContext";
import {apiClient} from "../utils/apiClient";
import {ERROR_MESSAGES} from "@/utils/constants";

interface UseInterviewFlowReturn {
  handleStopAnswer: (audioBlob: Blob) => Promise<void>;
  isProcessing: boolean;
  error: string | null;
}

export const useInterviewFlow = (): UseInterviewFlowReturn => {
  const {
    setCurrentQuestion,
    setTranscription,
    setAudioUrl,
    currentQuestion,
    questionCount,
    incrementQuestionCount,
    setIsCompleted,
  } = useInterview();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const QUESTION_LIMIT = 3;
  const MIN_ANSWER_LENGTH = 20; // Minimum characters for a valid answer

  const handleStopAnswer = useCallback(
    async (audioBlob: Blob) => {
      setIsProcessing(true);
      setError(null);
      try {
        // Check if audio blob is empty or too small
        if (!audioBlob || audioBlob.size < 1000) {
          throw new Error("No speech detected. Please try again.");
        }

        // Send audio for transcription
        const transcription = await apiClient.transcribeAudio(audioBlob);

        // Check if transcription is too short or empty
        if (!transcription || transcription.trim().length < MIN_ANSWER_LENGTH) {
          throw new Error(
            "Your answer was too short or unclear. Please provide a more detailed response."
          );
        }

        setTranscription(transcription);
        console.log(
          `Question ${questionCount}/${QUESTION_LIMIT}:`,
          currentQuestion
        );
        console.log("Your answer:", transcription);

        if (questionCount >= QUESTION_LIMIT) {
          const completionMessage =
            "Interview completed successfully! Thank you for your participation. You have completed all questions.";
          setCurrentQuestion(completionMessage);
          setIsCompleted(true);
          console.log("Interview completed successfully! ✨");

          const voiceBlob = await apiClient.generateVoice(completionMessage);
          const voiceUrl = URL.createObjectURL(voiceBlob);
          setAudioUrl(voiceUrl);
          return;
        }

        // Get next question based on transcription
        console.log("Processing your answer...");
        let nextQuestion;
        try {
          nextQuestion = await apiClient.getNextQuestion(
            currentQuestion,
            transcription
          );
        } catch (error) {
          console.error("LLM error:", error);
          nextQuestion =
            "Could you please elaborate more on your previous answer?";
        }

        console.log("AI's response:", nextQuestion);
        setCurrentQuestion(nextQuestion);
        incrementQuestionCount();

        // Generate voice response with fallback
        console.log("Generating voice response...");
        try {
          const voiceBlob = await apiClient.generateVoice(nextQuestion);
          const voiceUrl = URL.createObjectURL(voiceBlob);
          setAudioUrl(voiceUrl);
        } catch (error) {
          console.error("Voice generation error:", error);
          // Continue without voice if TTS fails
          setError("Voice response unavailable. Please read the question.");
        }

        console.log(
          `Question ${questionCount}/${QUESTION_LIMIT} completed! ✨`
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        console.error("Error in interview flow:", errorMessage);
        setError(errorMessage);

        // Handle specific error cases
        if (
          errorMessage.includes("too short") ||
          errorMessage.includes("No speech detected")
        ) {
          setCurrentQuestion("I didn't catch that. " + currentQuestion);
        } else if (errorMessage.includes("network")) {
          setError(ERROR_MESSAGES.NETWORK_ERROR);
        } else {
          throw error;
        }
      } finally {
        setIsProcessing(false);
      }
    },
    [
      currentQuestion,
      questionCount,
      setAudioUrl,
      setCurrentQuestion,
      setTranscription,
      incrementQuestionCount,
      setIsCompleted,
    ]
  );

  return {
    handleStopAnswer,
    isProcessing,
    error,
  };
};
