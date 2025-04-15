// export const runtime = 'edge'; // 'nodejs' is the default fixing https://vercel.com/docs/functions/runtimes/edge
export const runtime = 'nodejs';

import Groq from "groq-sdk";
import { headers } from "next/headers";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { unstable_after as after } from "next/server";

import { createClient } from "@deepgram/sdk"; // adding deepgram
import { createClientSupa } from '../../../../utils/supabase/client' // supabase server
import {CARTESIA_VOICE_ONE} from "@/lib/caretesiavoiceone"

// const { v4: uuidv4 } = require('uuid'); // adding uuid for sesssions

const groq = new Groq();


// const newSessionId = uuidv4(); // Generate a new session ID

// console.log("newSessionId!!!!!!!!!!!!!!!!!!!!!", newSessionId)

const schema = zfd.formData({
	input: z.union([zfd.text(), zfd.file()]),
	message: zfd.repeatableOfType(
		zfd.json(
			z.object({
				role: z.enum(["user", "assistant"]),
				content: z.string(),
			})
		)
	),
});

// supabase server

// const scenarioServer = async function () {
//         const supabase = createClientSupa();
//         const { data: scenarios } = await supabase.from('scenarios').select().eq('scenario_id', 1);
//         console.log("scenarios on scenarios page$$$$$$$$$$$$$$$$$$$$$$$$$$$", scenarios);   
//         return scenarios
// }

// console.log("scenarioServer!!!!!!!!!!!!!!!!!!!!!", scenarioServer())

// supabase better

 async function scenarioData (x:any) {
    const supabase = createClientSupa();
    const { data: scenario } = await supabase.from('scenarios').select().eq('scenario_id', x);
    return scenario
}

// async function uuidSupa (x:any) {
//     const supabase = createClientSupa();
//     const { data: scenario } = await supabase.from('scenarios').select().eq('level', x);
// 	console.log("scenario!!!!!!!!!!!!!!!!!!!!!", scenario)
//     return scenario
// }



// console.log("scenarioServer!!!!!!!!!!!!!!!!!!!!!", scenarioServer())


