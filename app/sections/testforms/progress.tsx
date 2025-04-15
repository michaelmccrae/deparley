import React from 'react';

const ProgressBar = ({ progress = 5, total = 7, pending = 1 }) => {
  const squares = Array.from({ length: total }, (_, i) =>
    i < progress ? 'black' : i < progress + pending ? 'lightgrey' : 'white'
  );

  console.log("squares in ProgressBar", squares);
  console.log("progress in ProgressBar", progress);

  return (
    <div className="flex flex-col items-center">
      <div className="flex space-x-1">
        {squares.map((color, index) => (
          <div
            key={index}
            className={`w-8 h-8 border border-black ${color === 'black' ? 'bg-black' : color === 'lightgrey' ? 'bg-gray-300' : 'bg-white'}`}
          />
        ))}
      </div>
      <p className="mt-2 text-lg font-bold">LOADING</p>
    </div>
  );
};

export default ProgressBar;
