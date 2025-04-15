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
//   }
// ];

// const MatchedTable = () => {
//   return (
//     <table style={{ borderCollapse: 'collapse', width: '100%' }}>
//       <thead>
//         <tr>
//           <th style={{ border: '1px solid #ccc', padding: '8px' }}>Matched Question</th>
//           <th style={{ border: '1px solid #ccc', padding: '8px' }}>User Content</th>
//           <th style={{ border: '1px solid #ccc', padding: '8px' }}>✓</th>
//         </tr>
//       </thead>
//       <tbody>
//         {data.map((item, idx) => (
//           <tr key={idx}>
//             <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.matchedQuestion}</td>
//             <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.content}</td>
//             <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>✅</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };

// export default MatchedTable;
