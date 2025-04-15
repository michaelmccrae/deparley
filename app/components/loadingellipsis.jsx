'use client';

import React, { useState, useEffect } from 'react';

function LoadingEllipsis() {
  const [dots, setDots] = useState('.');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length === 3) {
          return '.';
        } else {
          return prevDots + '.';
        }
      });
    }, 500); // Adjust the interval (in milliseconds) for animation speed

    return () => clearInterval(interval); // Cleanup on unmount
  },);

  return (
    <div>
      Loading{dots}
    </div>
  );
}

export default LoadingEllipsis;