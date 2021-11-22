import React from 'react'
import { useHistory } from "react-router-dom";

function YouWon() {

    const history = useHistory();

    const handleRoute = () => {
        history.push("/");
    }

    return (
        <div className="GameScreens">
            <h1>OMG YOU ARE A VIINERI</h1>

            {/* <h2>YOU FAILED TO BE THE SIGMALEST MALE THERE IS</h2>
            <h2>YOU DIED LIKE A FKING MOUTHBREATHER BETA LADY</h2> */}

            <h5>Your score was MILLIONS POINTS NICE</h5>
        

        <button onClick={handleRoute} className="backButton">Back</button>
        </div>
    )
}

export default YouWon
