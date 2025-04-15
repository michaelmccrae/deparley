'use client';

import React, {useEffect, useState} from 'react';
import { FILLER_WORDS } from "@/lib/fillerwords";
import { PAUSE_WORD_GAP } from "@/lib/constants";


const Chatvizfillerpause = ({toneDeepseek, }: any) => {
  const [toneVizModel, setToneVizModel] = useState<any[]>([]);

  useEffect(() => {
    if (toneDeepseek  && toneDeepseek.length > 0) {
      console.log('toneDeepseek in chatvizfillerpause', toneDeepseek);  // initial value
      const toneRefVizObject = JSON.parse(toneDeepseek);  //convert to object
      console.log("first func////////////////////////////", addNextWordStart(toneRefVizObject));
      const nextWordStart = addNextWordStart(toneRefVizObject)
      console.log("nextWordStart ^^^^^^^^^^^^^^^^^^^^^^^^^^^", nextWordStart);
      const fillerWordKey = addFillerWordKey(nextWordStart);
      console.log("fillerWordKey%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%", fillerWordKey);
      const gapMeasure = calculateWordGaps(fillerWordKey);
      console.log("gapMeasure!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", gapMeasure);
      setToneVizModel(gapMeasure);
      // console.log("responseAssess!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", responseAssess);  


    }
  }, [toneDeepseek]);

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

     

  return (
    <>
  

    {toneVizModel && <div className="font-bold mb-4 uppercase">Transcript With Visualization</div>}

          
    <div className="bg-gray-100 rounded-lg p-2 m-6">
      <div className="font-mono">
      {toneVizModel && toneVizModel.map((wordObj, index) => {
        const { word, fillerword, wordgap } = wordObj;

        const displayWord = wordgap > PAUSE_WORD_GAP ? `${word}...` : word;
        const hasPause = displayWord.endsWith("...");

        return (
          <span key={index} className={`${index === 0 ? 'capitalize' : ''} mr-1`}>
            <span style={{ color: fillerword ? "orange" : "black" }}>
              {word}
            </span>
            {hasPause && (
              <span className="text-orange-500 font-bold">...</span>
            )}
          </span>
        );
      })}
    </div>
    </div>



    </>
  )
}

export default Chatvizfillerpause