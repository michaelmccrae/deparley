import React, { useState, useEffect } from 'react';

const Dotsanimate = () => {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev + 1) % 4); // cycle from 0 to 3
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span style={{ display: 'inline-block', width: '1em', textAlign: 'right', marginRight: '4px' }}>
        {'.'.repeat(dots)}
      </span>

    </div>
  );
};



export default Dotsanimate;
