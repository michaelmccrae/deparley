// export const runtime = 'edge'; // 'nodejs' is the default fixing https://vercel.com/docs/functions/runtimes/edge
export const runtime = 'nodejs';

import { NextResponse } from "next/server";

    function removeLastElement(list:string[]) {
      /* 
      Removes the last element from a list.

      Args:
        list: The list to remove the last element from.

      Returns:
        The list with the last element removed.
      */
      if (list.length > 0) {
        list.pop();
      }
      return list;
    }


    
      // API call for loop

      async function queryLoop(masterQues: string[], userQues: [string]) {
        const results = [];
      
        for (const question of masterQues) {
          results.push(question)
          console.log("masterQues", question);
          console.log("userQues", userQues);
          console.log("userQues w brackets", userQues);
          console.log("results*********** ", results);
      
          const apiUrl =
          // "https://v74vwwcy417sx12u.us-east-1.aws.endpoints.huggingface.cloud";
            "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2";
      
          const requestOptions = {
            headers: {
              Authorization: process.env.HF_API_KEY!,
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
              inputs: {
                source_sentence: question, // Use the current question from the loop
                sentences: userQues,
              },
            }),
          };
      
          try {
            const response = await fetch(apiUrl, requestOptions);
            console.log("response in query!!!!!!!!!!!!!!!!!!", response);
            const HFData = await response.json();
            console.log("HFData", HFData);
            results.push(HFData); // Store the result for each question
          } catch (error) {
            console.error("Error fetching similarity scores:", error);
            throw error; // Re-throw the error to be handled by the caller
          }
        }
        console.log("results^^^^^^^^^^^^^^^^^", masterQues, userQues, results[0]);
      
        return results; // Return all results after the loop completes
      }


export async function POST(request: Request) {

    const data = await request.json();
    
    console.log("QUESTIONS SENT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",data);
    const HFData = await queryLoop(data.masterQuestions, data.userQuestions)
    return Response.json( HFData )
}

