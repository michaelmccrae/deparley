// import React from 'react';

// const data = [
//   {
//     role: "user",
//     content: "What's your budget?",
//     similarity: [0.14241211116313934, 0.9839397668838501, 0.22771959006786346],
//     threshold: true,
//     order: 1,
//     matchedQuestion: "What is your budget?"
//   },
//   {
//     role: "user",
//     content: "When do you want to move in?",
//     similarity: [0.25239086151123047, 0.2488865703344345, 1],
//     threshold: true,
//     order: 2,
//     matchedQuestion: "When do you want to move in?"
//   },
//   {
//     role: "user",
//     content: "Are you making the decision on your own?",
//     similarity: [0.6976458430290222, 0.14377257227897644, 0.3129001259803772],
//     threshold: true,
//     order: 0,
//     matchedQuestion: "Will you be making the decision on this or is anyone else involved?"
//   },
//   {
//     role: "user",
//     content: "Do you prefer houses or condos?",
//     similarity: [0.1, 0.2, 0.3],
//     threshold: false,
//     order: 1,
//     matchedQuestion: "What is your budget?"
//   }
// ];

// const MatchedFlexList = () => {
//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//       {data.map((item, idx) => (
//         <div
//           key={idx}
//           style={{
//             display: 'flex',
//             gap: '24px',
//             alignItems: 'center',
//             padding: '8px 0',
//             borderBottom: '1px solid #eee'
//           }}
//         >
//           <div>{item.threshold ? '✅' : '❌'}</div>
//           <div style={{ fontStyle: 'italic' }}>"{item.content}"</div>
//           <div style={{ color: '#888' }}>{item.matchedQuestion}</div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default MatchedFlexList;
