"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play } from 'lucide-react';

const StartButton = ({selectorScenario}:any) => { 
    const [text, setText] = useState("Hello world"); // pull start dialogue from selectorScenario
    const [loading, setLoading] = useState(false);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

    useEffect(() => {
        console.log("selectorScenario in StartButton", selectorScenario);
        console.log("selectorScenario in StartButton, with start_button", selectorScenario[0].start_button);
        setText(selectorScenario[0].start_button); 
    }, [selectorScenario]);

    const generateTTS = async () => {
        console.log("text in generateTTS StartButton", text);
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
        <div>
            
            
            <div className=""><Button variant="secondary" onClick={generateTTS}><Play />Start</Button> </div>


        </div>
    );
}

export default StartButton;