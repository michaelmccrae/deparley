import React, {useEffect, useState} from 'react';
import Chatfillerpause from './chatfillerpause';
import Chatvizfillerpause from './chatvizresponse';
import Chatquestionmissed from './chatquestionscore';
import Chatoverallscore from './chatoverallscore';
import Chatcontent from './chatcontent';



const Assesschat = ({selectorScenario, mergedMsgSimilarity, toneDeepseek, assessVisible}) => {
  const [fillerCount, setFillerCount] = useState(0); // for overall score
  const [pauseCount, setPauseCount] = useState(0); // for overall score
  const [feedbackCount, setFeedbackCount] = useState<number | null>(null); // for overall score from content


    useEffect(() => {
        console.log('selectorScenario in chat assess', selectorScenario);
        console.log('mergedMsgSimilarity in chat assess', mergedMsgSimilarity);
        console.log('toneDeepseek in chat assess', toneDeepseek);
        // console.log('toneRef in chat assess', toneRef);
    }, [selectorScenario, mergedMsgSimilarity]);

    return (
    <div>

      <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

      <Chatvizfillerpause toneDeepseek={toneDeepseek}/>

      <Chatquestionmissed mergedMsgSimilarity={mergedMsgSimilarity}/>

      <Chatfillerpause toneDeepseek={toneDeepseek} setFillerCount={setFillerCount} setPauseCount={setPauseCount}/>

      <Chatcontent toneDeepseek={toneDeepseek} selectorScenario={selectorScenario} assessVisible={assessVisible} setFeedbackCount={setFeedbackCount}/>

      <Chatoverallscore toneDeepseek={toneDeepseek} mergedMsgSimilarity={mergedMsgSimilarity} fillerCount={fillerCount} pauseCount={pauseCount} feedbackCount={feedbackCount}/>

        
        </div>
  )
}

export default Assesschat;