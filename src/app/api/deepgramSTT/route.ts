import {NextResponse} from "next/server";
import {createClient} from "@deepgram/sdk";

const deepgram = createClient(process.env.DEEPGRAM_API_KEY!);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return NextResponse.json(
        {error: "No audio file provided"},
        {status: 400}
      );
    }

    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());

    const {result, error} = await deepgram.listen.prerecorded.transcribeFile(
      audioBuffer,
      {
        smart_format: true,
        model: "nova-2",
        language: "en",
        mimetype: "audio/webm",
      }
    );

    if (error) {
      throw error;
    }

    const transcription =
      result.results?.channels[0]?.alternatives[0]?.transcript || "";

    return NextResponse.json({transcription}, {status: 200});
  } catch (error) {
    console.error("Speech-to-text error:", error);
    return NextResponse.json(
      {error: "Failed to transcribe audio"},
      {status: 500}
    );
  }
}
