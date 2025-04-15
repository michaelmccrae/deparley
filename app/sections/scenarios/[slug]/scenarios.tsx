"use client";

import clsx from "clsx";
import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { EnterIcon, LoadingIcon } from "@/lib/icons";
import { usePlayer } from "@/lib/usePlayer";
import { track } from "@vercel/analytics";
import { useMicVAD, utils } from "@ricky0123/vad-react";
import { createClientSupa } from "../../../../utils/supabase/client";
import ScenarioQuestionsBlurred from "@/components/scenarioQuestionsBlurred";
import Reset from "@/components/reset";
import Assess from "@/components/assessTwo";
import styles from "./styles.module.css";
import type { Database } from '../../../../lib/database.types';
import LoadingEllipsis from "@/components/loadingellipsis";
import Chat from "@/components/chat"
import { useInitVadPause } from "@/components/useInitVadPause"; // adjust path 
import Thinkinganimate from "@/lib/thinkinganimate"  // Thinking during processing
// import { AudioVisualizer } from "react-audio-visualize"; // viz audio with wave package
// import dynamic from "next/dynamic"; // viz audio with wave package
// import { LiveAudioVisualizer } from 'react-audio-visualize'; // viz audio with wave package
// import { LiveAudioVisualizer } from 'react-audio-visualize';
// import dynamic from 'next/dynamic';


type Scenarios = Database["public"]["Tables"]["scenarios"]["Row"];

type Message = {
	role: "user" | "assistant";
	content: string;
	latency?: number;
};

