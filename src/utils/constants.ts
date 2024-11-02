"use client";

// API Endpoints
export const API_ENDPOINTS = {
  TRANSCRIBE: "/api/transcribe",
  NEXT_QUESTION: "/api/next-question",
  GENERATE_VOICE: "/api/generate-voice",
  DEEPGRAM_TTS: "/api/deepgramTTS",
} as const;

// Interview Questions
export const INTERVIEW_QUESTIONS = {
  INITIAL: "Tell me a little bit about yourself and your background.",
  FALLBACK: "Could you please elaborate on that?",
} as const;

// Timeouts (in milliseconds)
export const TIMEOUTS = {
  RECORDING_MAX_DURATION: 120000, // 2 minutes
  VOICE_GENERATION_TIMEOUT: 10000, // 10 seconds
  API_REQUEST_TIMEOUT: 30000, // 30 seconds
} as const;

// Audio Settings
export const AUDIO_CONFIG = {
  MIME_TYPE: "audio/webm",
  SAMPLE_RATE: 16000,
  CHANNELS: 1,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  MICROPHONE_ACCESS:
    "Error accessing microphone. Please check your permissions.",
  TRANSCRIPTION_FAILED: "Failed to transcribe audio. Please try again.",
  VOICE_GENERATION_FAILED: "Failed to generate voice response.",
  NETWORK_ERROR: "Network error. Please check your connection.",
} as const;
