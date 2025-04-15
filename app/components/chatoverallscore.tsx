import React, {useEffect, useState} from 'react'
import { Star, StarHalf  } from 'lucide-react';
import styles from './styles.module.css'
import { SENTENCE_SIMILARITY_THRESHOLD, NUMBER_OF_STARS } from "@/lib/constants";
import Loadinganimate from "@/lib/loadinganimate"  // Thinking during processing

const Chatoverallscore = ({mergedMsgSimilarity, toneDeepseek, pauseCount, fillerCount, feedbackCount}: any) => {
      const [scoreStars, setScoreStars] = useState<any>(null);
      const [scoreFromAverage, setScoreFromAverage] = useState(0);

      useEffect (() => {
          console.log("mergedMsgSimilarity in chatoverallscore***********************", mergedMsgSimilarity);
          console.log("toneDeepseek in chatoverallscore**********************", toneDeepseek);
          console.log("pauseCount in chatoverallscore**********************", pauseCount);
          console.log("fillerCount in chatoverallscore**********************", fillerCount);
          console.log("feedbackCount in chatoverallscore**********************", feedbackCount);
          console.log("qualifyingQuestions(mergedMsgSimilarity: any)*****************", qualifyingQuestions(mergedMsgSimilarity));
      }, [mergedMsgSimilarity, toneDeepseek])

      // calculate missing questions in user's response

      function qualifyingQuestions(gettingQualifying: any) {
        const missingQuestions = gettingQualifying.filter((item: any) => item.similarity < SENTENCE_SIMILARITY_THRESHOLD);
        return missingQuestions.length;
      }

       // calculate 1/2 or whole

       function roundToHalfOrWhole(num:any) {
        const floorNum = Math.floor(num);
        const decimalPart = num - floorNum;
      
        if (decimalPart < 0.25) {
          return floorNum;
        } else if (decimalPart < 0.75) {
          return floorNum + 0.5;
        } else {
          return floorNum + 1;
        }
      }

      // math for score

      useEffect(() => {
        if (feedbackCount !== null) {
        const counts = [fillerCount, pauseCount, feedbackCount];
        const averageTotal = counts.reduce((sum, value) => sum + value, 0) / counts.length;
        // console.log("chatoverallscore",average); // Output: 5
        console.log("average in chatoverallscore",averageTotal); // Output: 5
        console.log("counts in chatoverallscore",counts); // Output: 5
        setScoreFromAverage(NUMBER_OF_STARS - roundToHalfOrWhole(averageTotal));
        setScoreStars(scoreValue(NUMBER_OF_STARS - roundToHalfOrWhole(averageTotal)));
        }
      }, [fillerCount, pauseCount, feedbackCount])

      // calculate stars

      function scoreValue(score: number) {
        const stars = [];
        const fullStars = Math.floor(score);
        const hasHalfStar = score % 1 !== 0;
      
        for (let i = 0; i < fullStars; i++) {
          stars.push(<Star size={36} key={i} />);
        }
      
        if (hasHalfStar) {
          stars.push(<StarHalf size={36} key={fullStars} />);
        }
      
        return <div className="flex items-center">{stars}</div>;
      }




  return (
    <div>
      
    <div className="font-bold mb-4 uppercase">Overall Score</div>
    <div>
      {scoreFromAverage === 0 ? (
       <Loadinganimate />
      ) : (
        <><div className="flex items-center justify-center text-7xl"><span className="inline-flex items-center"><span className={styles.markyellow}>{scoreStars}</span></span></div>
        <div className="flex items-center py-2 justify-center font-bold">{scoreFromAverage} out of 5</div></>
      )}

    </div>

    </div>
  )
}

export default Chatoverallscore;