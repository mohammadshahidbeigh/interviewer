import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    // Get the request parameters
    const { topic, difficulty } = await request.json();

    if (!topic || !difficulty) {
      return NextResponse.json(
        { error: 'Topic and difficulty are required' },
        { status: 400 }
      );
    }

    // Construct the prompt
    const prompt = `Generate an interview question about ${topic} at ${difficulty} difficulty level. 
    The response should be structured as a JSON object with:
    - question: the main interview question
    - expectedAnswer: key points that should be covered in a good answer
    - followUp: 1-2 relevant follow-up questions`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4",
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0].message.content;
    
    if (!response) {
      throw new Error('No response received from OpenAI');
    }

    // Parse and return the response
    return NextResponse.json(JSON.parse(response));

  } catch (error) {
    console.error('LLM Generation Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate interview question' },
      { status: 500 }
    );
  }
}