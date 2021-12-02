import { useEffect, useState } from "react";


export default function GameStats(props) {
  const [score, setScore] = useState(0);

  useEffect(() => {
    setScore(props.score);
  }, [props.score])

  return (
    <div
      style={{
        fontSize: '25px',
        display: 'flex',
        position: 'absolute',
        fontFamily: 'Games',
        bottom: 0,
        left: 0,
        right: 0,
        width: '10vw',
        minWidth: '200px',
        height: '65px',
        margin: 'auto',
        zIndex: 2,
        backgroundColor: 'black',
        color: 'white', //this is the text color dummie
        borderTopLeftRadius: '40px', //makes the round effect
        borderTopRightRadius: '40px', //makes the round effect
        ...props.style
      }}>
      <p style={{ flex: 3, textAlign: 'center' }}>Score</p>
      <p style={{ flex: 1 }} id='score'>{score}</p>
    </div>
  );
}