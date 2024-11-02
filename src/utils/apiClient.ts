"use client";

import axios from "axios";

interface TranscriptionResponse {
  transcription: string;
}

interface NextQuestionResponse {
  question: string;
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
        "/transcribe",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
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
        "/next-question",
        {
          currentQuestion,
          answer,
        }
      );

      return response.data.question;
    } catch (error) {
      console.error("Failed to get next question:", error);
      throw new Error("Failed to get next question");
    }
  }

  async generateVoice(text: string): Promise<Blob> {
    try {
      const response = await this.client.post(
        "/generate-voice",
        {
          text,
        },
        {
          responseType: "blob",
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
