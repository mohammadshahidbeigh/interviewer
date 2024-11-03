import {ERROR_MESSAGES} from "./constants";

interface GenerateQuestionsResponse {
  response: string;
}

const ML_PROMPT = `Generate a technical interview question about machine learning. The question should:
- Cover core ML concepts (algorithms, evaluation metrics, deep learning, etc.)
- Be suitable for a mid-level ML engineer interview
- Be open-ended to encourage discussion
- Not require coding implementations
Return only the question text.`;

export async function generateMLQuestions(): Promise<string> {
  try {
    const response = await fetch("/api/llmGenerate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentQuestion: "",
        answer: ML_PROMPT,
      }),
    });

    if (!response.ok) {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }

    const data: GenerateQuestionsResponse = await response.json();
    return data.response;
  } catch (error) {
    console.error("Failed to generate ML question:", error);
    throw new Error("Failed to generate interview question");
  }
}
