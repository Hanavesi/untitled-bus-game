import React from 'react'
import { useHistory } from "react-router-dom";

function GameOver({ score }) {

    const history = useHistory();

    const handleRoute = () => {
        history.push("/");
    }

    return (
        <div className="GameScreens">
            <h1>GAME OVER</h1>

            {/* <h2>YOU FAILED TO BE THE SIGMALEST MALE THERE IS</h2>
            <h2>YOU DIED LIKE A FKING MOUTHBREATHER BETA LADY</h2> */}

            <h5>Your score was {score}</h5>
        

        <button onClick={handleRoute} className="backButton">Back</button>
        </div>
    )
}

export default GameOver
