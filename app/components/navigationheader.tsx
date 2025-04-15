'use client';

import React, { useState } from 'react';
import { nanoid } from 'nanoid';
import Link from "next/link";

function NavigationHeader() {
  // const [items, setItems] = useState([]);

  const addItem = () => {
    return nanoid(); // Generate a unique ID with nanoid
  };

  return (
        
        <nav className="flex items-start">
            {[
              ['Deparley', '/'],
              ['FAQ', '/sections/faq'],
              ['Instructions', '/sections/instructions'],           
              ['About', '/sections/about'],
              ].map(([title, url]) => (
                  <Link key={addItem()} href={url} className="rounded-lg pr-3 py-2 text-slate-700 font-medium hover:bg-slate-100 hover:text-slate-900">{title}</Link>
            ))}
        </nav>
        
  );
}

export default NavigationHeader;