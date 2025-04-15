import React, { useEffect, useRef, useState } from 'react';
import { ASSESS_API_PAUSE } from "@/lib/constants";
import Loadinganimate from "@/lib/loadinganimate"  // Thinking during processing

const Chatcontent = ({ toneDeepseek, selectorScenario, assessVisible,setFeedbackCount }: any) => {
  const [responseAssess, setResponseAssess] = useState<any>(null);
  const [totalPoints, setTotalPoints] = useState<any | null>(0);
  const [assessScore, setAssessScore] = useState<any | null>(0);

  const hasCalledAPI = useRef(false); // track if API has been called

  useEffect(() => {
    if (selectorScenario) { 
      console.log("selectorScenario in chatcontent", selectorScenario);
      console.log("selectorScenario[0].assess_end", selectorScenario[0].assess_end);
      console.log("toneDeepseek in chatcontent", toneDeepseek);
    }
  }, [selectorScenario, toneDeepseek]);

  function getWordsString(jsonArray: any) {
    console.log("jsonArray in getWordsString", jsonArray);
    const data = JSON.parse(jsonArray);
    console.log("data in getWordsString", data);
    return data.map((item: { word: any; }) => item.word).join(' ');
  }

  function joinEndDeepseek(toneDeep: any[], endAssess: any) {
    return JSON.stringify({
      deeseekTranscript: toneDeep,
      assess_end: endAssess
    });
  }

  // math for score
  function mathForScore(totalP: number, missed: number) {
    const score = (totalP - missed);
    return score;
  }

  async function userAssessResponse(joinedData: any) {
    try {
      console.log("joinedData in userAssessResponse", joinedData);
      const response = await fetch(`/api/apiuserassess`, {
        method: "POST",
        body: joinedData,
      });

      const returnResponse = await response.json();
      const responseObject = JSON.parse(returnResponse.groqAssess.choices[0].message.content);
      console.log("responseObject in userAssessResponse", responseObject);

      setResponseAssess(responseObject.assessment);
      setTotalPoints(responseObject.total_points);
      console.log("responseObject.total_points.", responseObject.total_points)
      const missed = mathForScore(responseObject.total_points, responseObject.score);
      console.log("missed in userAssessResponse", missed);  
      // setAssessScore(responseObject.score);
      setFeedbackCount(missed)
        } catch (err) {
          console.error("Error in userAssessResponse:", err);
        }
      }

  useEffect(() => {
    if (assessVisible && toneDeepseek && selectorScenario && !hasCalledAPI.current) {
      setTimeout(() => {
        hasCalledAPI.current = true;
  
        const stringDeepseek = getWordsString(toneDeepseek);
        console.log("stringDeepseek in chatcontent", stringDeepseek);
  
        const joinedDeepseekAssessEnd = joinEndDeepseek(stringDeepseek, selectorScenario[0].assess_end);
        console.log("joinedDeepseekAssessEnd in chatcontent", joinedDeepseekAssessEnd);
  
        userAssessResponse(joinedDeepseekAssessEnd);
      }, ASSESS_API_PAUSE);
    }
  }, [assessVisible, toneDeepseek, selectorScenario]);

  return (
    <div className="pb-4">
      <div className="font-bold mb-4 uppercase">Assessment Results</div>
      {responseAssess === null ? (
        <Loadinganimate />
      ) : (
        <div>
          {/* Replace this with your actual content rendering the assessment results */}
          
          <div>{responseAssess}</div>
          {/* <p>Total Points: {totalPoints}</p> */}
          {/* <p>Score: {assessScore}</p> */}
        </div>
      )}
    </div>
  );
  

};

export default Chatcontent;
