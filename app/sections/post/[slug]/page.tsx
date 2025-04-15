import SinglePost from './SinglePost';
import { createClientSupa } from '../../../../utils/supabase/client';

async function supabaseDeparley () {
    const supabase = createClientSupa();
    const { data: scenariosNumbers } = await supabase.from('scenarios').select('scenario_id');
    return scenariosNumbers;
}

export async function generateStaticParams() {
    const mapScenarios = await supabaseDeparley();
    return mapScenarios?.map((post) => ({
        slug: post.scenario_id!.toString(),
    })); 
  }


  import React from 'react'
  
  function Page({ params: { slug } }: { params: { slug: any | null} }) {
    return (
      <SinglePost slugNumber={slug} />
    )
  }
  
  export default Page;

// export default function Page({ params: { slug } }: { params: { slug: number } }) {
//     return <SinglePost slug={slug} />;
//   }