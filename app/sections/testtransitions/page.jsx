"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

function AnimatedText({ showText }) {
  return showText ? (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mt-4"
    >
      This text appears with a fade-in transition.
    </motion.p>
  ) : null;
}

function SimpleTransitionExample() {
  const [showText, setShowText] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <button
        onClick={() => setShowText(!showText)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
      >
        Toggle Text
      </button>
      <AnimatedText showText={showText} />
    </div>
  );
}

export default SimpleTransitionExample;