export default function Home({slugScenarioNumber}: {slugScenarioNumber: any | null}) {
	const [input, setInput] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);
	const [selectorScenario, setSelectorScenario] = useState<any>(null); // supabase selector
	// const [transcriptResult, setTranscriptResult] = useState<any>(null); // transcript for counting number of questions
	const submitCountRef = useRef<number>(0); // count form submissions
	const [formCount, setFormCount] = useState(0); // count form submissions
	const transcriptArrayRef = useRef<any[]>([0]); // transcript for viz and matching
	const player = usePlayer();
	const blobRef = useRef<Blob | null>(null);
	const toneRef = useRef<any | null>(null); // deepseek
	const scenarioIDRef = useRef<any | null>(null); // deepseek
	const blurRef = useRef<any | null>(null); // questions similarity blur
	const fetchCountRef = useRef<number>(0); // count fetches
	// const stopSendRef = useRef<boolean>(false); // if button pressed, stop sending to api
	const [vadPaused, setVadPaused] = useState<boolean>(false); // Track VAD state
	// const userPromptAskRef = useRef<boolean>(false); // Track user prompt ask
	const trueFalseCountRef = useRef<boolean>(true); // Track true false count
	// const [message, setMessage] = useState("Hello from Parent!"); // testing vad pause
	const [vadPassDown, setVadPassDown] = useState<boolean>(false); // pass Vad pause down 
	const toneHistoryRef = useRef<any | null>([]); // Stores the array of past tones
	const updateCountRef = useRef<any | null>(0); // Tracks how many times toneRef has been updated
	const numberOfQuestionsRef = useRef<any | null>(0); // Tracks how many questions have been asked 
	const [trueFalseUseState, setTrueFalseUseState] = useState<boolean>(true); // Track true false count
	const [similarityArray, setSimilarityArray] = useState<any>(); // Track similarity array
	const [toneDeepseek, setToneDeepseek] = useState<any | null>([]); // Track tone deepseek
	const [micStream, setMicStream] = useState<MediaStream | null>(null); // viz audio with wave package
	const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>(); // for audio visualizer
	// const [chatVadToggle, setChatVadToggle] = useState<boolean>(false); // Track chat vad toggle
	// const visualizerRef = useRef<HTMLCanvasElement>(null) // ref for audio visualizer
	// const [vizBlob, setVizBlob] = useState<Blob>();

	//vad pass down to chat

	// const toggleVadState = () => {
	// 	setChatVadToggle(true);
	//   };

	//vad pass down

	// const updateVadPassDown = () => {
	// 	setVadPassDown(true);
	//   };
	

	useEffect(() => {
		console.log("slugScenarioNumber on scenarios page", slugScenarioNumber); //check slugScenarioNumber
	}, [slugScenarioNumber]); //check slugScenarioNumber

	
	// console.log("slugScenarioNumber on scenarios page", sluslugScenarioNumberg); //check slslugScenarioNumberug

	// supabase call from slugScenarioNumber

	useEffect(() => {
		async function supabaseDeparley () {
		const supabase = createClientSupa();
		const { data: scenarios } = await supabase.from('scenarios').select().eq('scenario_id', slugScenarioNumber);
		console.log("scenarios on scenarios page", scenarios);          
		if (scenarios) {
			setSelectorScenario(scenarios);
			scenarioIDRef.current = scenarios[0].scenario_id;
		}
		}
		supabaseDeparley(); 
	}   , [slugScenarioNumber]);

	// assign number of questions

	useEffect(() => {
		if (!selectorScenario) return;
		numberOfQuestionsRef.current = selectorScenario[0].numberofquestions;
		console.log("numberOfQuestionsRef.current#############################", numberOfQuestionsRef.current);
	}, [selectorScenario]);

	// callback to vadPaused from child
	const togglingVad = (vadChildPaused:boolean) => {
		console.log("vadChildPaused$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", vadChildPaused); //check vadChildPaused
		console.log("vadChildPaused typeof $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", typeof(vadChildPaused));
		setVadPaused(vadChildPaused);
		vad.pause()
	}

	const vad = useMicVAD({
		startOnLoad: true,
		onSpeechEnd: (audio) => {
			player.stop();
			const wav = utils.encodeWAV(audio);
			const blob = new Blob([wav], { type: "audio/wav" });
			console.log("blob!!!!!!!!!!!!!!!", blob);  // aded to monitor
			blobRef.current = blob; //pass blob to assess
			submit(blob);
			// setVizBlob(blob); // set blob for audio visualizer
			const isFirefox = navigator.userAgent.includes("Firefox");
			if (isFirefox) vad.pause();
		},
		workletURL: "/vad.worklet.bundle.min.js",
		modelURL: "/silero_vad.onnx",
		positiveSpeechThreshold: 0.6,
		// negativeSpeechThreshold: 0.80, //  bumped from default of 0.35	
		minSpeechFrames: 4,
		ortConfig(ort) {
			const isSafari = /^((?!chrome|android).)*safari/i.test(
				navigator.userAgent
			);

			ort.env.wasm = {
				wasmPaths: {
					"ort-wasm-simd-threaded.wasm":
						"/ort-wasm-simd-threaded.wasm",
					"ort-wasm-simd.wasm": "/ort-wasm-simd.wasm",
					"ort-wasm.wasm": "/ort-wasm.wasm",
					"ort-wasm-threaded.wasm": "/ort-wasm-threaded.wasm",
				},
				numThreads: isSafari ? 1 : 4,
			};
		},
	});

	// vad code pause

	useInitVadPause(vad, setVadPaused); // 🧠 pauses only once

	const handleToggleVad = () => {
		if (vadPaused) {
			vad.start();
			console.log('starting VAD')
			setVadPaused(false);
		} else {
			vad.pause();
			setVadPaused(true);
		}
	};

	// vad starts on pause

	// Initial pause after VAD is ready
	// useEffect(() => {
	// 	if (!vad.loading && !vad.errored) {
	// 		vad.pause(); // auto pause on start
	// 		setVadPaused(true);
	// 	}
	// }, [vad.loading, vad.errored]);

	// const handleToggleVad = () => {
	// 	if (vadPaused) {
	// 		vad.start();
	// 		setVadPaused(false);
	// 	} else {
	// 		vad.pause();
	// 		setVadPaused(true);
	// 	}
	// };

	

	useEffect(() => {
		function keyDown(e: KeyboardEvent) {
			if (e.key === "Enter") return inputRef.current?.focus();
			if (e.key === "Escape") return setInput("");
		}

		window.addEventListener("keydown", keyDown);
		return () => window.removeEventListener("keydown", keyDown);
	});

	const [messages, submit, isPending] = useActionState<
		Array<Message>,
		string | Blob
	>(async (prevMessages, data) => {
		
			
		const formData = new FormData();
		submitCountRef.current++; // increment form submission count
		console.log('useRef count', submitCountRef.current); // check form submission count
		(()=>setFormCount(submitCountRef.current))(); // set form submission count

		if (typeof data === "string") {
			formData.append("input", data);
			track("Text input");
		} else {
			formData.append("input", data, "audio.wav");
			track("Speech input");
		}

		for (const message of prevMessages) {
			formData.append("message", JSON.stringify(message));
		}

		const submittedAt = Date.now();

		console.log("scenarioIDRef.current!!!!!!!!!!!!!!!", scenarioIDRef.current);  // added to monitor
		const initialOrEndPrompt = fetchCountInitialEnd(selectorScenario[0])

		fetchCountInitialEnd(selectorScenario[0]); // fetch count

		console.log("initialOrEndPrompt!!!!!!!!!!!!!!!", initialOrEndPrompt);  // added to monitor

		trueFalseCountRef.current = initialOrEndPrompt; // set true false count
		setTrueFalseUseState(initialOrEndPrompt); // set true false count

		const response = await fetch(`/api/apiscenario/${scenarioIDRef.current}-${initialOrEndPrompt}-${formCount}`, {
			method: "POST",
			body: formData,
		});

		console.log("formCount!!!!!!!!!!!!!!!", formCount);  // added to monitor

		const transcript = decodeURIComponent(
			response.headers.get("X-Transcript") || ""
		);
		const text = decodeURIComponent(
			response.headers.get("X-Response") || ""
		);
		//get Deepseek
		let newTone:any = decodeURIComponent(
			response.headers.get("X-Tone") || ""
		);
		// //questions similarity blur
		// blurRef.current = decodeURIComponent(
		// 	response.headers.get("X-BlurQuestion") || ""
		// );

		const blurValue = decodeURIComponent(response.headers.get("X-BlurQuestion") || "");
		blurRef.current = blurValue;
		setSimilarityArray(blurValue);

		// newTone to state variable

		setToneDeepseek(newTone); // set tone to state variable
		console.log("toneDeepseek!!!!!!!!!!!!!!!", toneDeepseek);  // added to monitor
		console.log("newTone!!!!!!!!!!!!!!!", newTone);  // added to monitor


		// counting toneRef updates and creating array

		if (toneRef.current !== newTone) {
			toneRef.current = newTone;
			updateCountRef.current += 1;
	
			toneHistoryRef.current.push({
			  id: updateCountRef.current, // Unique identifier
			  tone: newTone,
			  timestamp: new Date().toISOString(),
			});
		  }

		  console.log("toneHistoryRef.current!!!!!!!!!!!!!!!", toneHistoryRef.current);  // added to monitor
		  console.log("updateCountRef.current!!!!!!!!!!!!!!!", updateCountRef.current);  // added to monitor

		if (!response.ok || !transcript || !text || !response.body) {
			if (response.status === 429) {
				toast.error("Too many requests. Please try again later.");
			} else {
				toast.error((await response.text()) || "An error occurred.");
			}

			return prevMessages;
		}

		console.log("blurRef.current!!!!!!!!!!!!!!!", blurRef.current);  // added to monitor

		console.log("toneRef.current!!!!!!!!!!!!!!!", toneRef.current);  // added to monitor
		console.log("JSON.stringify(toneRef.current)!!!!!!!!!!!!!!!", JSON.stringify(toneRef.current));  // added to monitor
		console.log("toneRef.current!!!!!!!!!!!!!!!", typeof toneRef.current);  // added to monitor

		const latency = Date.now() - submittedAt;
		// modified code to stop when formCount is equal to number of questions
		if (formCount !== selectorScenario?.[0]?.numberofquestions) {
			player.play(response.body, () => {
				const isFirefox = navigator.userAgent.includes("Firefox");
				if (isFirefox) vad.start();
			});
		} else {
			console.log("Audio playback skipped: max number of questions reached.");
		}
		
		setInput(transcript);
		console.log("input!!!!!!!!!!!!!!!", input);  // added to monitor

		// console.log("transcript!!!!!!!!!!!!!!!", transcript);  // added to monitor
		// console.log("prevMessages", prevMessages);  // added to monitor
		// prevMessageRef.current = [transcript];
		// console.log("prevMessageRef.current!!!!!!!!!!!!!", prevMessageRef.current);  // added to monitor

		transcriptArrayRef.current = [...transcriptArrayRef.current, transcript]; // transcipt to ref for viz and matching
		console.log("transcriptArrayRef.current^^^^^^^^^^^^^^^^^^", transcriptArrayRef.current);  // added to monitor
		

		return [
			...prevMessages,
			{
				role: "user",
				content: transcript,
			},
			{
				role: "assistant",
				content: text,
				latency,
			},
		];
	}, []);

	function handleFormSubmit(e: React.FormEvent) {
		e.preventDefault();
		// if (stopSendRef.current==true) {
        //     console.log("Form submission stopped by stopSendRef");
        //     return; // Exit the submit handler
        // }
		submit(input);
	}




