'use client';
import React from 'react'
import {useState, useEffect, useRef} from 'react'

export default function Home() {
const inputRef = useRef<HTMLInputElement>(null);
return (
    <main>
        <form onSubmit={(e) => {
            e.preventDefault();
            const inputValue = inputRef.current?.name;
            console.log('Input Value:', inputValue);
            // Perform any action with the input value here
        }}>
            <input ref={inputRef} type="bob" name="sadfasdfasdfsadfsdf" />
            <button>Submit</button>
        </form>
    </main>
);
}
