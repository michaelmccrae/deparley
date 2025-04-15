import { NextResponse } from 'next/server';
import { CARTESIA_VOICE_ONE } from "@/lib/caretesiavoiceone";

//stuff

type SelectedVoice = string | null;

let selectedVoice:SelectedVoice  = null;

function randomVoice() {
    // Check if we already have a voice selected for this session
    if (selectedVoice === null) {
        // Only select a new random voice if none is stored
        const randomIndex = Math.floor(Math.random() * CARTESIA_VOICE_ONE.length);
        selectedVoice = CARTESIA_VOICE_ONE[randomIndex];
    }
    return selectedVoice;
}

console.log("API Key exists:", !!process.env.CARTESIA_API_KEY);


export async function POST(request: Request) {

    //**Add error handling for missing environment variables**:
    const apiKey = process.env.CARTESIA_API_KEY;
    if (!apiKey) {
        console.error("Missing CARTESIA_API_KEY environment variable");
        return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    try {
        const { transcript } = await request.json();
        console.log("Transcript:", transcript);
        console.log("Voice:", CARTESIA_VOICE_ONE);

        const response = await fetch("https://api.cartesia.ai/tts/bytes", {
            method: "POST",
            headers: {
                "Cartesia-Version": "2024-06-30",
                "Content-Type": "application/json",
                "X-API-Key": apiKey,
            },
            body: JSON.stringify({
                model_id: "sonic-english",
                transcript: transcript,
                voice: {
                    mode: "id",
                    id: randomVoice(),
                },
                output_format: {
                    container: "wav",
                    encoding: "pcm_f32le",
                    sample_rate: 24000,
                },
            }),
        });

        if (!response.ok) {
            return NextResponse.json({ error: "Failed to fetch TTS" }, { status: response.status });
        }

        const audioBuffer = await response.arrayBuffer();
        return new Response(audioBuffer, {
            headers: {
                "Content-Type": "audio/wav",
            },
        });

    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
