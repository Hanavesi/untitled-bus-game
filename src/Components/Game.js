import React, { useRef, useState } from 'react';
import { Engine } from '../Engine/Engine';
import { Howl, Howler } from 'howler'
import Running from '../Assets/music/run.mp3';
import { getEventListeners, addEventListeners, removeEventListeners } from '../Engine/Util/EventListeners';

export function Game({ mqttHandler }) {
  const [ready, setReady] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const engine = useRef(null);
  const visible = { visibility: 'visible' };
  const hidden = { visibility: 'hidden' };

  React.useEffect(() => {
    const canvas = document.getElementById("gameCanvas");
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    engine.current = new Engine(canvas, width, height, setReady);

    //mqttHandler.setMessageCallback(onMessage)
    const eventListeners = getEventListeners(engine.current);
    addEventListeners(eventListeners);

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
      removeEventListeners(eventListeners);
    });
  }, []);

  const startGameLoop = () => {
    setShowGame(true);
    engine.current.loop(performance.now());
  }

  const onMessage = (message, topic) => {
    // do stufs
    console.log(message);
  }

  return (
    <div>
      <button style={ready && !showGame ? visible : hidden} onClick={startGameLoop}>start</button>
      <canvas id="gameCanvas" style={showGame ? visible : hidden} />
    </div>
  );

}

export default Game;