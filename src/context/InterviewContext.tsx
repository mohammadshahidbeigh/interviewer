"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  FC,
} from "react";
import {INTERVIEW_QUESTIONS} from "@/utils/constants";

interface InterviewContextType {
  currentQuestion: string;
  transcription: string;
  isStarted: boolean;
  isPaused: boolean;
  isRecording: boolean;
  audioUrl: string | null;
  questionCount: number;
  isCompleted: boolean;
  startInterview: () => void;
  pauseInterview: () => void;
  resumeInterview: () => void;
  endInterview: () => void;
  setCurrentQuestion: (question: string) => void;
  setTranscription: (text: string) => void;
  setIsRecording: (isRecording: boolean) => void;
  setAudioUrl: (url: string | null) => void;
  incrementQuestionCount: () => void;
  setIsCompleted: (completed: boolean) => void;
}

const InterviewContext = createContext<InterviewContextType | undefined>(
  undefined
);

interface InterviewProviderProps {
  children: ReactNode;
}

export const InterviewProvider: FC<InterviewProviderProps> = ({children}) => {
  const [currentQuestion, setCurrentQuestion] = useState<string>(
    INTERVIEW_QUESTIONS.INITIAL
  );
  const [transcription, setTranscription] = useState<string>("");
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const startInterview = useCallback(() => {
    setIsStarted(true);
    setIsPaused(false);
    setCurrentQuestion(INTERVIEW_QUESTIONS.INITIAL);
    setQuestionCount(1); // Start with first question
    setIsCompleted(false);
  }, []);

  const incrementQuestionCount = useCallback(() => {
    setQuestionCount((prev) => prev + 1);
  }, []);

  const pauseInterview = useCallback(() => {
    setIsPaused(true);
    setIsRecording(false);
  }, []);

  const resumeInterview = useCallback(() => {
    setIsPaused(false);
  }, []);

  const endInterview = useCallback(() => {
    setIsStarted(false);
    setIsPaused(false);
    setIsRecording(false);
    setCurrentQuestion("");
    setTranscription("");
    setAudioUrl(null);
    setQuestionCount(0);
    setIsCompleted(false);
  }, []);

  const value = {
    currentQuestion,
    transcription,
    isStarted,
    isPaused,
    isRecording,
    audioUrl,
    questionCount,
    isCompleted,
    startInterview,
    pauseInterview,
    resumeInterview,
    endInterview,
    setCurrentQuestion,
    setTranscription,
    setIsRecording,
    setAudioUrl,
    incrementQuestionCount,
    setIsCompleted,
  };

  return (
    <InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }
  return context;
};
