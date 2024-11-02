import axios from "axios";

interface GenerateQuestionsResponse {
  questions: string[];
}

const ML_PROMPT = `Generate 5 technical interview questions about machine learning. The questions should:
- Cover different ML concepts (algorithms, evaluation metrics, deep learning, etc.)
- Be suitable for a mid-level ML engineer interview
- Be open-ended to encourage discussion
- Not require coding implementations
Return only the questions, one per line.`;

export async function generateMLQuestions(
  numQuestions: number = 5
): Promise<string[]> {
  try {
    const response = await axios.post<GenerateQuestionsResponse>(
      "/api/generate-questions",
      {
        prompt: ML_PROMPT,
        numQuestions,
      }
    );

    return response.data.questions;
  } catch (error) {
    console.error("Failed to generate ML questions:", error);
    throw new Error("Failed to generate interview questions");
  }
}