export async function POST(request: Request, {params }: {params: Promise<{ slug: any }>}) {
	console.time("transcribe " + request.headers.get("x-vercel-id") || "local");

	const { data, success } = schema.safeParse(await request.formData());
	if (!success) return new Response("Invalid request", { status: 400 });

	const transcript = await getTranscript(data.input);
	if (!transcript) return new Response("Invalid audio", { status: 400 });

	console.timeEnd(
		"transcribe " + request.headers.get("x-vercel-id") || "local"
	);
	console.time(
		"text completion " + request.headers.get("x-vercel-id") || "local"
	);

    

    
    // check params

    // console.log("slugScenarioNumber!!!!!!!!!!!!!!!!!!!!!", slugScenarioNumber)
    const getParams = (await params).slug
	console.log("getParams!!!!!!!!!!!!!!!!!!!!!", getParams[0])
	console.log("{getParams}!!!!!!!!!!!!!!!!!!!!!", {getParams})
	console.log("getParams type of!!!!!!!!!!!!!!!!!!!!!", typeof getParams)
	// console.log("getParams forCount`````````````````````````````!!!!!!!!!!!!!!!!!!!!!`````````````````````````````", typeof getParams[2])
	// let formCountNumber = Number(getParams[2])
	// console.log("formCountNumber`````````````````````!!!!!!!!!!!!!!!!!!!!!`````````````````````", formCountNumber)
	// console.log("formCountNumber type of``````````````````````````````!!!!!!!!!!!!!!!!!!!!!", typeof formCountNumber)



	// separate params
	
	const parseGetParams = (inputObject:any) => {
		const [setSelector, initialEnd, formCount] = inputObject.getParams.split('-');
		return {
		  setSelector: parseInt(setSelector, 10),
		  initialEnd: initialEnd.toLowerCase() === 'true',
		  formCount: parseInt(formCount, 10) 
		};
	  };

	  console.log("parseGetParams(getParams)!!!!!!!!!!!!!!!!!!!!!", parseGetParams({getParams: getParams}))
	  let arrayGetParams = parseGetParams({getParams: getParams})
	  console.log("arrayGetParams.formCount!!!!!!!!!!!!!!!!!!!!!", arrayGetParams.formCount)
	//   let formCountNumber = Number(arrayGetParams[2])
	//   console.log("formCountNumber`````````````````````!!!!!!!!!!!!!!!!!!!!!`````````````````````", formCountNumber)
	//   console.log("formCountNumber type of``````````````````````````````!!!!!!!!!!!!!!!!!!!!!", typeof formCountNumber)

	  const { setSelector, initialEnd, formCount } = parseGetParams({getParams: getParams});

		

	  // select initial or end prompt
	  function selectInitialEndPrompt (x:any) {
		if (x == true) {
			// console.log("slugScenarioNumber!!!!!!!!!!!!!!!!!!!!!", slugScenarioNumber[0])
			console.log("slugScenarioNumber.initialprompt!!!!!!!!!!!!!!!!!!!!!", slugScenarioNumber[0].initialprompt)
			return slugScenarioNumber[0].initialprompt
		} else {
			// console.log("slugScenarioNumber!!!!!!!!!!!!!!!!!!!!!", slugScenarioNumber[0])
			console.log("slugScenarioNumber.endprompt!!!!!!!!!!!!!!!!!!!!!", slugScenarioNumber[0].endprompt)
			return slugScenarioNumber[0].endprompt
		}
	  }


	// let slugNumber:number = parseInt(getParams[0])

    // check supbase data with slug

    const slugScenarioNumber:any = await scenarioData(setSelector)
    console.log("slugScenarioNumber[0].initialprompt!!!!!!!~~~~~~~~~~~~~~~~~~~~~~!!!!!!!!!!!!!!", slugScenarioNumber[0].initialprompt)

	// checking uuid
	console.log("slugScenarioNumber.uuid_session_start&&&&&&&&&&&&&&&&&&&&&&&&&&&&&", slugScenarioNumber[0].uuid_session_start)

	//checking number of questions
	console.log("slugScenarioNumber.numberofquestions&&&&&&&&&&&&&&&&&&&&&&&&&&&&&", slugScenarioNumber[0].numberofquestions)



	// const uuidFromParam:any = await uuidSupa(setSelector)
	// console.log("setSelector!!!!!!!!!!!!!!!!!!!!!", setSelector)
	// console.log("uuidFromParam!!!!!!!!!!!!!!!!!!!!!", uuidFromParam)

	const deepgramResult:any = await deepgramAPI (data.input)
	console.log("deepgramResult@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", deepgramResult)
	console.log("typeof deepgramResult@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", typeof deepgramResult)
	console.log("deepgramResult.results.channels[0].alternatives[0].transcript", deepgramResult.results.channels[0].alternatives[0].transcript)
	console.log("deepgramResult.results.channels[0].alternatives[0]#################", deepgramResult.results.channels[0].alternatives[0])
	console.log("deepgramResult.results.channels[0].alternatives[0].words", deepgramResult.results.channels[0].alternatives[0].words)
	console.log("deepgramResult.results.channels[0].alternatives[0].words[0]", deepgramResult.results.channels[0].alternatives[0].words[0])

	console.log("JSON.stringify(deepgramResult.results.channels[0].alternatives[0].words[0])", JSON.stringify(deepgramResult.results.channels[0].alternatives[0].words[0]))
	let deepgramJSON = JSON.stringify(deepgramResult.results.channels[0].alternatives[0].words) 
	// let deepgramJSON = await deepgramResult.results.channels[0].alternatives[0].words


	// test working function counter for prompts
	// console.log("fetchCount for prompt!!!!!!!!!!!!!!!!!!!!!", fetchCountInitialEnd(slugScenarioNumber[0]))

	// other sentence similarity

	let blurQuestion = await query({"inputs": {
		"source_sentence": transcript,
		"sentences": slugScenarioNumber[0].questions
	}}).then((response) => {
		console.log("HF other sentence similarity^^^^^^^^^^^^^^^^^^^",JSON.stringify(response));
		return JSON.stringify(response);
	});


	

	// console.log("slugScenarioNumber[0]##############################", slugScenarioNumber[0])
	// console.log("fetchCountInitialEnd(slugScenarioNumber[0]################################", fetchCountInitialEnd(slugScenarioNumber[0]))

	// console.log("slugScenarioNumber[0].questions++++++++++++++++++++++++++++++++", slugScenarioNumber[0].questions)	

	// console.log("fetchCountInitialEnd(slugScenarioNumber[0])++++++++++++++++++++++++++++++++", fetchCountInitialEnd(slugScenarioNumber[0]))	


	// const completion = await groq.chat.completions.create({
	// 	model: "llama3-8b-8192",
	// 	messages: [
	// 		{
	// 			role: "system",
	// 			content: `
	// 		- Respond briefly to the user's request, and do not provide unnecessary information.
	// 		- If you don't understand the user's request, ask for clarification.
	// 		- You do not have access to up-to-date information, so you should not provide real-time data.
	// 		- You are not capable of performing actions other than responding to the user.
	// 		- Do not use markdown, emojis, or other formatting in your responses. Respond in a way easily spoken by text-to-speech software.
	// 		- User location is ${location()}.
	// 		- The current time is ${time()}.
	// 		-${selectInitialEndPrompt(initialEnd)}.`,
	// 		},
	// 		...data.message,
	// 		{
	// 			role: "user",
	// 			content: transcript,
	// 		},
	// 	],
	// });

	console.log("slugScenarioNumber[0].initialprompt!!!!!!!!!!!!!!!!!!!!!", slugScenarioNumber[0].initialprompt)

	let completion; // Declare completion outside the if/else

	let initialPromptPre = await slugScenarioNumber[0].initialprompt
	let endPromptPre = await slugScenarioNumber[0].endprompt
	console.log("initialPromptPre!!!!!!!!!!!!!!!!!!!!!", initialPromptPre)
	console.log("endPromptPre!!!!!!!!!!!!!!!!!!!!!", endPromptPre)

		if ( initialEnd == true) {
			completion = await groq.chat.completions.create({
				model: "llama3-8b-8192",
				messages: [
					{
						role: "system",
						content: `
							- Respond briefly to the user's request, and do not provide unnecessary information.
							- If you don't understand the user's request, ask for clarification.
							- You do not have access to up-to-date information, so you should not provide real-time data.
							- You are not capable of performing actions other than responding to the user.
							- Do not use markdown, emojis, or other formatting in your responses. Respond in a way easily spoken by text-to-speech software.
							- User location is ${location()}.
							- The current time is ${time()}.
							-${initialPromptPre}.`,
					},
				...data.message,
					{
						role: "user",
						content: transcript,
					},
				],
			});
		} else {
			completion = await groq.chat.completions.create({
				model: "llama3-8b-8192",
				messages: [
					{
						role: "system",
						content: `
							- Respond briefly to the user's request, and do not provide unnecessary information.
							- If you don't understand the user's request, ask for clarification.
							- You do not have access to up-to-date information, so you should not provide real-time data.
							- You are not capable of performing actions other than responding to the user.
							- Do not use markdown, emojis, or other formatting in your responses. Respond in a way easily spoken by text-to-speech software.
							- User location is ${location()}.
							- The current time is ${time()}.
							-${endPromptPre}.`,
					},
				//...data.message,
					{
						role: "user",
						content: transcript,
					},
				],
			});
		}

	const response = completion.choices[0].message.content;

	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

	// console.log("GROQ REQUEST:>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", {
	// 	model: "llama3-8b-8192",
	// 	messages: [
	// 		{
	// 			role: "system",
	// 			content: `
	// 		- Respond briefly to the user's request, and do not provide unnecessary information.
	// 		- If you don't understand the user's request, ask for clarification.
	// 		- You do not have access to up-to-date information, so you should not provide real-time data.
	// 		- You are not capable of performing actions other than responding to the user.
	// 		- Do not use markdown, emojis, or other formatting in your responses. Respond in a way easily spoken by text-to-speech software.
	// 		- User location is ${location()}.
	// 		- The current time is ${time()}.
	// 		-${selectInitialEndPrompt(initialEnd)}.`,
	// 		},
	// 		...data.message,
	// 		{
	// 			role: "user",
	// 			content: transcript,
	// 		},
	// 	],
	// });




	//  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    // console.log ("response@@@@@@@@@@2", response)
    // console.log ("transcript!!!!!!!!!!!!!!!!!!!1", transcript)
	
    
    console.timeEnd(
		"text completion " + request.headers.get("x-vercel-id") || "local"
	);

	console.time(
		"cartesia request " + request.headers.get("x-vercel-id") || "local"
	);

	const voice = await fetch("https://api.cartesia.ai/tts/bytes", {
		method: "POST",
		headers: {
			"Cartesia-Version": "2024-06-30",
			"Content-Type": "application/json",
			"X-API-Key": process.env.CARTESIA_API_KEY!,
		},
		body: JSON.stringify({
			model_id: "sonic-english",
			transcript: response,
			voice: {
				mode: "id",
				id: randomVoice(),
			},
			output_format: {
				container: "raw",
				encoding: "pcm_f32le",
				sample_rate: 24000,
			},
		}),
	});

	console.timeEnd(
		"cartesia request " + request.headers.get("x-vercel-id") || "local"
	);

	if (!voice.ok) {
		console.error(await voice.text());
		return new Response("Voice synthesis failed", { status: 500 });
	}

	console.time("stream " + request.headers.get("x-vercel-id") || "local");
	after(() => {
		console.timeEnd(
			"stream " + request.headers.get("x-vercel-id") || "local"
		);
	});

	// return new Response(voice.body, {
	// 	headers: {
	// 		"X-Transcript": encodeURIComponent(transcript),
	// 		"X-Response": encodeURIComponent(response),
	// 		"X-Tone": encodeURIComponent(deepgramJSON),
	// 		"X-BlurQuestion": encodeURIComponent(blurQuestion)
	// 	},
	// });

	// put return in if else to stop voice at end of questions

	if ( formCount < setSelector ) {
		console.log("formCount11111111111111111111111111111", formCount)
		console.log("setSelector222222222222222222222222222222222222", setSelector)
		
		return new Response(voice.body, {
				headers: {
					"X-Transcript": encodeURIComponent(transcript),
					"X-Response": encodeURIComponent(response),
					"X-Tone": encodeURIComponent(deepgramJSON),
					"X-BlurQuestion": encodeURIComponent(blurQuestion)
				},
			});
		} else {
			console.log("formCountFALSEFALSEFALSEFALSEFALSEFALSEFALSE", formCount)
			console.log("setSelectorFALSEFALSEFALSEFALSEFALSEFALSEFALSEFALSE", setSelector)
		
		return new Response(null, {
				headers: {
					// "X-Transcript": encodeURIComponent(transcript),
					"X-Response": encodeURIComponent(response),
					"X-Tone": encodeURIComponent(deepgramJSON),
					"X-BlurQuestion": encodeURIComponent(blurQuestion)
				},
			});
		}
		
}

