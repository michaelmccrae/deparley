'use client';

import React, {useEffect, useState} from 'react';
import Versionone from './versionone';
// import Versiontwo from './versiontwo';
import Versionthree from './versionthree';

const merged = [
    {
        "role": "user",
        "content": "What's your budget?",
        "similarity": [
            0.14241211116313934,
            0.9839397668838501,
            0.22771959006786346
        ]
    },
    {
        "role": "assistant",
        "content": "My budget is $750,000.",
        "latency": 3244
    },
    {
        "role": "user",
        "content": "When do you want to move in?",
        "similarity": [
            0.25239086151123047,
            0.2488865703344345,
            1
        ]
    },
    {
        "role": "assistant",
        "content": "I'm not in a hurry, so I'm looking to move in within the next 12 months.",
        "latency": 3308
    },
    {
        "role": "user",
        "content": "Are you making the decision on your own?",
        "similarity": [
            0.6976458430290222,
            0.14377257227897644,
            0.3129001259803772
        ]
    },
    {
        "role": "assistant",
        "content": "No, my girlfriend Kristen and I are making the decision together. Can you tell me about the kitchen?",
        "latency": 3483
    }
]

const masterQuestion = ["Will you be making the decision on this or is anyone else involved?","What is your budget?","When do you want to move in?"]

// const mergedUser = merged.filter((msg) => msg.role === 'user')

type DataItem = {
  role: string;
  content: string;
  similarity: number[];
  threshold: boolean;
};

type DataItemWithOrder = DataItem & {
  order: number;
};

type OrderMap = Record<number, string>;

type UserMessage = {
  role: "user";
  content: string;
  similarity: number[];
  threshold: boolean;
  order: number;
};

type MergedUserMessage = UserMessage & {
  matchedQuestion: string;
};


const Page = () => {

    useEffect(() => {
        console.log("merged", merged)
        console.log("masterQuestion", masterQuestion)
        const mergedUser = merged.filter((msg) => msg.role === 'user')
        console.log("mergedUser", mergedUser)
        const thresholdAdded = addThreshold(mergedUser)
        console.log("threshold added", thresholdAdded)
        const orderAdded = addOrder(thresholdAdded)
        console.log("order added", orderAdded)
        const masterwithIndex = indexQuestions(masterQuestion)
        console.log("master with index", masterwithIndex)
        const megaMerger = mergeByOrder(masterwithIndex, orderAdded)
        console.log("megaMerger", megaMerger)
    }, [])

    // console.log("merged", merged)
    // console.log("masterQuestion", masterQuestion)
    // console.log("mergedUser", mergedUser)

    // check similarity and return true or false

    function addThreshold(data: any[]) {
        return data.map((item) => {
          const hasHighSimilarity = item.similarity.some((value: number) => value > 0.5);
          return {
            ...item,
            threshold: hasHighSimilarity
          };
        });
      }

      // index of value with highest value in similarity array

      function addOrder(data: DataItem[]): DataItemWithOrder[] {
        return data.map((item) => {
          const maxIndex = item.similarity.reduce(
            (maxIdx, val, idx, arr) => (val > arr[maxIdx] ? idx : maxIdx),
            0
          );
          return {
            ...item,
            order: maxIndex
          };
        });
      }

      // add index value to master

      function indexQuestions(questions: string[]): Record<number, string> {
        return questions.reduce((acc: Record<number, string>, question, index) => {
          acc[index] = question;
          return acc;
        }, {});
      }

      // add matched question to mergedUser

      function mergeByOrder(
        orderOne: OrderMap,
        orderTwo: UserMessage[]
      ): MergedUserMessage[] {
        return orderTwo.map((item) => {
          const matchedQuestion = orderOne[item.order];
          return {
            ...item,
            matchedQuestion
          };
        });
      }
      
      
      


  return (
    <div>page stuff

      {/* <Versionone /> */}

      {/* <Versiontwo /> */}

      {/* <Versionthree /> */}

      
    </div>
  )
}

export default Page