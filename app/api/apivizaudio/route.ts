// export const runtime = 'edge'; // 'nodejs' is the default fixing https://vercel.com/docs/functions/runtimes/edge
export const runtime = 'nodejs';

import {NextResponse} from 'next/server';

async function callJSONPlaceholder(toSend:any) {
    try {
      const response = await fetch('https://reqres.in/api/users', {
        method: 'POST',
        body: JSON.stringify({ toSend }), 
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
  
      const json = await response.json();
      console.log(json);
      return json; 
  
    } catch (error) {
      console.error('Error:', error); 
    }
  }

export async function POST(request: Request) {

    const data = await request.json();
    const JSONPlaceholder = await callJSONPlaceholder(data);
    console.log("@@@@@@@@@@@@@@@@@@@",JSONPlaceholder);
    return Response.json({ JSONPlaceholder })
}