function location() {
	const headersList = headers();

	const country = headersList.get("x-vercel-ip-country");
	const region = headersList.get("x-vercel-ip-country-region");
	const city = headersList.get("x-vercel-ip-city");

	if (!country || !region || !city) return "unknown";

	return `${city}, ${region}, ${country}`;
}

function time() {
	return new Date().toLocaleString("en-US", {
		timeZone: headers().get("x-vercel-ip-timezone") || undefined,
	});
}

async function getTranscript(input: string | File) {
	if (typeof input === "string") return input;

	try {
		const { text } = await groq.audio.transcriptions.create({
			file: input,
			model: "whisper-large-v3",
		});

		return text.trim() || null;
	} catch {
		return null; // Empty audio file
	}
}

// deepgram

const deepgram = createClient("DEEPGRAM_API_KEY");

// async function deepgramAPI (input: any) {
// 	if (typeof input === "string") return input;

// 	// const arrayBuffer = await File.arrayBuffer();
//     // return Buffer.from(arrayBuffer);

// 	try {
//     console.log("transcribe func", input)
//     const deepgram = createClient(process.env.DEEPGRAM_KEY);

//     const { result, error } = await deepgram.listen.prerecorded.transcribeFile(input,
		
//         {
//           model: "nova-2",
// 		  sentiment: true,
// 		  filler_words: true
//         }
//     );
// 	// const findings = result.json();
// 	console.log("result deepgram!!!!!!!!!!!!!!!!", result);

