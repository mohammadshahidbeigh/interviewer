"use client";

import axios from "axios";
import {TIMEOUTS} from "./constants";

interface TranscriptionResponse {
  transcription: string;
}

interface NextQuestionResponse {
  response: string;
}

class ApiClient {
  private static instance: ApiClient;
  private readonly client;

  private constructor() {
    this.client = axios.create({
      baseURL: "/api",
      headers: {
        "Content-Type": "application/json",
      },
      timeout: TIMEOUTS.API_REQUEST_TIMEOUT,
    });
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  async transcribeAudio(audioBlob: Blob): Promise<string> {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob);

      const response = await this.client.post<TranscriptionResponse>(
        "/deepgramSTT",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: TIMEOUTS.API_REQUEST_TIMEOUT * 2, // Double timeout for audio processing
        }
      );

      return response.data.transcription;
    } catch (error) {
      console.error("Transcription failed:", error);
      throw new Error("Failed to transcribe audio");
    }
  }

  async getNextQuestion(
    currentQuestion: string,
    answer: string
  ): Promise<string> {
    try {
      const response = await this.client.post<NextQuestionResponse>(
        "/llmGenerate",
        {
          currentQuestion,
          answer,
        }
      );

      return response.data.response;
    } catch (error) {
      console.error("Failed to get next question:", error);
      throw new Error("Failed to get next question");
    }
  }

  async generateVoice(text: string): Promise<Blob> {
    try {
      const response = await this.client.post(
        "/deepgramTTS",
        {
          text,
        },
        {
          responseType: "blob",
          timeout: TIMEOUTS.API_REQUEST_TIMEOUT * 2, // Double timeout for voice generation
        }
      );

      return response.data;
    } catch (error) {
      console.error("Voice generation failed:", error);
      throw new Error("Failed to generate voice");
    }
  }
}

export const apiClient = ApiClient.getInstance();
