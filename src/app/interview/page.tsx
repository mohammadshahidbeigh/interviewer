"use client";

import {useState, useEffect} from "react";
import {useInterview} from "@/context/InterviewContext";
import {useInterviewFlow} from "@/hooks/useInterviewFlow";
import QuestionDisplay from "@/components/QuestionDisplay";
import AnswerRecorder from "@/components/AnswerRecorder";
import TranscriptDisplay from "@/components/TranscriptDisplay";
import VoiceOutput from "@/components/VoiceOutput";
import InterviewControls from "@/components/InterviewControls";
import {ErrorHandler} from "@/components/ErrorHandler";
import {INTERVIEW_QUESTIONS} from "@/utils/constants";

export default function InterviewPage() {
  const {
    currentQuestion,
    transcription,
    isStarted,
    isPaused,
    audioUrl,
    startInterview,
    pauseInterview,
    resumeInterview,
    endInterview,
    setCurrentQuestion,
  } = useInterview();

  const {handleStopAnswer, isProcessing} = useInterviewFlow();
  const [error, setError] = useState<string | null>(null);

  const handleError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  useEffect(() => {
    if (isStarted && !currentQuestion) {
      setCurrentQuestion(INTERVIEW_QUESTIONS.INITIAL);
    }
  }, [isStarted, currentQuestion, setCurrentQuestion]);

  useEffect(() => {
    if (isProcessing) {
      const timeout = setTimeout(() => {
        handleError("Processing is taking longer than expected...");
      }, 10000);
      return () => clearTimeout(timeout);
    }
  }, [isProcessing]);

  return (
    <div className="min-h-[calc(100vh-73px)] p-8 max-w-4xl mx-auto">
      {error && <ErrorHandler message={error} />}

      {!isStarted ? (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">ML Technical Interview</h1>
          <p className="mb-8 text-gray-600">
            Ready to test your Machine Learning knowledge? Click start when
            you&apos;re ready.
          </p>
          <InterviewControls
            onStart={startInterview}
            onPause={pauseInterview}
            onResume={resumeInterview}
            onEnd={endInterview}
            isStarted={isStarted}
            isPaused={isPaused}
          />
        </div>
      ) : (
        <>
          <QuestionDisplay question={currentQuestion} />

          {audioUrl && <VoiceOutput audioUrl={audioUrl} />}

          <AnswerRecorder onRecordingComplete={handleStopAnswer} />

          {transcription && <TranscriptDisplay transcription={transcription} />}

          <div className="mt-8">
            <InterviewControls
              onStart={startInterview}
              onPause={pauseInterview}
              onResume={resumeInterview}
              onEnd={endInterview}
              isStarted={isStarted}
              isPaused={isPaused}
            />
          </div>

          {isProcessing && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg">
                <p className="text-lg">Processing your response...</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
