"use client";
import { useState } from "react";

export default function TTSPlayer() {
    const [text, setText] = useState("Hello world");
    const [loading, setLoading] = useState(false);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

    const generateTTS = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/apistart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ transcript: text }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate TTS");
            }

            // Get the audio file as a Blob
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            // Ensure a new Audio object is created each time
            const newAudio = new Audio(url);
            newAudio.oncanplaythrough = () => newAudio.play(); // Ensures play starts when ready
            newAudio.onerror = (e) => console.error("Audio playback error:", e);

            setAudio(newAudio);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center p-4">
            <textarea 
                className="border p-2 rounded w-full max-w-md"
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button 
                className="bg-blue-500 text-white p-2 rounded mt-2"
                onClick={generateTTS}
                disabled={loading}
            >
                {loading ? "Generating..." : "Play TTS"}
            </button>
        </div>
    );
}
