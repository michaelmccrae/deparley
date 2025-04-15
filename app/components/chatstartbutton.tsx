"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play } from 'lucide-react';

const ChatStartButton = ({ selectorScenario, onToggleVad, startTextMsg }: any) => {
    const [text, setText] = useState("Hello world"); // pull start dialogue from selectorScenario
    const [loading, setLoading] = useState(false);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const [clicked, setClicked] = useState(false); // New state to track click

    useEffect(() => {
        if (selectorScenario) {
            console.log("selectorScenario in StartButton", selectorScenario);
            console.log("startTextMsg in StartButton", startTextMsg);
            console.log("selectorScenario in StartButton, with start_button", selectorScenario[0].start_button);
            setText(selectorScenario[0].start_button);
        }
    }, [selectorScenario, startTextMsg]);

    const generateTTS = async () => {
        setClicked(true); // Mark button as clicked

        if (selectorScenario && selectorScenario[0]) {
            onToggleVad();
            const startText = selectorScenario[0].start_button;
            startTextMsg(startText);
        }

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

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const newAudio = new Audio(url);
            newAudio.oncanplaythrough = () => newAudio.play();
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
            {/* <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" /> */}
            <div className="">
                <Button
                    onClick={generateTTS}
                    className={!clicked ? "bg-green-600 hover:bg-green-700" : ""}
                    variant={clicked ? "secondary" : "default"}
                >
                    <Play />
                    Start
                </Button>
            </div>
        </div>
    );
};

export default ChatStartButton;
