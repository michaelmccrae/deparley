'use client'; 

import React, { useEffect, useState } from 'react';
import styles from "./styles.module.css";
import { Button } from "@/components/ui/button";
import Chatassess from "@/components/chatassess";
import { SENTENCE_SIMILARITY_THRESHOLD, ASSESS_API_PAUSE } from "@/lib/constants";
import Chatprogress from "./chatprogress";
import Chartstartbutton from "@/components/chatstartbutton";
import Chatreset from "@/components/chatreset";
import { Play, PenLine, CircleCheckBig, Circle } from 'lucide-react';
// import Chatvizaudio from "./chatvizaudio";
import Waitinganimate from "@/lib/waitinganimate";

const Chat = ({ selectorScenario, messages, similarityArray, toneDeepseek, onToggleVad, vadPaused, formCount }: any) => {
    const [startMessage, setStartMessage] = useState("Waiting...");
    const [combinedArray, setCombinedArray] = useState<any[]>([]);
    const [mergedMsgSimilarity, setMergedMsgSimilarity] = useState<any[]>([]);
    const [assessVisible, setAssessVisible] = useState(false);
    const [isFormComplete, setIsFormComplete] = useState(false); // changes when formCount and selectorScenario are equal

    useEffect(() => {
        if (selectorScenario) {
            console.log('selectorScenario in chat', selectorScenario);
            console.log("selectorScenario[0].start_button", selectorScenario[0].start_button);
            console.log("messages in chat", messages);
            console.log("similairityArray in chat", similarityArray);
        }
    }, [selectorScenario, messages, similarityArray]);

    const startTextMsg = () => {
        if (selectorScenario && selectorScenario.length > 0) {
        //     console.log("selectorScenario[0].start_button", selectorScenario[0].start_button);
        //     // onToggleVad();
        //     const startText = selectorScenario[0].start_button;
        //     console.log("startText", startText);
        //     setStartMessage(startText);
            
        // }
        setStartMessage(selectorScenario[0].start_button); // pull start dialogue from selectorScenario
        }
    };

    function buildArrayOfArrays(...arrays: any[]) {
        const result: any[] = [];
        arrays.forEach(arr => {
            result.push(arr);
        });
        return result;
    }

    // Update combinedArray from similairityArray
    useEffect(() => {
        if (similarityArray && similarityArray.length > 0) {
            console.log("similarityArray", similarityArray);
            const newArray = buildArrayOfArrays(similarityArray);
            setCombinedArray(prev => [...prev, newArray]);
        }
    }, [similarityArray]);

    // function to merge similarity into messages

    function mergeSimilarityIntoMessages(messageArray: any[], similarityArray: any[]) {
        let toneIndex = 0;

        return messageArray.map((entry) => {
            if (entry.role === "user" && similarityArray[toneIndex]) {
                const similarity = JSON.parse(similarityArray[toneIndex][0]);
                toneIndex += 1;

                return {
                    ...entry,
                    similarity,
                };
            }
            return entry;
        });
    }

    // modified to stop after ~ formCout and number of questions are equal

    useEffect(() => {
        if (messages && combinedArray.length > 0 && selectorScenario?.[0]?.numberofquestions != null) {
            const cappedMessages = messages.slice(0, selectorScenario[0].numberofquestions * 2); // user + assistant = 2 messages per Q
            const cappedSimilarities = combinedArray.slice(0, selectorScenario[0].numberofquestions);
            const newMessages = mergeSimilarityIntoMessages(cappedMessages, cappedSimilarities);
            setMergedMsgSimilarity(newMessages);
        }
    }, [messages, combinedArray, selectorScenario]);

    // old code from above, but not used

    // useEffect(() => {
    //     if (messages && combinedArray.length > 0) {
    //         const newMessages = mergeSimilarityIntoMessages(messages, combinedArray);
    //         setMergedMsgSimilarity(mergeSimilarityIntoMessages(messages, combinedArray));
    //     }
    // }, [messages, combinedArray]);
    

    // what if for conditions

    let messageBubbles: JSX.Element[] = [];



        if (mergedMsgSimilarity.length > 0) {
            console.log("mergedMsgSimilarity in map chat", mergedMsgSimilarity);
            messageBubbles = mergedMsgSimilarity.map((msg: any, index: number) => {
                let bubbleClass = '';
                const isUser = msg.role === 'user';
                const hasHighSimilarity = msg.similarity?.some((score: number) => score > SENTENCE_SIMILARITY_THRESHOLD);

                if (isUser && hasHighSimilarity) {
                    bubbleClass = styles.userBubbleSimilar;
                } else if (isUser) {
                    bubbleClass = styles.userBubbleNotSimilar;
                } else {
                    bubbleClass = styles.botBubble;
                }

                return (
                    <div
                    key={`msg-${index}`}
                    className={`${styles.chatBubble} ${bubbleClass}`}
                >
                    <span className="inline-flex items-center space-x-2">
                    {isUser && hasHighSimilarity && (
                        <span><CircleCheckBig color="black" /></span>
                    )}
                    {isUser && !hasHighSimilarity && (
                        <span><Circle color="black" /></span>
                    )}
                    <span>{msg.content}</span>
                    </span>
                </div>
                );
            });
        }


    // assess button
    const handleAssessButton = () => {
        setAssessVisible(true);
        onToggleVad();
        }

    // blank words to format chat

    function blankWords() {
        return <div className={`${styles.chatBubble} ${styles.blankBubble}`}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas ratione commodi explicabo, quia dolorem fugit eos ipsam. </div>;
    } 
    
    // alert when formCount and selectorScenario are equal
    useEffect(() => {
        if (selectorScenario && selectorScenario.length > 0 && typeof formCount === 'number') {
            const numQuestions = selectorScenario[0].numberofquestions;
            setIsFormComplete(formCount === numQuestions);
        }
    }, [formCount, selectorScenario]);

    // Optional: Debugging logs (can remove later)
    
    useEffect(() => {
        console.log("formCount:", formCount);
        console.log("selectorScenario[0].numberofquestions:", selectorScenario?.[0]?.numberofquestions);
        console.log("isFormComplete:", isFormComplete);
    }, [isFormComplete]);


    return (
        <div>
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
            
            <div className="py-2"></div>

            <div><Chatprogress mergedMsgSimilarity={mergedMsgSimilarity} selectorScenario={selectorScenario} /></div>

            <div className={styles.chatContainer}>
                <div className={`${styles.chatBubble} ${styles.botBubble}`}>
                    {startMessage}
                    </div>
                    {messageBubbles}
                    <div>{blankWords()}</div>
               
                </div>

                <div className="pb-6">
                {assessVisible && 
                <div className="pt-6">
                    <Chatassess selectorScenario={selectorScenario} mergedMsgSimilarity={mergedMsgSimilarity} toneDeepseek={toneDeepseek} assessVisible={assessVisible}/>
                </div>
                }

        </div>

            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

            {/* <Chatvizaudio /> */}

            <div className="flex justify-center">
                <div className="p-6">
                {isFormComplete && (
                <div className={styles.fadeIn}>
                Respond to question
                </div>
                )}
                </div>
            </div>

            <div className="pb-6">
                <Chartstartbutton startTextMsg={startTextMsg} selectorScenario={selectorScenario} onToggleVad={onToggleVad} vadPaused={vadPaused}/>
                </div>

                <div className="pb-6">
                    <Button
                        variant={formCount >= selectorScenario?.[0]?.numberofquestions + 1 ? "default" : "secondary"}
                        className={formCount >= selectorScenario?.[0]?.numberofquestions + 1 ? "bg-green-600 hover:bg-green-700" : ""}
                        onClick={handleAssessButton}
                    >
                        <PenLine />Assess
                    </Button>
                    </div>


            {/* <div className=""><Button variant="secondary" onClick={generateTTS}><Play />Start</Button> </div> */}

            {/* <div className="pb-6">
                <Button>Reset</Button>
            </div> */}

            <div className="pb-6">
                <Chatreset />
            </div>

           

            

            

            
        </div>

    );

};

export default Chat;