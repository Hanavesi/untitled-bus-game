import React from 'react';
import { Engine } from './Engine/Engine';

function Game(props) {
    const [ready, setReady] = React.useState(false);
    const visible = { visibility: 'visible' };
    const hidden = { visibility: 'hidden' };

    React.useEffect(() => {
        const canvas = document.getElementById("gameCanvas");
        canvas.width = props.width;
        canvas.height = props.height;

        new Engine(canvas, props.width, props.height, setReady);
    }, [props]);

    return (
        <div>
            <canvas id="gameCanvas" style={ready ? visible : hidden} />
        </div>
    );

}

export default Game;