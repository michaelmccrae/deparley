'use client';

import React, {useEffect, useState} from 'react';
import { CircleCheckBig, CircleX } from 'lucide-react';
import { SENTENCE_SIMILARITY_THRESHOLD } from "@/lib/constants";


const Chatquestionscore = ({mergedMsgSimilarity}:any) => {
  const [similarityScoring, setSimilarityScoring] = useState<any[]>([]);

  useEffect(() => {
    if (mergedMsgSimilarity && mergedMsgSimilarity.length > 0) {
     
      setSimilarityScoring(mergedMsgSimilarity);
    }
  }
  , [mergedMsgSimilarity]);

  return ( 
    <div className="pb-4">
      {mergedMsgSimilarity && (
        <div className="font-bold mb-4 uppercase">Qualifying questions</div>
      )}
  
      <div>
        {similarityScoring &&
          similarityScoring
            .filter(msg => msg.role === 'user')
            .map((msg, index) => {
              const hasHighSimilarity = msg.similarity.some((score: number) => score > SENTENCE_SIMILARITY_THRESHOLD);
              return (
                <div key={index} className="px-6 mb-1 flex items-center gap-2">
                  {hasHighSimilarity ? <CircleCheckBig /> : <CircleX />}
                  <span>{msg.content}</span>
                </div>
              );
            })}
      </div>
    </div>
  );
  
}

export default Chatquestionscore