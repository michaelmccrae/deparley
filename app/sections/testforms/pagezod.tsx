'use client';
import React from 'react'
import {useState, useEffect, useRef} from 'react'
import z from 'zod';

const emailSchema = z.object({
    email: z.string()
  });

export default function Home() {
// const inputRef = useRef<HTMLInputElement>(null);

// const person = {
//     firstName: 'John',
//     lastName: 'Doe',
//     otherName: 'John',
//     age: 30,    

    
//     // This is a getter
//     get fullName() {
//       return `${this.firstName} ${this.age}`;
//     }
//   };
  
  // Accessing the getter
//   console.log(person.fullName); // "John Doe"


return (
    <main>
        <form onSubmit={(e) => {
            e.preventDefault();
            // const inputValue = inputRef.current?.name;
            // Perform any action with the input value here
            const formData = new FormData(e.currentTarget);
            // console.log(formData.get('email'));
            const formValues = Object.fromEntries(formData);
            const formValuesTwo = formData.get('email');
            console.log("stuff",formValues);
            console.log("stuff",formValuesTwo);
            const anotherResult = emailSchema.safeParse(formValues);
            console.log("anotherResult",anotherResult);
        }}>
            <input  type="text" name="email" />
            <button>Submit</button>
        </form>
    </main>
);
}
