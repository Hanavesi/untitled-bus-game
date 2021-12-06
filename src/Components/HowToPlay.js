import React from 'react'
import wasdnew from '../Assets/images/wasdnew.png'
import { useHistory } from "react-router-dom";



function HowToPlay() {

    const history = useHistory();

    const handleRoute = () => {
        history.push("/");
    }

    return (
        <div className="HowTo">
            <h1>How to Play?</h1>
            <br />
            <h3>Pick a bus you want to get in, to start the game</h3>
            <br />
            <h3>Use
                <img src={wasdnew}
                    style={{
                        width: '100px',
                        height: '50px',
                        borderRadius: '10px',
                        marginBottom: '-18px',
                        marginLeft: '10px',
                        marginRight: '10px'
                    }} />
                to move</h3>
            <br />
            <h3>Use mouse to aim and left-click to shoot</h3>
            <br />
            <h3>While the bus is on bus-stop, you are transferred to store</h3>
            <br />
            <h3>You will win if you make it to the final stop</h3>
            <br/>
            <h3>Please use sounds for best gameplay experience</h3>
            <br/>
            <button onClick={handleRoute} className="backButton">Back</button>
        </div>
    )
}

export default HowToPlay
