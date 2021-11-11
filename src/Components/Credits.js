import React from 'react'
import { useHistory } from "react-router-dom";

function Credits() {

    const history = useHistory();

    const handleRoute = () => {
        history.push("/");
    }
    return (
        <div class="nimet">
            <h1>Juuso Kalliomäki</h1>
            <h1>Jesse Karsimus</h1>
            <h1>Jose Junninen</h1>
            <h1>Joni Sandberg</h1>
            <h1>Niko Lindgren</h1>

            <button onClick={handleRoute} className="backButton">Back</button>
        </div>
    )
}

export default Credits
