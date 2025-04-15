import React from 'react'
// import Markdown from 'markdown-to-jsx'
// import fs from "fs";
import Link from 'next/link'


const Page = () => {

  // const fileContents = fs.readFileSync('./public/markdown/faq.md', "utf8");

  return (
    <div className="py-16">
      <div>
        <h2>What is Deparley?</h2>
        <p>Deparley provides online instruction for negotiation and selling.</p>
  
        <h2>Why the focus on listening?</h2>
        <p>
          It starts with listening. Clients feel complimented when they believe they’re truly being heard and understood. Show respect by fully listening to them and understanding the problem they are trying to solve. Selling is, at its core, listening.
        </p>
  
        <h2>Why the focus on qualifying questions?</h2>
        <p>
          When clients ask questions, it presents an opportunity to uncover their motivations and develop rapport. Tailor your pitch to align with the solutions they’re looking for. Your job is to match your service offerings to their needs. Also, qualify the client to ensure you’re speaking with someone who has decision-making authority and the budget. You need to model your prospects effectively.
        </p>
  
        <h2>Do I need to use a mic?</h2>
        <p>
          Yes. Focus on listening and giving the person your full attention. Speaking out loud is much different than just thinking it or typing it. Deparley also includes tools to assess the tone of your response.
        </p>
  
        <h2>So how does this work?</h2>
        <p>
          <Link
            href="/sections/instructions"
            className="text-blue-600 underline hover:text-blue-800"
          >
            See the instructions section.
          </Link>
        </p>
  
        <h2>What are filler words and why do you measure them?</h2>
        <p>
          Examples of filler words include &quot;um&quot; and &quot;ah&quot;, which can signal hesitancy and uncertainty. Speaking without filler words demonstrates confidence and clarity.
        </p>
  
        <h2>How are scores assessed?</h2>
        <p>
          The maximum score is five stars. Users are evaluated based on completeness of answers, confidence in responses, and use of qualifying questions. Any miss results in a deduction. For example, if a user utters two filler words and fails to ask two qualifying questions, the breakdown is: filler words (2), pauses (0), missed questions (2), and missed completeness (0). That totals four misses across four elements resulting in a score of four out of five stars.
        </p>
  
        <h2>What is the tech stack?</h2>
        <p>
          The web app is built using Next.js, Supabase, and a plethora of AI services.
        </p>

        <h2>How do I contact you?</h2>
        <p>
          Email mike (at) mccrae (dot) ca. The site&apos;s developer is also on <Link
            href="https://x.com/michaelmccrae"
            className="text-blue-600 underline hover:text-blue-800"
          >X
            
          </Link>
          , <Link
            href="https://www.linkedin.com/in/michaelallanmccrae/"
            className="text-blue-600 underline hover:text-blue-800"
          >
            LinkedIn            
          </Link> and <Link
            href="https://wa.me/16049701754"
            className="text-blue-600 underline hover:text-blue-800"
          >
            WhatsApp
          </Link>.
        </p>
      </div>
    </div>
  )
  
}

export default Page