"use client";

// API Endpoints
export const API_ENDPOINTS = {
  TRANSCRIBE: "/api/deepgramSTT",
  NEXT_QUESTION: "/api/llmGenerate",
  GENERATE_VOICE: "/api/deepgramTTS",
} as const;

// Interview Questions
export const INTERVIEW_QUESTIONS = {
  INITIAL:
    "Let's begin with a fundamental question about machine learning. Could you explain what machine learning is and its main types?",
  FALLBACK: "That's interesting. Could you elaborate more on that point?",
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
  PROCESSING_TIMEOUT: "Processing is taking longer than expected...",
} as const;
