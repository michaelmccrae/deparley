import React from 'react'
// import Markdown from 'markdown-to-jsx'
// import fs from "fs";
import Link from 'next/link'


const Page = () => {


  // const fileContents = fs.readFileSync('./public/markdown/about.md', "utf8");



  return (
 
    <div className="py-16">
    <p>Deparley is online instruction for negotiation using practial scenarios. Emphasis is on learning by doing. Deparley is frictionless service to perform various sales calls and negotiation scenarios. Artificial intelligence is seeing growth in services that use human voice for interaction. Deparley is harnessing the best of those services. </p>
    <p>
          Reach out. Email mike (at) mccrae (dot) ca. The site&apos;s developer is also on <Link
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
  )
}

export default Page