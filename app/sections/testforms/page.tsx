// BreathComponent.jsx
import React from 'react';
import styles from './style.module.css';
import ProgressBar from './progress';

const BreathComponent = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.breatheText}>Breathing Exercise</h1>
      {/* <div className={styles.breathCircle}>
        <span className={styles.breathText}>Breathe</span>
      </div> */}
      <p className={styles.instructions}>
        Follow the circle as it expands and contracts
      </p>
      <ProgressBar progress={3} total={7} />
    </div>
  );
};

export default BreathComponent;