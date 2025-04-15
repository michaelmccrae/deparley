import React from 'react'
import { MicVocal, Speaker } from 'lucide-react';
import styles from './styles.module.css'


const scenarioExplainer = () => {
    
  return (
    <>
        <div className="font-bold pb-4">Instructions</div>
        <div className="pb-6">
        <div className="pb-6">Start by asking the client questions. You need to use your <span className={styles.markblue}><span className="inline-flex items-baseline"><Speaker size={16} /></span> speaker</span> and your <span className={styles.markblue}><span className="inline-flex items-baseline"><MicVocal size={16} /></span> mic</span>. You will then be asked to respond, telling the client what services you can provide. You will be scored on the following:</div>
        <div className="indent-6">
        <div>1. Asking constructive, relevant questions. </div>
        <div>2. While responding, speaking clearly with conviction about the services offered. </div>
        <div>3. When responding, fully addressing the client&apos;s needs.</div>
        </div>
        </div>
    </>
  )
}

export default scenarioExplainer;