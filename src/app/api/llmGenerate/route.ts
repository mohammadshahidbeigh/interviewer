import {NextResponse} from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are an AI technical interviewer specializing in Machine Learning. 
Your task is to:
1. Evaluate the candidate's response to the current question
2. Generate a relevant follow-up question based on their answer
3. Keep the conversation focused on ML concepts
4. Maintain a professional and encouraging tone

Focus on core ML concepts like:
- Supervised vs unsupervised learning
- Model evaluation metrics
- Overfitting and underfitting
- Feature selection and engineering
- Deep learning architectures
- Model optimization techniques

Keep responses concise and technical. If the answer is incomplete, 
guide the candidate towards important aspects they might have missed.`;

export async function POST(request: Request) {
  try {
    const {currentQuestion, answer} = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {role: "system", content: SYSTEM_PROMPT},
        {role: "assistant", content: currentQuestion},
        {role: "user", content: answer},
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const response = completion.choices[0].message.content;

    return NextResponse.json({response}, {status: 200});
  } catch (error) {
    console.error("LLM generation error:", error);
    return NextResponse.json(
      {error: "Failed to generate response"},
      {status: 500}
    );
  }
}
