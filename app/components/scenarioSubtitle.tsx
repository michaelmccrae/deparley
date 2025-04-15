import React, {useEffect, useState} from 'react'
import type { Database } from '../../lib/database.types';

type Scenarios = Database["public"]["Tables"]["scenarios"]["Row"] | null;

const ScenarioSubtitle = ({selectorScenario}: any | null) => {

    // check if passing props
    useEffect(() => {
        if (!selectorScenario) 
            {return} 
        else
        {console.log("selectorScenario", selectorScenario[0]);}
    }   , [selectorScenario]);
    

  return (
    <>
    <div className="mb-4">
    <div className="font-bold uppercase mb-4">scenario</div>

    {selectorScenario && <div>{selectorScenario[0].subtitle}</div>}
    </div>


    
    </>
  )
}

export default ScenarioSubtitle;