// count questions stop short of total number of questions

function fetchCountInitialEnd(x:any) {
	if (fetchCountRef.current < x.numberofquestions) {
		fetchCountRef.current++
		console.log("fetchCount!!!!!!!!!!!!!!!!!!!!! counting", fetchCountRef.current)
		console.log("x.numberofquestions INITIAL!!!!!!!!!!!!!!!!!!!!! counting", x.numberofquestions)
		console.log("initialPrompt!!!!!!!!!!!!!!!!!!!!! counting", x.initialprompt)
		return true
	} else {
		console.log("fetchCount!!!!!!!!!!!!!!!!!!!!! end", fetchCountRef.current)
		console.log("x.numberofquestions END!!!!!!!!!!!!!!!!!!!!! counting", x.numberofquestions)
		console.log("endprompt!!!!!!!!!!!!!!!!!!!!! end", x.endprompt)
		
		
		return false
	}
	fetchCountRef.current++
}

		// warning to respond to user's question

		

		useEffect(() => {
		if (!selectorScenario) return;
		console.log("Please respond to the user's question#############################");
		console.log("fetchCountRef.current#############################", fetchCountRef.current);
		console.log("selectorScenario[0].numberofquestions#############################", selectorScenario[0].numberofquestions);
		}, [selectorScenario]);


