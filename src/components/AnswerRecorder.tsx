"use client";

import {FC, useState, useRef, useEffect} from "react";
import {AUDIO_CONFIG, ERROR_MESSAGES} from "@/utils/constants";

interface AnswerRecorderProps {
  onRecordingComplete: (audioData: Blob) => void;
}

const AnswerRecorder: FC<AnswerRecorderProps> = ({onRecordingComplete}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [realtimeTranscript, setRealtimeTranscript] = useState<string>("");
  const [recognitionError, setRecognitionError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<typeof window.webkitSpeechRecognition | null>(
    null
  );
  const accumulatedTranscriptRef = useRef<string>("");

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

        setRealtimeTranscript(finalTranscript + interimTranscript);
        setRecognitionError(null);
      };

      recognitionRef.current.onerror = (event: {error: string}) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === "network") {
          setRecognitionError(
            "Network error. Check your connection and try again."
          );
          // Attempt to restart recognition after a brief delay
          setTimeout(() => {
            if (isRecording && recognitionRef.current) {
              recognitionRef.current.stop();
              recognitionRef.current.start();
            }
          }, 1000);
        } else {
          setRecognitionError(`Speech recognition error: ${event.error}`);
        }
      };

      recognitionRef.current.onend = () => {
        // Restart recognition if we're still recording and there was no error
        if (isRecording && !recognitionError && recognitionRef.current) {
          recognitionRef.current.start();
        }
      };
    }
  };

  useEffect(() => {
    initializeSpeechRecognition();
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setRecognitionError(null);
      accumulatedTranscriptRef.current = "";
      setRealtimeTranscript("");

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
        onRecordingComplete(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      };

      mediaRecorder.start();
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
      setIsRecording(true);
    } catch (error) {
      console.error(ERROR_MESSAGES.MICROPHONE_ACCESS, error);
      throw new Error(ERROR_MESSAGES.MICROPHONE_ACCESS);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold mb-4">Record Your Answer</h3>
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`px-6 py-2 rounded-lg transition-colors ${
          isRecording
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      {isRecording && (
        <div className="mt-4">
          <p className="text-red-600 dark:text-red-400 mb-2">
            Recording in progress...
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
  );
};

export default AnswerRecorder;
