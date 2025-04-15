import React, {useEffect, useState, useRef} from 'react'
import type { Database } from '../../lib/database.types';
import { Button } from "@/components/ui/button";
import { Check, X } from 'lucide-react';
import Vizaudio from "@/components/vizaudio";
import { SENTENCE_SIMILARITY_THRESHOLD, ASSESS_API_PAUSE } from "@/lib/constants";
import { Play, PenLine } from 'lucide-react';
// import { fetchUserData } from "./userresponseapi";
// import { json } from 'zod-form-data';
import styles from "./styles.module.css";
// import { ASSESS_API_PAUSE } from "@/lib/constants";
import StartButton from "@/components/startButton";





type Scenarios = Database["public"]["Tables"]["scenarios"]["Row"] | null;

const ScenarioSubtitle = ({selectorScenario, formCount, questionBlur, transcriptArray, toneRefBlur, trueFalseCountRef,  updateVadPassDown, countingToneUpdates, toneHistoryArray, numberofquestions, trueFalseUseState}: any | null) => {
    const [updatedObject, setUpdatedObject] = useState(selectorScenario[0].questions);
    const [isVisible, setIsVisible] = useState(true); //button toggle
    const [responseAssess, setResponseAssess] = useState<any>(null); // assessing user's response to question
    const [error, setError] = useState<string | null>(null); // assessing user's response to question
    const [isPlaying, setIsPlaying] = useState(false); // voice start
    // const soundRef = useRef(new Audio('./start_jordan_one.wav')); // voice start
    const assessButtonPressedRef = useRef(false); // assessing user's response to question
    const showRespondMessage = useRef(false); // show RESPOND TO CLIENT'S QUESTION
    const [assesButtonPressedState, setAssessButtonPressedState] = useState(false); // assessing user's response to question
    const [showAssessScript, setShowAssessScript] = useState(false); // assessing user's response to question
    const [totalPoints, setTotalPoints] = useState<any | null>(0); // assessing user's response to question
    const [assessScore, setAssessScore] = useState<any | null>(0); // assessing user's response to question

    // check if passing props
    useEffect(() => {
        if (!selectorScenario) 
            {return} 
        else
        {console.log("selectorScenario&&&&&&&&&&&&&&&&&&&&&&7", selectorScenario[0]);}
        {console.log("questionBlur&&&&&&&&&&&&&&&&&&&&&&7", questionBlur);}
        {console.log("transcriptArray^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^6", transcriptArray)}
        {console.log("toneRefBlur^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^6", toneRefBlur)}
    }, [selectorScenario, questionBlur, toneRefBlur, transcriptArray]);

    // check if passing props
    useEffect(() => {
        if (!formCount) 
            {return} 
        else
        {console.log("formCount", formCount);}
    }, [formCount]);

      useEffect(() => {

        if (!selectorScenario || !questionBlur) return;

        console.log("selectorScenario[0].questions INITIAL@@@@@@@@@@@@@@@", selectorScenario[0].questions);
        console.log("questionBlur INITIAL@@@@@@@@@@@@@@@", questionBlur);
        console.log("type of &&&&&&&&&&&&&&&&&&&&", typeof questionBlur);
        // const formattedStrings: string[] = questionBlur.map((num: number) => num.toFixed(2));
        // console.log("formattedStrings@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", formattedStrings);

      //   function combineArraysToObject(keys:string[], values:number[]) {
      //     return keys.reduce((obj, key, index) => {
      //         obj[key] = values[index];
      //         return obj;
      //     }, {});
      // }

      //     let twoArrays = combineArraysToObject(selectorScenario[0].questions, formattedStrings);
      //     console.log("twoArrays@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", twoArrays);
      }, [selectorScenario, questionBlur]);


    // initial questions and scenario object set to false
    useEffect(() => {
      if (!selectorScenario[0]) return;
 
      function createObjectWithFalseValues(array: any) {
        const result: { [key: string]: boolean } = {};
        // Iterate over the array and set each string as a key with value FALSE
        array.forEach((item: string | number) => {
          result[item] = false;
        });
        return result;
      }

      const stuff = createObjectWithFalseValues(selectorScenario[0].questions);
      setUpdatedObject(stuff)

      console.log("stuff###################", stuff);  

      // console.log("blurStartRef.current", blurStartRef.current);
    }, [selectorScenario]);

    
    // update blur with HF numbers
    // useEffect(() => {
    //   if (!questionBlur) return;
    //     let blurParsed = JSON.parse(questionBlur);
    //     console.log("blurParsed@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", blurParsed);
    //     console.log("type of blurParsed@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", typeof blurParsed);
    //     let keys = Object.keys(updatedObject);
    //     let newObject = { ...updatedObject };
    //     console.log("newObject early###################", newObject);
    //     console.log("keys early###################", keys);
    //     console.log("questionBlur early###################", questionBlur);
    
        
    //     keys.forEach((key, index) => {
    //       // If the value is already TRUE, leave it as TRUE
    //       if (newObject[key] == true || blurParsed[index] > SENTENCE_SIMILARITY_THRESHOLD) {
    //         newObject[key]=true;         
    //       } else {
    //         newObject[key]=false;
    //       }
    //     });
    
    //     setUpdatedObject(newObject);
    //     console.log("newObject updated@@@@@@@@@@@@@@@@@@@@@@@@", newObject);
    //         }, [questionBlur, updatedObject]);


    useEffect(() => {
      if (!questionBlur) return;
      console.log("questionBlur@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", questionBlur);
      let blurParsed = JSON.parse(questionBlur);
    
      setUpdatedObject((prevState: any) => {
        let keys = Object.keys(prevState);
        let newObject = { ...prevState };
        
        keys.forEach((key, index) => {
          if (newObject[key] === true || blurParsed[index] > SENTENCE_SIMILARITY_THRESHOLD) {
        newObject[key] = true;
          } else {
        newObject[key] = false;
          }
        });
        
        return newObject;
      });
    
    }, [questionBlur]);
    


        const toggleVisibility = () => {
            // toggleVAD();
            setAssessButtonPressedState(true);
            assessButtonPressedRef.current = true;  // disappear respond to client's question
            console.log("toggleVisibility PRESSED)))))))))))))))))))))))))))))")
            trueFalseCountRef.current = false;  // disappear respond to client's question
            setIsVisible(!isVisible);
            handleFetch().catch(err => console.error("Unhandled error in handleFetch:", err));
            console.log("handlefetch is fired")
            // vad.pause(); 
            updateVadPassDown();
        };

        	// Function to pause VAD
            // function toggleVAD() {
              
            //   // setVadPaused(true);
            //   let result = true
            //   callbackVad(result)
            // }

        const untoggleVisibilityJSX = (x:any) => {
            return ( <ul className="list-disc pl-6">
                {Object.entries(x).map(([key, value]) => (
                    <li 
                    key={key}
                    className={value ? '' : 'blur-sm'}
                    >
                    {key}
                    </li>
                ))}
                </ul>)
        }


        const toggleVisibilityJSX = (x:any) => {
            return ( <ul className="list-disc pl-6">
                {Object.entries(x).map(([key, value]) => (
                    <li 
                    key={key}
                    className={value ? '' : 'text-gray-300'}
                    >
                    {key}
                    </li>
                ))}
                </ul>)
        }

        // assessing user's response to question

        // async function handleFetch() {
        //   setError(null);
        //   try {
        //     const objectTranscriptAssess:any = await assessTranscript(transcriptArray,selectorScenario[0].assess_end); // Fetch user with ID 1
        //     console.log("objectTranscriptAssess^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",  objectTranscriptAssess);
            
        //     const data:any = await fetchUserData(objectTranscriptAssess); // Fetch user with ID 1
            
        //     console.log("data^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",  data);
        //     const response = data.choices[0].message.content;
        //     setResponseAssess(response);
        //     console.log("response^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",  response);
        //   } catch (err) {
        //     setError("Failed to fetch user data");
        //   }
        // }

        // get words from Deepgram

          // function extractWords(data:any) {
          //   // Map through the array and extract the "word" values
          //   return data.map((entry: { word: any; }) => entry.word).join(" ");
          //   }


        async function handleFetch() {
          console.log("handlefetch is fired in function")
          setError(null);
      
          // Introduce a delay before making the API calls
          await new Promise(resolve => setTimeout(resolve, ASSESS_API_PAUSE));
      
          try {
            console.log("toneRefBlur^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^-----", toneRefBlur)
            console.log("Type of toneRefBlur:", typeof toneRefBlur);
            console.log("Is toneRefBlur an array?", Array.isArray(toneRefBlur));
            console.log("toneRefBlur Data:", toneRefBlur);
            console.log("selectorScenario[0].assess_end------------------+++++++++++++", selectorScenario[0].assess_end)
              // const deepgramAssess = extractWords(toneRefBlur)
              // console.log("deepgramAssess^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^-----", deepgramAssess);
              // const objectTranscriptAssess: any = await assessTranscript(transcriptArray, selectorScenario[0].assess_end); 
              const assessGroqJSON = JSON.stringify({
                toneRefBlur: toneRefBlur,
                assess_end: selectorScenario[0].assess_end
            });
              console.log("assessGroqJSON^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^", assessGroqJSON);
              // const objectTranscriptAssessTwo: any = await assessTranscript(assessGroqJSON); 
              // console.log("objectTranscriptAssess^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^", objectTranscriptAssess);
              // console.log("toneRefBlur&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&", toneRefBlur)

              const response = await fetch(`/api/apiuserassess`, {
                method: "POST",
                body: assessGroqJSON,
              });
      
              // const data: any = await fetchUserData(objectTranscriptAssessTwo); 
              
              // console.log("data^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^", data);
              // const response = data.choices[0].message.content;
              const returnResponse = await response.json();
              console.log("returnResponse^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^", returnResponse);
              console.log("returnResponse.choices[0].message.content%%%%%%%%%%%%%%%%%%%%%%%%%%", returnResponse.groqAssess.choices[0].message.content)
              let responseObject = JSON.parse(returnResponse.groqAssess.choices[0].message.content)
              setResponseAssess(responseObject.assessment);
              setTotalPoints(responseObject.total_points);
              setAssessScore(responseObject.score);
              console.log("responseObject.assessment", responseObject.assessment);
              console.log("responseObject.total_points", responseObject.total_points);

              // console.log("response^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^", response);
          } catch (err) {
              setError("Failed to fetch user data");
          }
      }
      

        // array transcript last item

        const getLastItem = (array:string) => {
          return array.at(-1);
        };

        // send assess object combined transcriptArray and selectorScenario[0].assess_end

        const assessTranscript = (voice:string, modelcompare:string) => {
          return {
            transcript: getLastItem(voice),
            instructions: modelcompare
          };
        };

        // start voice play

        // const playSound = () => {
        //   if (soundRef.current) {
        //     if (isPlaying) {
        //       soundRef.current.pause();
        //     } else {
        //       soundRef.current.play();
        //     }
        //     setIsPlaying(!isPlaying);
        //   }
        // };


        // console.log("trueFalseCountRef.current______________________________", trueFalseCountRef.current)

        // useEffect (() => {
        //   console.log("formCount___________________________", formCount)
        //   console.log("countingToneUpdates___________________________", countingToneUpdates)
        //   console.log("toneHistoryArray___________________________", toneHistoryArray)
        //   console.log("numberofquestions___________________________", numberofquestions)
        //   if (countingToneUpdates => numberofquestions) {
        //     console.log("countingToneUpdates is equal to or greater than number of questions$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
        //   }
        // }, [formCount, countingToneUpdates, toneHistoryArray, numberofquestions])



        useEffect(() => {
          // console.log("assessButtonPressedRef.current", assessButtonPressedRef.current)
          // console.log("trueFalseCountRef", trueFalseCountRef.current)
          console.log("trueFalseUseState", trueFalseUseState)
          console.log("assesButtonPressedState", assesButtonPressedState)
          console.log("showAssessScript", showAssessScript)
          if (!assesButtonPressedState && !trueFalseUseState) {
            setShowAssessScript(true);
          } else {
            setShowAssessScript(false);
          }
        }, [showAssessScript, trueFalseUseState, assesButtonPressedState]);

  return (
    <>
    <div className="mb-4">

    

    {/* <div className="font-bold uppercase mb-4">number of questions <span className="underline">you</span> asked / suggested number of qualifying questions</div>

    {selectorScenario && <div className="text-6xl">{formCount}/{selectorScenario[0].numberofquestions}</div>} */}
    </div>
    <div>

    <div className="font-bold mb-4">SUGGESTED QUESTIONS TO ASK - Correctly answered questions are un-blurred</div>
 
    </div>

    <div className="pb-6">

  

    {isVisible && untoggleVisibilityJSX(updatedObject)}

    {!isVisible && toggleVisibilityJSX(updatedObject)}

    {!isVisible && <Vizaudio transcriptArrayViz={transcriptArray} toneRefViz={toneRefBlur} blurQuestions={updatedObject} responseAssess={responseAssess} assessScore={assessScore} totalPoints={totalPoints}/>}

        {showAssessScript && (
      <div className="flex justify-center items-center">
          <div className={styles.fadein}>
            <div className="text-center">RESPOND TO THE CLIENT&apos;S QUESTION</div>
          </div>
        </div>
    )}

  

    </div>

    {/* <ul className="list-disc pl-6">
        {Object.entries(updatedObject).map(([key, value]) => (
            <li 
            key={key}
            className={value ? '' : 'blur-sm'}
            >
            {key}
            </li>
        ))}
        </ul> */}



    {/* <div className="py-3"><Button variant="secondary" onClick={playSound}><Play />Start</Button> </div> */}

    <div className="py-3"><StartButton selectorScenario={selectorScenario}/></div>

    {/* <div className="py-3"><Button variant="secondary" onClick={toggleVisibility}><PenLine />Assess</Button> </div> */}
          <div className="py-3">
            <Button 
              variant="secondary" 
              onClick={toggleVisibility} 
              disabled={countingToneUpdates < (numberofquestions + 1)}
              className={`transition-shadow ${
                countingToneUpdates >= (numberofquestions + 1) 
                  ? "bg-blue-300 animate-pulse" 
                  : ""
              }`}
            >
              <PenLine />Assess
            </Button>
          </div>
    
    </>
  )
}

export default ScenarioSubtitle;