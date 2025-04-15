'use client';

import { createClientSupa } from '../utils/supabase/client';
import Link from 'next/link'
import React, { useEffect, useState } from 'react';    
import Explainer from './components/explainer';
import { Badge } from "@/components/ui/badge"

import type { Database } from '../lib/database.types';

type Scenarios = Database['public']["Tables"]["scenarios"]['Row'];

function Page() {
    const [selector, setSelector] = useState<any>([]);
    
        useEffect(() => {
            async function supabaseDeparley () {
            const supabase = createClientSupa();
            const { data: scenarios } = await supabase.from('scenarios').select();
            console.log("scenarios", scenarios);          
            if (scenarios) {
                setSelector(scenarios);
            }
            }
            supabaseDeparley(); 
        }   , []);

  return (

    <div className="w-full max-w-3xl">
        <Explainer />
    {selector && selector.map((tag:any) => (
        <div key={tag?.scenario_id} className="pb-10">
            <Badge variant="secondary">{tag?.category}</Badge>
            <Link href={`/sections/post/${encodeURIComponent(tag?.scenario_id)}`}>
            <div className="text-3xl transition-transform duration-300 hover:text-blue-700">
                {tag?.title}
            </div>
            </Link>
            <div className="">{tag?.subtitle}</div>
        </div>
    ))}
    </div>

    );
}

export default Page;