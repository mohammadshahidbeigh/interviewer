"use client";

import {useState, useEffect, useRef} from "react";
import Link from "next/link";
import {FaMicrophone, FaStop} from "react-icons/fa";
import {useInterview} from "@/context/InterviewContext";
import {useInterviewFlow} from "@/hooks/useInterviewFlow";
import {useVoiceOutput} from "@/hooks/useVoiceOutput";
import VoiceOutput from "@/components/VoiceOutput";
import {INTERVIEW_QUESTIONS, AUDIO_CONFIG} from "@/utils/constants";

export default function InterviewPage() {
  const {
    isStarted,
    isPaused,
    startInterview,
    pauseInterview,
    resumeInterview,
    endInterview,
    questionCount,
    isCompleted,
    setAudioUrl,
    audioUrl,
  } = useInterview();

  const {handleStopAnswer, isProcessing, error} = useInterviewFlow();
  const {generateVoice, isGenerating} = useVoiceOutput();
  const [isListening, setIsListening] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const totalQuestions = 7;

  // Add refs for audio recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const showNotification = (message: string) => {
    setNotification(message);
    const timer = setTimeout(() => {
      setNotification(null);
    }, 5000);
    return () => clearTimeout(timer);
  };

  // Handle errors and show notifications
  useEffect(() => {
    if (error) {
      showNotification(error);
    }
  }, [error]);

  // Play initial question when interview starts
  useEffect(() => {
    if (isStarted) {
      showNotification("Generating AI voice response...");
      generateVoice(INTERVIEW_QUESTIONS.INITIAL).then((url) => {
        setAudioUrl(url);
        showNotification("AI is now speaking...");
      });
    }
  }, [isStarted, generateVoice, setAudioUrl]);

  const startRecording = async () => {
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

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, {
          type: AUDIO_CONFIG.MIME_TYPE,
        });
        stream.getTracks().forEach((track) => track.stop());
        showNotification("Processing your answer...");
        await handleStopAnswer(audioBlob);
      };

      mediaRecorder.start();
      setIsListening(true);
      showNotification("Recording started - listening to your answer...");
    } catch (error) {
      console.error("Error starting recording:", error);
      showNotification(
        "Failed to start recording. Please check your microphone permissions."
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
      showNotification("Recording stopped");
    }
  };

  const handleRecordingToggle = () => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handlePauseInterview = () => {
    pauseInterview();
    showNotification("Interview paused");
  };

  const handleResumeInterview = () => {
    resumeInterview();
    showNotification("Interview resumed");
  };

  const handleEndInterview = () => {
    endInterview();
    showNotification("Interview ended");
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="min-h-[calc(100vh-73px)] p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 max-w-md z-50 animate-fade-in">
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded shadow-lg">
            <div className="flex items-center">
              <div className="py-1">
                <svg
                  className="h-6 w-6 text-blue-500 mr-4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>{notification}</div>
            </div>
          </div>
        </div>
      )}

      {!isStarted ? (
        <div className="flex flex-col items-center justify-center h-full gap-8">
          <div className="text-center max-w-2xl">
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Ready to Begin Your Interview?
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              You&apos;ll be asked questions through voice and can respond
              verbally. The AI interviewer will provide feedback and follow-up
              questions based on your responses.
            </p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <div className="flex items-center text-sm text-gray-300">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Voice Interaction
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Real-time Feedback
              </div>
            </div>
          </div>
          <div className="flex gap-6">
            <button
              onClick={startInterview}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl font-medium flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Proceed with the Interview
            </button>
            <Link
              href="/"
              className="px-8 py-4 border-2 border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-all transform hover:scale-105 font-medium flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Go Back
            </Link>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-200">
                Interview in Progress
              </h2>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-900/50 text-blue-200 rounded-full font-medium">
                  Question {questionCount} of {totalQuestions}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2.5 mb-6">
            <div
              className="bg-blue-500 h-2.5 rounded-full"
              style={{width: `${(questionCount / totalQuestions) * 100}%`}}
            ></div>
          </div>

          {/* Voice Output */}
          {isGenerating && (
            <div className="flex items-center justify-center mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-blue-400">
                Generating AI response...
              </span>
            </div>
          )}
          {audioUrl && <VoiceOutput audioUrl={audioUrl} />}

          {/* Voice Recording Controls */}
          <div className="flex flex-col items-center justify-center mb-8">
            <div
              className={`w-20 h-20 rounded-full ${
                isListening ? "bg-red-600 animate-pulse" : "bg-blue-600"
              } flex items-center justify-center mb-4 shadow-lg`}
            >
              <button
                onClick={handleRecordingToggle}
                disabled={isPaused || isProcessing}
                className="p-6 text-white"
              >
                {isListening ? (
                  <FaStop className="h-8 w-8" />
                ) : (
                  <FaMicrophone className="h-8 w-8" />
                )}
              </button>
            </div>

            {/* Recording Status */}
            {isListening && (
              <div className="text-green-400 mb-4 animate-pulse">
                Listening to your answer...
              </div>
            )}
            {isProcessing && (
              <div className="text-blue-400 mb-4">Processing response...</div>
            )}

            {/* Interview Controls */}
            <div className="flex gap-4 mt-4">
              {isPaused ? (
                <button
                  onClick={handleResumeInterview}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Resume Interview
                </button>
              ) : (
                <button
                  onClick={handlePauseInterview}
                  className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Pause Interview
                </button>
              )}
              <button
                onClick={handleEndInterview}
                className="px-6 py-2 text-red-400 border border-red-600 rounded-lg hover:bg-red-900/20 transition-colors"
              >
                End Interview
              </button>
            </div>
          </div>

          {isCompleted && (
            <div className="text-center bg-green-900/20 p-6 rounded-lg border border-green-500">
              <h3 className="text-xl font-semibold mb-4 text-green-400">
                Interview completed successfully!
              </h3>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleEndInterview}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Start New Interview
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
