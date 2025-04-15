'use client'; 

import React from 'react';
import {useState, useEffect, useRef} from 'react';
import {FILLER_WORDS} from "@/lib/fillerwords"
import { fromTheme } from 'tailwind-merge';
import { ChartNoAxesColumnDecreasing } from 'lucide-react';
import Score from './score'
import LoadingEllipsis from './loadingellipsis';
import { Info, Smile   } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"


const Vizaudio = function ({toneRefViz, blurQuestions, responseAssess, totalPoints, assessScore}: any) {
    const toneRef = useRef("");
    const [toneVizModel, setToneVizModel] = useState<any[]>([]);
    const [numberOfFillerWords, setNumberOfFillerWords] = useState(0);
    const [numberOfPauses, setNumberOfPauses] = useState(0);
    const [loadingAssess, setLoadingAssess] = useState(true); // updated Groq assessment
    // const [isLoading, setIsLoading] = useState(true);

  // animate spinner pause while wait for viz audio call
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 3000); // Show loader for 3 seconds

  //   return () => clearTimeout(timer); // Cleanup on unmount
  // }, []);

  // const renderLoadingAnimation = () => (
  //   <LoadingEllipsis />
  // );

    useEffect(() => {
        if (!toneRefViz) return;
        console.log("blurQuestions**************************************", blurQuestions);
        
        console.log("toneRefViz**************************************", toneRefViz);
        console.log("toneRefViz**************************************", typeof toneRefViz);
        const toneRefVizObject = JSON.parse(toneRefViz);
        console.log("first func////////////////////////////", addNextWordStart(toneRefVizObject));
        const nextWordStart = addNextWordStart(toneRefVizObject)
        console.log("nextWordStart ^^^^^^^^^^^^^^^^^^^^^^^^^^^", nextWordStart);
        const fillerWordKey = addFillerWordKey(nextWordStart);
        console.log("fillerWordKey%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%", fillerWordKey);
        const gapMeasure = calculateWordGaps(fillerWordKey);
        console.log("gapMeasure!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", gapMeasure);
        setToneVizModel(gapMeasure);
        console.log("responseAssess!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", responseAssess);  
        
    }, [toneRefViz, blurQuestions, responseAssess]);

    // Function to add the nextwordstart key to each word object

        const addNextWordStart = (x:any) => {

            // let word = x
        // const words = vizDeepgram.results.channels[0].alternatives[0].words;

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

    // adujusted since now getting object instead of an array

  //   const addFillerWordKey = (data: any) => {
  //     // Check if the word is a filler word
  //     const isFillerWord = FILLER_WORDS.includes(data.word.toLowerCase());
  
  //     // Add the fillerword key to the object
  //     return {
  //         ...data,
  //         fillerword: isFillerWord,
  //     };
  // };
  

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
      }, [toneVizModel]); // The dependency array ensures this runs when 'data' changes

      // number of pauses
      useEffect(() => {
        if (!toneVizModel) return;
        const countPauses = () => {
          if (!toneVizModel) return 0; // Handle cases where toneVizModel is null or undefined.
    
          let pauses = 0;
          for (const wordObj of toneVizModel) {
            if (wordObj.wordgap > 1.0) {
              pauses++;
            }
          }
          return pauses;
        };
    
        const pauseCount = countPauses();
        setNumberOfPauses(pauseCount);
      }, [toneVizModel]); // The effect runs whenever toneVizModel changes

      // tooltip

      const fillerExplain = tooltipContent("Filler words are a sound or word that participants in a conversation use to signal that they are pausing to think but are not finished speaking, such as 'uh', 'you know' and 'I mean'.");

      const pauseExplain = tooltipContent("The ellipses (...) measure pauses in your speech, moments when you hesitated to ask a question.");

      function tooltipContent(additionalText: string) {
        return (
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="link"><Info size={18} /></Button>
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

      // updated loading and response assess groq

      useEffect(() => {
        if (responseAssess) {
          setLoadingAssess(false);
        } else {
          setLoadingAssess(true);
        }
      }, [responseAssess]);
      
     
  return (
    <div>

      
      
        <>
        <AnimatePresence>
        
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
        
          {toneVizModel && <div className="font-bold mb-4 uppercase">Pauses and filler words</div>}

          
          <div className="bg-gray-100 rounded-lg p-2 m-6">
            <div className="font-mono">
            {toneVizModel && toneVizModel.map((wordObj, index) => {
              const { word, fillerword, wordgap } = wordObj;
          
              const textColor = fillerword ? "orange" : "black";
              const displayWord = wordgap > 0.4 ? `${word}...` : word;
          
              return (
                  <span
                      key={index}
                      className={`${index === 0 ? 'capitalize' : ''} mr-1`} // Tailwind classes here
                      style={{ color: textColor }} // Keep inline style for color
                  >
                      {displayWord}
                  </span>
              );
            })}
          </div>
          </div>

          {/* {responseAssess ? (<div className="px-6 mb-4"><LoadingEllipsis /></div>) : (<div className="px-6 mb-4">{responseAssess}</div>)} */}

          <AnimatePresence>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >

          <div className="px-6 mb-4">{loadingAssess ? <LoadingEllipsis /> : responseAssess}
          </div>

          </motion.p>
          </AnimatePresence>


          {toneVizModel && (
            <div className="px-6 mb-1 flex items-center">
              {fillerExplain}Filler words: {numberOfFillerWords === 0 ? "Congrats! No filler words" : numberOfFillerWords}
            </div>
          )}

          {toneVizModel && (
            <div className="px-6 mb-4 flex items-center">
              {pauseExplain}Pauses: {numberOfPauses === 0 ? "Congrats! No pauses" : numberOfPauses}
            </div>
          )}

          {/* {toneVizModel && <div className="px-6 mb-4 flex items-center">{pauseExplain}Pauses: {numberOfPauses}</div>} */}

          
          <AnimatePresence>
        
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            {responseAssess && <Score numberOfFillerWordsScore = {numberOfFillerWords} numberOfPausesScore={numberOfPauses} blurQuestionsScore={blurQuestions} assessScore={assessScore} totalPoints={totalPoints}/>}

            </motion.p>
          </AnimatePresence>

          <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>

          </motion.p>
          </AnimatePresence>
        </>
      

     

    </div>
  )
}

export default Vizaudio;