// 	return result;
// 	} catch (error) {
//     console.error(error);

// 	} 
//   };

// modified with error, try and catch

async function deepgramAPI(input: any) {
    if (typeof input === "string") return input;

    try {
        console.log("Transcribing with Deepgram:", input);
        const deepgram = createClient(process.env.DEEPGRAM_KEY);
        const { result, error } = await deepgram.listen.prerecorded.transcribeFile(input, {
            model: "nova-2",
            sentiment: true,
            filler_words: true,
        });

        if (error) {
            console.error("Deepgram API Error:", error);
            return null;
        }

        console.log("Deepgram response:", result);
        return result;
    } catch (err) {
        console.error("Deepgram API Call Failed:", err);
        return null;
    }
}


  // sentence similarity 

 

async function query(data: Record<string, any> | null): Promise<void> {
	// fetchCount++
	// console.log("fetchCount!!!!!!!!!!!!!!!!!!!!! in function", fetchCount)
	// fetchCountInitialEnd()
	const response = await fetch(
		"https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2",
		{
			headers: {
				Authorization: process.env.HF_API_KEY!,
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(data),
		}
	);
	const result = await response.json();
	console.log("HF other sentence similarity^^^^^^^^^^^^^^^^^^^",result);
	return result;
}

// fetch count 

// let fetchCount = 0

// function fetchCountInitialEnd(x:any) {
// 	if (fetchCount <= x.numberofquestions) {
// 		fetchCount++
// 		console.log("fetchCount!!!!!!!!!!!!!!!!!!!!! counting", fetchCount)
// 		console.log("x.numberofquestions INITIAL!!!!!!!!!!!!!!!!!!!!! counting", x.numberofquestions)
// 		console.log("initialPrompt!!!!!!!!!!!!!!!!!!!!! counting", x.initialprompt)
// 		return x.initialprompt
// 	} else {
// 		console.log("fetchCount!!!!!!!!!!!!!!!!!!!!! end", fetchCount)
// 		console.log("x.numberofquestions END!!!!!!!!!!!!!!!!!!!!! counting", x.numberofquestions)
// 		console.log("endprompt!!!!!!!!!!!!!!!!!!!!! end", x.endprompt)
// 		return x.endprompt
// 	}
// 	fetchCount++
// }

// random voice from Cartesia

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


