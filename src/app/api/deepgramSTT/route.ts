import { NextResponse } from 'next/server';
import { createClient } from '@deepgram/sdk';

// Initialize the Deepgram client
const deepgram = createClient(process.env.DEEPGRAM_API_KEY || '');

export async function POST(request: Request) {
  try {
    // Get the audio file from the request
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Convert the file to an ArrayBuffer
    const arrayBuffer = await audioFile.arrayBuffer();

    // Configure transcription options
    const options = {
      smart_format: true,
      model: 'nova-2',
      language: 'en-US',
    };

    // Send to Deepgram for transcription
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      Buffer.from(arrayBuffer),
      {
        mimetype: audioFile.type,
        ...options
      }
    );

    if (error) {
      throw error;
    }

    // Return the transcription results
    return NextResponse.json({
      transcription: result.results?.channels[0]?.alternatives[0]?.transcript || '',
      confidence: result.results?.channels[0]?.alternatives[0]?.confidence || 0,
    });
  } catch (error) {
    console.error('Deepgram STT Error:', error);
    return NextResponse.json(
      { error: 'Failed to process audio' },
      { status: 500 }
    );
  }
}