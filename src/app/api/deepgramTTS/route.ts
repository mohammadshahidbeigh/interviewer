import {NextResponse} from "next/server";
import {createClient} from "@deepgram/sdk";
import rateLimiter from "@/utils/rateLimiter";

const deepgram = createClient(process.env.DEEPGRAM_API_KEY!);

export async function POST(request: Request) {
  const clientId = request.headers.get("x-forwarded-for") || "anonymous";

  const rateLimitResult = rateLimiter.consume(clientId);
  if (!rateLimitResult.success) {
    return NextResponse.json({error: rateLimitResult.message}, {status: 429});
  }

  try {
    const {text} = await request.json();

    if (!text) {
      return NextResponse.json({error: "No text provided"}, {status: 400});
    }

    const response = await deepgram.speak.request(
      {text},
      {
        model: "aura-asteria-en",
        encoding: "linear16",
        container: "wav",
      }
    );

    const stream = await response.getStream();
    if (!stream) {
      throw new Error("Failed to get audio stream");
    }
    const audioBuffer = await getAudioBuffer(stream);

    // Return the audio as a stream
    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/wav",
        "Content-Length": audioBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Text-to-speech error:", error);
    return NextResponse.json(
      {error: "Failed to generate speech"},
      {status: 500}
    );
  }
}

// Helper function to convert the stream to an audio buffer
const getAudioBuffer = async (response: ReadableStream<Uint8Array>) => {
  const reader = response.getReader();
  const chunks = [];

  while (true) {
    const {done, value} = await reader.read();
    if (done) break;

    chunks.push(value);
  }

  const dataArray = chunks.reduce(
    (acc, chunk) => Uint8Array.from([...acc, ...chunk]),
    new Uint8Array(0)
  );

  return Buffer.from(dataArray.buffer);
};
