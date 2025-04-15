'use client';

import React, { useEffect, useState } from 'react';
import { SENTENCE_SIMILARITY_THRESHOLD } from "@/lib/constants";
import { CircleCheckBig, CircleX, Circle } from 'lucide-react';

const ChatProgress = ({ mergedMsgSimilarity, selectorScenario }: any) => {
  const [numberOfQuestions, setNumberOfQuestions] = useState<any | null>(null);

  const [completedMatchedQuestions, setCompletedMatchedQuestions] = useState<any | null>(null);

  useEffect(() => {
    console.log("mergedMsgSimilarity in ChatProgress", mergedMsgSimilarity);
    console.log("selectorScenario in ChatProgress", selectorScenario);
  }, [mergedMsgSimilarity, selectorScenario]);

  // number of questions in the scenario
  useEffect(() => {
    if (selectorScenario) {
      const numberOfQuestions = selectorScenario[0].numberofquestions;
      setNumberOfQuestions(numberOfQuestions);
      console.log("numberOfQuestions in chatprogress", numberOfQuestions);
    }
  }, [selectorScenario]);

  

// remove role assistant. leave role user. 

function getFilteredObject(objectOne: any[]) {
    return objectOne.filter(item => item.role !== 'assistant');
  }

// merge mergedMsgSimilarity and numberOfQuestions

function generateObjectThree(objectOne: any[], objectTwo: number) {
    const result = [];
  
    for (let i = 0; i < objectTwo; i++) {
      const item = objectOne[i];
  
      const isUser = item?.role === 'user';
      const hasSimilarity = isUser && item.similarity?.some((val: number) => val > 0.5);
  
      result.push({
        id: i + 1,
        user: isUser,
        similarity: hasSimilarity || false
      });
    }
  
    return result;
  }

  useEffect(() => {
    if (mergedMsgSimilarity && numberOfQuestions !== null) {
      const removedAssistant = getFilteredObject(mergedMsgSimilarity);
      console.log("removedAssistant", removedAssistant);
      const result:any = generateObjectThree(removedAssistant, numberOfQuestions);
      console.log("result in chatprogress TWO", result);
      setCompletedMatchedQuestions(result);
    }
  }, [mergedMsgSimilarity, numberOfQuestions]);
  

  return (
    <div className="pb-6 flex justify-center" >
      
      <div style={{ display: 'flex', gap: '1rem' }}>
      {completedMatchedQuestions &&  completedMatchedQuestions.map((item:any) => (
        <div key={item.id}>
          {item.user && item.similarity && <CircleCheckBig color="black" />}
          {item.user && !item.similarity && <CircleX color="black" />}
          {!item.user && !item.similarity && <Circle color="lightgrey" />}
        </div>
      ))}
    </div>
    </div>
  );
};

export default ChatProgress;
