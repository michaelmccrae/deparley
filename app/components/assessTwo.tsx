import React, {useEffect, useState, useRef} from 'react'
import { Button } from "@/components/ui/button"
// import { MicVocal, Speaker, KeyRound  } from 'lucide-react';
import { Check, X } from 'lucide-react';
// import VizWords from './vizwords';
// import FillerWords from './fillerwords';
import Score from './score';
// import { set } from 'zod';


const Assess = ({transcriptArrayRef, selectorQuestions, selectorBlob, selectorTone}: any | null) => {
    const [dataAssess, setDataAssess] = useState<any>(null); //raw data from HF API
    const [data, setData] = useState<any>(null); //formatted data
    const [isLoading, setIsLoading] = useState<boolean>(true); // not sure what this is for
    const toneRef = useRef<string | null>(null); // not sure what this is for
    const [objectArray, setObjectArray] = useState<any>(null); // not sure what this is for

    const handleFormSubmit = () => {
        console.log("working")
        fetchDataAssess()
    };

    useEffect(() => {
      console.log("transcriptArrayRef assess", transcriptArrayRef);
      console.log("selectorQuestions assess", selectorQuestions);
      console.log("selectorBlob assess", selectorBlob);
      console.log("selectorTone assess", selectorTone);
    }, [selectorQuestions, transcriptArrayRef, selectorBlob, selectorTone]);

    // remove non-strings from arrays
    function removeNonStrings(arr: (string | number | boolean | null)[]){
      return arr.filter((item: any) => typeof item === 'string');
  }

    const fetchDataAssess = async () => {
        const noZeroes = removeNonStrings(transcriptArrayRef.current);
        console.log("noZeroes", noZeroes);
    
        try {
          const response = await fetch('../../api/apiquestions/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              userQuestions: noZeroes, 
              masterQuestions: selectorQuestions[0].questions
            }),
          });
        
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
        
          const data = await response.json();
          console.log("data", data);

          setDataAssess(data);
    
        } catch (error) {
          console.error('There was an error!', error);
        } finally {
          console.log('done');
        }
      };

      function arrayToObject (array: any) {
        const myObject:any = {};
          for (let i = 0; i < array.length; i += 2) {
            const key = array[i];
            const value = array[i + 1][0]; // Extract the number from the array
            myObject[key] = value;
          }
          return myObject;
        //   setObjectArray(myObject);
        //   console.log("objectArrayHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH", objectArray); 
      }


      useEffect(() => {
        if (!dataAssess) return;
        console.log("dataAssess", dataAssess);{
        const stuff = arrayToObject(dataAssess); 
        console.log("stuff^^^^^^^^^^^^^^^^^^^^^^", stuff);
        setObjectArray(stuff);
        }
      }, [dataAssess]); // Re-run this effect when 'data' changes

      useEffect(() => {
        console.log("objectArray****************", objectArray);
    }, [objectArray]);

    
    //   function EmoticonList({ data }: any | null) {
    //     return (
    //       <ul>
    //         {Object.entries(data).map(([key, value]) => (
    //           <li key={key}>
    //             {key}: {value < 0.7 ? '😊' : '😔'}
    //           </li>
    //         ))}
    //       </ul>
    //     );
    //   }

  return (
    <div>
        
       <Button variant="outline" onClick={handleFormSubmit}>Assess</Button> 

       {objectArray && (
        <>
        <Score />
        <div className="font-bold my-4 uppercase">Questions You Asked</div>
        <div className="">When you asked the client questions, here is what you asked CORRECTLY and here is what you may have MISSED: </div>
        <ul className="list-disc py-4 list-inside">
            {Object.entries(objectArray).map(([key, value]) => (
              <li key={key}>
                {key}: {(value as number) < 0.7 ? <span className="bg-blue-300"><span className="inline-flex items-center"><Check size={16} />CORRECT</span></span> : <span className="bg-yellow-300"><span className="inline-flex items-center"><X size={16} />MISSED</span></span>}
              </li>
            ))}
          </ul>
          </>
        )}

    </div>
  )
}

export default Assess;