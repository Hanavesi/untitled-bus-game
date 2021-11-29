import { useEffect, useState } from "react";


export default function GameStats(props) {
  const [score, setScore] = useState(0);

  useEffect(() => {
    setScore(props.score);
  }, [props.score])

  return (
    <div
      style={{
        display: 'flex',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        width: '10vw',
        margin: 'auto',
        zIndex: 2,
        backgroundColor: 'white',
        ...props.style
      }}>
      <p style={{ flex: 3, textAlign: 'center' }}>Score</p>
      <p style={{ flex: 1 }} id='score'>{score}</p>
    </div>
  );
}