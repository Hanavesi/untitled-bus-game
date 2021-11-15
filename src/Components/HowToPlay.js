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
            <h3>// lisätään tekstejä mitä halutaan </h3>
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
            <h3>Use mouse to aim and shoot</h3>
            <br />
            <h3>Enemies have diffirent capabilities</h3>
            <button onClick={handleRoute} className="backButton">Back</button>
        </div>
    )
}

export default HowToPlay
