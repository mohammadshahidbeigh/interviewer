"use client";

import {FC, useState, useRef, useEffect} from "react";
import {AUDIO_CONFIG, ERROR_MESSAGES, TIMEOUTS} from "@/utils/constants";
import {useInterview} from "@/context/InterviewContext";

interface AnswerRecorderProps {
  onRecordingComplete: (audioData: Blob) => void;
}

const AnswerRecorder: FC<AnswerRecorderProps> = ({onRecordingComplete}) => {
  const {isPaused} = useInterview();
  const [isRecording, setIsRecording] = useState(false);
  const [realtimeTranscript, setRealtimeTranscript] = useState<string>("");
  const [recognitionError, setRecognitionError] = useState<string | null>(null);
  const [silenceTimer, setSilenceTimer] = useState<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<typeof window.webkitSpeechRecognition | null>(
    null
  );
  const accumulatedTranscriptRef = useRef<string>("");
  const silenceTimeoutRef = useRef<NodeJS.Timeout>();
  const lastSpeechRef = useRef<number>(Date.now());

  const SILENCE_THRESHOLD = 5000; // 5 seconds of silence
  const MAX_RECORDING_TIME = TIMEOUTS.RECORDING_MAX_DURATION;
  const recordingTimeoutRef = useRef<NodeJS.Timeout>();

  // Handle pause/resume
  useEffect(() => {
    if (isPaused && isRecording) {
      stopRecording();
    }
  }, [isPaused]);

  const initializeSpeechRecognition = () => {
    if ("webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: {
        resultIndex: number;
        results: {
          [x: number]: {
            [x: number]: {
              transcript: string;
            };
            isFinal: boolean;
          };
          length: number;
        };
      }) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            accumulatedTranscriptRef.current += transcript + " ";
            finalTranscript = accumulatedTranscriptRef.current;
          } else {
            interimTranscript += transcript;
          }
        }

        // Reset silence timer when speech is detected
        lastSpeechRef.current = Date.now();
        setRealtimeTranscript(finalTranscript + interimTranscript);
        setRecognitionError(null);
      };

      recognitionRef.current.onerror = (event: {error: string}) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === "network") {
          setRecognitionError(
            "Network error. Check your connection and try again."
          );
          setTimeout(() => {
            if (isRecording && recognitionRef.current && !isPaused) {
              recognitionRef.current.stop();
              recognitionRef.current.start();
            }
          }, 1000);
        } else {
          setRecognitionError(`Speech recognition error: ${event.error}`);
        }
      };

      recognitionRef.current.onend = () => {
        if (
          isRecording &&
          !recognitionError &&
          !isPaused &&
          recognitionRef.current
        ) {
          recognitionRef.current.start();
        }
      };
    }
  };

  // Check for silence
  useEffect(() => {
    if (isRecording && !isPaused) {
      const interval = setInterval(() => {
        const timeSinceLastSpeech = Date.now() - lastSpeechRef.current;
        setSilenceTimer(Math.floor(timeSinceLastSpeech / 1000));

        if (timeSinceLastSpeech > SILENCE_THRESHOLD) {
          setRecognitionError(
            "No speech detected. Please continue speaking or stop recording."
          );
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isRecording, isPaused]);

  useEffect(() => {
    initializeSpeechRecognition();
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    if (isPaused) return;

    try {
      setRecognitionError(null);
      accumulatedTranscriptRef.current = "";
      setRealtimeTranscript("");
      lastSpeechRef.current = Date.now();

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
        const audioBlob = new Blob(chunksRef.current, {
          type: AUDIO_CONFIG.MIME_TYPE,
        });
        if (!isPaused) {
          onRecordingComplete(audioBlob);
        }
        stream.getTracks().forEach((track) => track.stop());
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      };

      // Set maximum recording duration
      recordingTimeoutRef.current = setTimeout(() => {
        stopRecording();
        setRecognitionError("Maximum recording time reached (2 minutes).");
      }, MAX_RECORDING_TIME);

      mediaRecorder.start();
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
      setIsRecording(true);
    } catch (error) {
      console.error(ERROR_MESSAGES.MICROPHONE_ACCESS, error);
      setRecognitionError(ERROR_MESSAGES.MICROPHONE_ACCESS);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold mb-4">Record Your Answer</h3>
      <div className="flex flex-col gap-4">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isPaused}
          className={`px-6 py-2 rounded-lg transition-colors ${
            isPaused
              ? "bg-gray-400 cursor-not-allowed"
              : isRecording
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isPaused
            ? "Recording Paused"
            : isRecording
            ? "Stop Recording"
            : "Start Recording"}
        </button>

        {isRecording && !isPaused && (
          <div className="mt-2">
            <p className="text-red-600 dark:text-red-400 mb-2">
              Recording in progress...{" "}
              {silenceTimer > 0 && `(${silenceTimer}s silence)`}
            </p>
            {recognitionError && (
              <p className="text-yellow-600 dark:text-yellow-400 mb-2">
                {recognitionError}
              </p>
            )}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg min-h-[100px] max-h-[200px] overflow-y-auto">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {realtimeTranscript || "Listening..."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnswerRecorder;
