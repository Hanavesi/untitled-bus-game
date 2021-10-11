import React, { useRef, useState } from 'react';
import { Engine } from './Engine/Engine';

function Game(props) {
    const [ready, setReady] = useState(false);
    const engine = useRef(null);
    const visible = { visibility: 'visible' };
    const hidden = { visibility: 'hidden' };

    React.useEffect(() => {
        const canvas = document.getElementById("gameCanvas");
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        engine.current = new Engine(canvas, width, height, setReady);

        window.addEventListener('resize', () => {
            const canvas = document.getElementById("gameCanvas");
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            engine.current.onWindowResize(width, height);
        });
    }, [props]);


    return (
        <div>
            <canvas id="gameCanvas" style={ready ? visible : hidden} />
        </div>
    );

}

export default Game;