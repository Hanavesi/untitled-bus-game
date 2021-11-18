import React, { useRef, useState } from 'react';
import { Engine } from '../Engine/Engine';
import { Howl, Howler } from 'howler'
import Running from '../Assets/music/run.mp3';
import { EntityGenerator } from "../Engine/Util/EntityGenerator";


export function Game({ mqttHandler }) {
  const [ready, setReady] = useState(false);
  const engine = useRef(null);
  const visible = { visibility: 'visible' };
  const hidden = { visibility: 'hidden' };

  // counter for which level is going (every stop increments counter)
  let level = 0;

  const mapToShow = (type) => {
    const canvas = document.getElementById("gameCanvas");
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    engine.current = new Engine(canvas, width, height, setReady, type, level);
  }

  React.useEffect(() => {
    mapToShow('GAME');

    mqttHandler.setMessageCallback(onMessage)

    window.addEventListener('resize', () => {
      const canvas = document.getElementById("gameCanvas");
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      engine.current.onWindowResize(width, height);
    });
    window.addEventListener('mousemove', (e) => {
      const pos = { x: (e.clientX / window.innerWidth) * 2 - 1, y: -(e.clientY / window.innerHeight) * 2 + 1 };
      engine.current.setMousePos(pos);
    });

    const sound = new Howl({
      src: [Running],
      volume: 0.05,
      loop: true
    });
    sound.play();

    return (() => {
      mqttHandler.disconnect();
      sound.stop();
      sound.unload();
    });
  }, []);

  const onMessage = (message, topic) => {
    // do stufs
    //console.log(message);
    const data = JSON.parse(message);
    const eventType = Object.keys(data)[0];
    // change room when bus arrives or leaves stop, or comes to endstop
    if (eventType === 'ARS') {
      console.log('bussi saapui pysäkille');
      mapToShow('SHOP')
    }
    else if (eventType === 'DEP') {
      console.log('bussi lähti pysäkiltä');
      level += 1;
      mapToShow('GAME')
    }
    else if (eventType === 'VJOUT') {
      console.log('bussi saapui PÄÄTTÄRILLE');

    }
  }

  return (
    <div>
      <canvas id="gameCanvas" style={ready ? visible : hidden} />
    </div>
  );

}

export default Game;