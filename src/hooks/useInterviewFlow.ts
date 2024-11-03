"use client";

import {useState, useCallback} from "react";
import {useInterview} from "../context/InterviewContext";
import {apiClient} from "../utils/apiClient";

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

  const handleStopAnswer = useCallback(
    async (audioBlob: Blob) => {
      setIsProcessing(true);
      setError(null);
      try {
        // Send audio for transcription
        const transcription = await apiClient.transcribeAudio(audioBlob);
        setTranscription(transcription);
        console.log(
          `Question ${questionCount}/${QUESTION_LIMIT}:`,
          currentQuestion
        );
        console.log("Your answer:", transcription);

        if (questionCount >= QUESTION_LIMIT) {
          // Interview is complete
          const completionMessage =
            "Interview completed successfully! Thank you for your participation. You have completed all questions.";
          setCurrentQuestion(completionMessage);
          setIsCompleted(true);
          console.log("Interview completed successfully! ✨");

          // Generate voice for completion message
          const voiceBlob = await apiClient.generateVoice(completionMessage);
          const voiceUrl = URL.createObjectURL(voiceBlob);
          setAudioUrl(voiceUrl);
          return;
        }

        // Get next question based on transcription
        console.log("Processing your answer...");
        const nextQuestion = await apiClient.getNextQuestion(
          currentQuestion,
          transcription
        );
        console.log("AI's response:", nextQuestion);
        setCurrentQuestion(nextQuestion);
        incrementQuestionCount();

        // Generate voice response
        console.log("Generating voice response...");
        const voiceBlob = await apiClient.generateVoice(nextQuestion);
        const voiceUrl = URL.createObjectURL(voiceBlob);
        setAudioUrl(voiceUrl);

        console.log(
          `Question ${questionCount}/${QUESTION_LIMIT} completed! ✨`
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        console.error("Error in interview flow:", errorMessage);
        setError(errorMessage);
        throw error;
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
