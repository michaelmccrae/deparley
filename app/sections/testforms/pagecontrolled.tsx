'use client';
import React from 'react'
import {useState, useEffect, useRef} from 'react'

export default function Home() {
// const inputRef = useRef<HTMLInputElement>(null);
const [username, setUserName] = useState("");
return (
    <main>
        <form onSubmit={(e) => {
            e.preventDefault();
            // const inputValue = inputRef.current?.name;
            console.log('username Value:', username);
            // Perform any action with the input value here
        }}>
            <input value={username} onChange={(e) => setUserName(e.target.value)} type="bob" name="sadfasdfasdfsadfsdf" />
            <button>Submit</button>
        </form>
    </main>
);
}
