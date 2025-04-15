'use client';

import { createClientSupa } from '../../../../utils/supabase/client';
import Link from 'next/link'
import { useEffect, useState } from 'react';    
import Markdown from 'markdown-to-jsx'
import ScenarioExplainer from '../../../components/scenarioExplainer';
import { Badge } from "@/components/ui/badge"
// import classes from './post.module.css';
// import { Header, Text } from './stylesPost';
import styles from "./styles.module.css";

import type { Database } from '../../../../lib/database.types';

type Scenarios = Database["public"]["Tables"]["scenarios"]["Row"];

function SinglePost({slugNumber}: {slugNumber: any | null}) {
    const [selector, setSelector] = useState<any>([]);

    console.log("slugNumber", slugNumber);
   
    useEffect(() => {
        async function supabaseDeparley () {
        const supabase = createClientSupa();
        const { data: scenarios } = await supabase.from('scenarios').select().eq('scenario_id', slugNumber);        
        if (scenarios) {
            setSelector(scenarios);
        }
        }
        supabaseDeparley(); 
    }   , [slugNumber]);

  return (

    <div className="w-full max-w-3xl">
        
            {selector && selector.map((tag:any ) => (
                <div key={tag?.scenario_id} className="pb-10">
                    <div className="pt-4 pb-2"><Badge  variant="secondary">{tag?.category}</Badge></div>
                    <div className="text-3xl pb-4">{tag?.title}</div>
                    <div className={styles.emphasizedText}><Markdown>
                        {tag?.full_post_description}
                    </Markdown></div>
                    <div className="flex justify-center py-4">
                    <Link href={`/sections/scenarios/${encodeURIComponent(tag?.scenario_id)}`}>
                    <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded justify-center">Let&apos;s Go</div>
                    </Link>                
                    </div>
                    <hr className="h-px my-8 bg-gray-200 border-1 dark:bg-gray-900"></hr>
                    <div className="">
                    <ScenarioExplainer />
                    </div>
                </div>
    ))}
    
    </div>

    );
}

export default SinglePost;