import React, {useEffect, useState} from 'react'
import type { Database } from '../../lib/database.types';

type Scenarios = Database["public"]["Tables"]["scenarios"]["Row"] | null;

const ScenarioSubtitle = ({selectorScenario, formCount}: any | null) => {

    // check if passing props
    useEffect(() => {
        if (!selectorScenario) 
            {return} 
        else
        {console.log("selectorScenario", selectorScenario[0]);}
    }   , [selectorScenario]);

    // check if passing props
    useEffect(() => {
        if (!formCount) 
            {return} 
        else
        {console.log("formCount", formCount);}
    }   , [formCount]);
    

  return (
    <>
    <div className="mb-4">
    <div className="font-bold uppercase mb-4">number of questions <span className="underline">you</span> asked / suggested number of qualifying questions</div>

    {selectorScenario && <div className="text-6xl">{formCount}/{selectorScenario[0].numberofquestions}</div>}
    </div>


    
    </>
  )
}

export default ScenarioSubtitle;