// useEffect(() => {
// 	if (messages) {
// 		console.log("messages#############################", messages);
// 		// console.log("messages[0].content#############################", messages.content);
// 		// console.log("messages[1].content#############################", messages[1].content);
// 	}
// }, [messages]);

// viz audio with wave package

		// useEffect(() => {
		// 	navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
		// 		setMicStream(stream);
		// 	});
		// }, []);

// viz audio with wave package


		// const AudioWave = dynamic(() => import("@/components/chataudiowave"), {ssr: false,}); // 👈 THIS is key

// viz audio try again

		// useEffect(() => {
		// 	if (!micStream) return;
		
		// 	const recorder = new MediaRecorder(micStream);
		// 	setMediaRecorder(recorder);
		// 	recorder.start();
		
		// 	return () => {
		// 	recorder.stop();
		// 	};
		// }, [micStream]);

// viz audio try again and again

		// useEffect(() => {
		// 	navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
		// 	  setMicStream(stream);
		// 	});
		//   }, []);

		//   const LiveAudioVisualizer = dynamic(
		// 	() => import('react-audio-visualize').then((mod) => mod.LiveAudioVisualizer),
		// 	{ ssr: false }
		//   );
  
		

	return (
		
		<div className="w-full max-w-3xl">

				<div className="flex justify-center py-4">
				<div className={clsx(
					" h-10 w-10 rounded-[6px] -z-50",
					"bg-gradient-to-b from-blue-400 to-purple-800",
					vad.userSpeaking ? styles.highenergyspin : styles.lowenergyspin,
					{
					"opacity-0": vad.loading || vad.errored,
					"opacity-50": !vad.loading && !vad.errored && !vad.userSpeaking,
					"opacity-100": vad.userSpeaking,
					}
				)} />
				</div>
				<div className="flex justify-center py-4">

				<div className="">{isPending ? <Thinkinganimate /> : ""}</div>

				</div>

		





				<div className="flex justify-center">

			
		

				<Chat selectorScenario={selectorScenario} messages={messages} similarityArray={similarityArray} toneDeepseek={toneDeepseek} onToggleVad={handleToggleVad} vadPaused={vadPaused} formCount={formCount}/>

				</div>
			</div>
		
	);
}

function A(props: any) {
	return (
		<a
			{...props}
			className="text-neutral-500 dark:text-neutral-500 hover:underline font-medium"
		/>
	);
}
