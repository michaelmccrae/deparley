# [Deparley](https://www.deparley.com)

Deparley is online instruction for negotiation using practial scenarios. Emphasis is on learning by doing. Deparley is frictionless service to perform various sales calls and negotiation scenarios. Artificial intelligence is seeing growth in services that use human voice for interaction. Deparley is harnessing the best of those services.

Service is forked from [Vercel's Swift – AI Voice Assistant](https://vercel.com/templates/next.js/swift-ai-voice-assistant)

# AI and APIs

Service relies on a number of AI APIs: 

-   [Swift](https://swift-ai.vercel.app) for fast AI voice assistance.
-   [Groq](https://groq.com) is used for fast inference of [OpenAI Whisper](https://github.com/openai/whisper) (for transcription) and [Meta Llama 3](https://llama.meta.com/llama3/) (for generating the text response).
-   [Cartesia](https://cartesia.ai)'s [Sonic](https://cartesia.ai/sonic) voice model is used for fast speech synthesis, which is streamed to the frontend.
-   [VAD](https://www.vad.ricky0123.com/) is used to detect when the user is talking, and run callbacks on speech segments.
-   [Deepgram](https://www.deepgram.com) is used for modeling pauses and filler words in transcription. 

# Tech stack

The app is a [Next.js](https://nextjs.org) project written in TypeScript and deployed to [Vercel](https://vercel.com). The site also uses [Supabase](https://www.supabase.com) for the Postgresql database.


# How it all works

![Select a scenario](/lib/home.png)

![Read scenario and press start when ready to practise](/lib/scenario.png)

![After practise, you are measured on asking qualifying questions, use of filler words and pauses](/lib/readmephotos/scenario.png)
