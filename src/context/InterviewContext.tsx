"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  FC,
} from "react";

interface InterviewContextType {
  currentQuestion: string;
  transcription: string;
  isStarted: boolean;
  isPaused: boolean;
  isRecording: boolean;
  audioUrl: string | null;
  startInterview: () => void;
  pauseInterview: () => void;
  resumeInterview: () => void;
  endInterview: () => void;
  setCurrentQuestion: (question: string) => void;
  setTranscription: (text: string) => void;
  setIsRecording: (isRecording: boolean) => void;
  setAudioUrl: (url: string | null) => void;
}

const InterviewContext = createContext<InterviewContextType | undefined>(
  undefined
);

interface InterviewProviderProps {
  children: ReactNode;
}

export const InterviewProvider: FC<InterviewProviderProps> = ({children}) => {
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [transcription, setTranscription] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const startInterview = useCallback(() => {
    setIsStarted(true);
    setIsPaused(false);
  }, []);

  const pauseInterview = useCallback(() => {
    setIsPaused(true);
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
  }, []);

  const value = {
    currentQuestion,
    transcription,
    isStarted,
    isPaused,
    isRecording,
    audioUrl,
    startInterview,
    pauseInterview,
    resumeInterview,
    endInterview,
    setCurrentQuestion,
    setTranscription,
    setIsRecording,
    setAudioUrl,
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
