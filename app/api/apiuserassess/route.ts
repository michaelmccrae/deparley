import {NextResponse} from 'next/server';
import Groq from "groq-sdk";

const groq = new Groq();

// call Groq to assess user's response to question

        async function fetchUserData(systemInput: any, contentInput: any) {
            try {
                const completion = await groq.chat.completions.create({
                    model: "llama3-8b-8192",
                    messages: [
                        {
                            role: "system",
                            content: JSON.stringify(systemInput),
                        },
                        {
                            role: "user",
                            content: JSON.stringify(contentInput),
                        },
                    ],
                    "response_format": {
                        "type": "json_object"
                      },
                });

                console.log("API Response:", completion); // ✅ Logs response to console
                return completion; // ✅ Returns response so the calling function can use it
            } catch (error) {
                console.error("Error fetching data:", error); // ✅ Logs errors
                throw new Error("Failed to fetch user data"); // Optional: Throw error for client handling
            }
        }

// map through deepgram

        function extractWords(data:any) {
            // Map through the array and extract the "word" values
            return data.map((entry: { word: any; }) => entry.word).join(" ");
            }

export async function POST(request: Request) {
    const user_assess = await request.json();
    console.log("user_assess^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",  user_assess);
    console.log("user_assess.assess_end----------------------------", user_assess.assess_end);
    console.log("user_assess.wordsFromDeepgram----------------------------", user_assess.deeseekTranscript);

    console.log("JSON.stringify user_assess.assess_end----------------------------", JSON.stringify(user_assess.assess_end));
    console.log(" JSON.stringify user_assess.wordsFromDeepgram----------------------------", JSON.stringify(user_assess.deeseekTranscript));

    // console.log("JSON.parse(user_assess.toneRefBlur)----------------------------", JSON.parse(user_assess.toneRefBlur));
    // const wordsFromDeepgram = extractWords(JSON.parse(user_assess.toneRefBlur));
    // console.log("wordsFromDeepgram^^^^^^^^^^^^^^^^^^^^^^^^^^^^^", wordsFromDeepgram);
    const groqAssess = await fetchUserData(user_assess.assess_end, user_assess.deeseekTranscript);
    console.log("groqAssess^^^^^^^^^^^^^^^^^^^^^^^^^^^^^", groqAssess);
    return Response.json({ groqAssess });

    // const data = await request.json();
    // console.log("data^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^", data);
    // const JSONPlaceholder = await fetchUserData(data);
    // console.log("@@@@@@@@@@@@@@@@@@@",JSONPlaceholder);
    // return Response.json({ JSONPlaceholder })
}