import React, { useRef, useState } from 'react';
import { Engine } from '../Engine/Engine';

export function Game() {
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
        window.addEventListener('mousemove', (e) => {
            const pos = {x:(e.clientX / window.innerWidth) * 2 - 1, y:-(e.clientY / window.innerHeight) * 2 + 1};
            engine.current.setMousePos(pos);
        });
        
    }, []);


    return (
        <div>
            <canvas id="gameCanvas" style={ready ? visible : hidden} />
        </div>
    );

}

export default Game;