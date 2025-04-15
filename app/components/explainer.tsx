"use client";

import React from 'react'
import { MicVocal, Speaker, KeyRound  } from 'lucide-react';
import styles from './styles.module.css'

import { YouTubeEmbed } from '@next/third-parties/google'

const Explainer = () => {

  return (
    <div className = "py-8">

      <div>
      <YouTubeEmbed videoid="KPUhKygOuVs" height={400} params="controls=0" />
      </div>


        <div className="pb-6 pt-6">Deparley is online instruction for negotiation. Listening is <span className={styles.markyellow}><span className="inline-flex items-center"><KeyRound size={16} /></span> key</span>. You need to use your <span className={styles.markblue}><span className="inline-flex items-center"><Speaker size={16} /></span> speaker</span> and your <span className={styles.markblue}><span className="inline-flex items-baseline"><MicVocal size={16} /></span> mic</span>.</div>
        <div className="font-bold pb-6">STEPS</div>
        <ul className="list-decimal list-inside pl-6">
        <li>Select a scenario below.</li>
        <li>When you are familiar with the scenario, enter the practise session.</li>
        <li>Press start to begin interaction with the AI agent. You are assessed on asking relevant, qualifying questions that moves the deal forward.</li>
        <li>When the question segement ends, the AI agent will ask you a question. Your answer will be scored on completeness, as well as your ability to speak confidently about your offerings. </li>
        </ul>

        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
      
    </div>
  )
}

export default Explainer;
