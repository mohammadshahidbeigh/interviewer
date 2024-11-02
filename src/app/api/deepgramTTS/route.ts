import {NextResponse} from "next/server";
import {createClient} from "@deepgram/sdk";

// Initialize the Deepgram client
const deepgram = createClient(process.env.DEEPGRAM_API_KEY || "");

export async function POST(request: Request) {
  try {
    // Get the text content from the request
    const {text} = await request.json();

    if (!text) {
      return NextResponse.json({error: "No text provided"}, {status: 400});
    }
    // TTS options are configured directly in the speak.request() call below

    // Generate audio from text
    const response = await deepgram.speak.request(
      {text},
      {
        model: "aura-asteria-en",
        encoding: "linear16" as const,
        container: "wav",
      }
    );

    // Get the audio stream
    const stream = await response.getStream();

    if (!stream) {
      throw new Error("Failed to generate audio stream");
    }

    // Convert the stream to an audio buffer
    const audioData = await streamToBuffer(stream);

    // Return the audio with appropriate headers
    return new NextResponse(audioData, {
      headers: {
        "Content-Type": "audio/wav",
        "Content-Length": audioData.length.toString(),
      },
    });
  } catch (error) {
    console.error("Deepgram TTS Error:", error);
    return NextResponse.json(
      {error: "Failed to generate speech"},
      {status: 500}
    );
  }
}
// Helper function to convert the stream to a buffer
async function streamToBuffer(stream: ReadableStream<Uint8Array>) {
  const chunks: Uint8Array[] = [];
  const reader = stream.getReader();

  while (true) {
    const {done, value} = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  return Buffer.concat(chunks);
}
