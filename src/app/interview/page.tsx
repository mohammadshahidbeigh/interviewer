"use client";

import {useState, useEffect, useRef} from "react";
import {useInterview} from "@/context/InterviewContext";
import {useInterviewFlow} from "@/hooks/useInterviewFlow";
import {useVoiceOutput} from "@/hooks/useVoiceOutput";
import VoiceOutput from "@/components/VoiceOutput";
import {ErrorHandler} from "@/components/ErrorHandler";
import InterviewControls from "@/components/InterviewControls";
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
    // Pause any playing audio
    const audioElements = document.getElementsByTagName('audio');
    for (const audio of audioElements) {
      audio.pause();
    }
    showNotification("Interview paused");
  };

  const handleResumeInterview = () => {
    resumeInterview();
    // Resume the last playing audio
    const audioElements = document.getElementsByTagName('audio');
    for (const audio of audioElements) {
      audio.play();
    }
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
      <ErrorHandler message={notification} type="info" />
      {isGenerating && (
        <div className="flex items-center justify-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-blue-400">Generating AI response...</span>
        </div>
      )}
      {audioUrl && <VoiceOutput audioUrl={audioUrl} />}
      <InterviewControls
        onStart={startInterview}
        onPause={handlePauseInterview}
        onResume={handleResumeInterview}
        onEnd={handleEndInterview}
        onRecordingToggle={handleRecordingToggle}
        isStarted={isStarted}
        isPaused={isPaused}
        isListening={isListening}
        isProcessing={isProcessing}
        isCompleted={isCompleted}
        questionCount={questionCount}
        totalQuestions={totalQuestions}
      />
    </div>
  );
}
