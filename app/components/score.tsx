import React, {useEffect, useState} from 'react'
import { Star, StarHalf  } from 'lucide-react';
import styles from './styles.module.css'

const Score = ({numberOfFillerWordsScore, numberOfPausesScore, blurQuestionsScore, totalPoints, assessScore}: any) => {
    const [scoreStars, setScoreStars] = useState<any>(null);
    const [scoreFromAverage, setScoreFromAverage] = useState(0);

    useEffect (() => {
        console.log("numberOfFillerWordsScore***********************", numberOfFillerWordsScore);
        console.log("numberOfPausesScore88888888888888888888888888888888", numberOfPausesScore);
        console.log("blurQuestionsScore888888888888888888888888888888", blurQuestionsScore);
    }, [numberOfFillerWordsScore, numberOfPausesScore, blurQuestionsScore])

    // calculate how many points were missed in user's response

    function assessingScore(pointsMade: any, totalPoints: any): number {
      const pointsMissed = Number(totalPoints) - Number(pointsMade);
      return pointsMissed;
  }

    // to calculate the score take average of three props and then subtract from 5

    useEffect(() => {
        let averageTotal = ((numberOfFillerWordsScore + numberOfPausesScore + countFalseValues(blurQuestionsScore)) + assessingScore(assessScore, totalPoints) / 4);
        console.log("assessingScore(assessScore, totalPoints)**************", assessingScore(assessScore, totalPoints));
        console.log("averageTotal**************", averageTotal);
        console.log("assessScore**************", assessScore);
        console.log("totalPoints**************", totalPoints);
        setScoreFromAverage(5 - roundToHalfOrWhole(averageTotal));
        setScoreStars(scoreValue(5 - roundToHalfOrWhole(averageTotal)));
    }, [numberOfFillerWordsScore, numberOfPausesScore, blurQuestionsScore, assessScore, totalPoints])


    // calculate number of false key values in blurQuestionsScore

    function countFalseValues(obj:any) {
        let falseCount = 0;
        for (const key in obj) {
          if (obj.hasOwnProperty(key) && obj[key] === false) {
            falseCount++;
          }
        }
        return falseCount;
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


    // const score = 2.5;

    // useEffect(() => {
    //     setScoreStars(scoreValue(score));
    // }, [score])

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
    <div className="flex items-center justify-center text-7xl"><span className="inline-flex items-center"><span className={styles.markyellow}>{scoreStars}</span></span></div>
    <div className="flex items-center py-2 justify-center font-bold">{scoreFromAverage} out of 5</div>
    </div>
  )
}

export default Score