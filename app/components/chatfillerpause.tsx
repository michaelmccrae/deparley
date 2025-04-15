import React, {useEffect, useState, useRef} from 'react';
import {FILLER_WORDS} from "@/lib/fillerwords";
import { Button } from "@/components/ui/button";
import { Info, Smile   } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { PAUSE_WORD_GAP } from "@/lib/constants";

const Chatfillerpause = ({toneDeepseek, setFillerCount, setPauseCount}: any) => {
  const [toneVizModel, setToneVizModel] = useState<any[]>([]);
  const [numberOfFillerWords, setNumberOfFillerWords] = useState(0);
  const [numberOfPauses, setNumberOfPauses] = useState(0);

  useEffect(() => {
    console.log("toneDeepseek in Chat component", toneDeepseek);
  }, [toneDeepseek]);

  useEffect(() => {
    let toneDeepseekObject = JSON.parse(toneDeepseek);
    console.log("toneDeepseekObject in Chatfillerpause component", toneDeepseekObject);
    let toneDeepseekStarts = addNextWordStart(toneDeepseekObject);
    console.log("toneDeepseekStarts in Chatfillerpause component", toneDeepseekStarts);
    let nextWordStart = addNextWordStart(toneDeepseekStarts)
    console.log("nextWordStart in Chatfillerpause component", nextWordStart);  
    const fillerWordKey = addFillerWordKey(nextWordStart);
    console.log("fillerWordKey%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%", fillerWordKey);
    const gapMeasure = calculateWordGaps(fillerWordKey);
    console.log("gapMeasure!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", gapMeasure);
    setToneVizModel(gapMeasure);
    // console.log("responseAssess!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", responseAssess); 

  }, [toneDeepseek]);


  // Function to add the nextwordstart key to each word object

  const addNextWordStart = (x:any) => {

    // Iterate through the array
    for (let i = 0; i < x.length; i++) {
        // If this is not the last word, set nextwordstart to the start of the next word
        if (i < x.length - 1) {
        x[i].nextwordstart = x[i + 1].start;
        } else {
        // For the last word, set it to its own end time
        x[i].nextwordstart = x[i].end;
        }
    }
    return x;
    };

// Function to add the fillerword key to each word object
        
    const addFillerWordKey = (data: any) => {
        // Map over the words array
        const updatedWords = data.map((wordObj: any) => {
            // Check if the word is a filler word
            const isFillerWord = FILLER_WORDS.includes(wordObj.word.toLowerCase());
    
            // Add the fillerword key to the word object
            return {
                ...wordObj,
                fillerword: isFillerWord,
            };
        });
    
        // Return the updated words array
        return updatedWords;
    };

    // add pause calculation

    function calculateWordGaps(data:any) {
      for (let i = 0; i < data.length; i++) {
        const currentWord = data[i];
        const nextWord = data[i + 1];
    
        if (nextWord) {
          currentWord.wordgap = nextWord.start - currentWord.end;
        } else {
          // Handle the last word, where there's no next word.  You can either:
          // 1. Set wordgap to 0 (or some other default value)
          // 2. Or, you can omit the wordgap property entirely for the last word
          currentWord.wordgap = 0; // Option 1: Setting to 0
          //delete currentWord.nextwordstart; // Option 2: Omitting nextwordstart
        }
            //Option 2: Remove nextwordstart from the last word
            if(i === data.length -1){
                delete currentWord.nextwordstart;
            }
      }
      return data;
    }

     // number of filler words
          useEffect(() => {
            if (!toneVizModel) return;
            const countFillerWords = (data:any) => {
              if (!data || !Array.isArray(data)) {
                return 0; // Handle cases where data is not an array or nullish
              }
        
              return data.reduce((count, item) => {
                return item.fillerword === true ? count + 1 : count;
              }, 0);
            };
        
            const fillerWordCount = countFillerWords(toneVizModel);
            setNumberOfFillerWords(fillerWordCount);
            setFillerCount(fillerWordCount); // Update the parent component with the count
          }, [toneVizModel]); // The dependency array ensures this runs when 'data' changes

          // number of pauses
                useEffect(() => {
                  if (!toneVizModel) return;
                  const countPauses = () => {
                    if (!toneVizModel) return 0; // Handle cases where toneVizModel is null or undefined.
              
                    let pauses = 0;
                    for (const wordObj of toneVizModel) {
                      if (wordObj.wordgap > PAUSE_WORD_GAP) {  // wordgap from constants
                        pauses++;
                      }
                    }
                    return pauses;
                  };
              
                  const pauseCount = countPauses();
                  setNumberOfPauses(pauseCount);
                  setPauseCount(pauseCount); // Update the parent component with the count
                }, [toneVizModel]); // The effect runs whenever toneVizModel changes
          
                // tooltip
          
                const fillerExplain = tooltipContent("Filler words are a sound or word that participants in a conversation use to signal that they are pausing to think but are not finished speaking, such as 'uh', 'you know' and 'I mean'.");
          
                const pauseExplain = tooltipContent("The ellipses (...) measure pauses in your speech, moments when you hesitated to ask a question.");

                const overallExplain = tooltipContent("Filler words and pauses are both indicators of how you communicate. Filler words are often used to fill gaps in conversation, while pauses can indicate hesitation or uncertainty. The ellipses (...) measure pauses in your speech, moments when you hesitated to ask a question.");      

                function tooltipContent(additionalText: string) {
                  return (
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <span><Info /></span>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <div className="flex justify-between space-x-2">
                          <div className="space-y-1">
                            <p className="text-sm">
                              {additionalText}
                            </p>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  );
                }

  return (
    <div className="pb-4">
      
      <div className="flex items-center font-bold mb-4 uppercase space-x-2">
  <span>Pauses and filler words</span>
  <span className="normal-case font-normal">{overallExplain}</span>
</div>

     
            <div className="">
              Filler words: {numberOfFillerWords === 0 ? "Congrats! No filler words" : numberOfFillerWords}
              
            </div>

            <div className="">
              
              Pauses: {numberOfPauses === 0 ? "Congrats! No pauses" : numberOfPauses}
            </div>
          
      
           
              </div>
  )
}

export default Chatfillerpause