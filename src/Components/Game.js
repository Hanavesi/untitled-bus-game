import React, { useEffect, useRef, useState } from 'react';
import { Engine } from '../Engine/Engine';
import { Howl, Howler } from 'howler'
import Running from '../Assets/music/run.mp3';
import { getEventListeners, addEventListeners, removeEventListeners } from '../Engine/Util/EventListeners';
import BusMap from '../Data/BusMap';

export function Game({ mqttHandler }) {
  const [ready, setReady] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const engine = useRef(null);
  const visible = { visibility: 'visible' };
  const hidden = { visibility: 'hidden' };
  const [level, setLevel] = useState(1)

  useEffect(() => {
    const canvas = document.getElementById("gameCanvas");
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    engine.current = new Engine(canvas, width, height, setReady);
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

  const onMessage = (message) => {
    // do stufs
    //console.log(message);
    const data = JSON.parse(message);
    const eventType = Object.keys(data)[0];
    // change room when bus arrives or leaves stop, or comes to endstop
    if (eventType === 'ARS') {
      console.log('bussi saapui pysäkille');
      // todo: function to switch to shop
      engine.current.enterShop();
    }
    else if (eventType === 'DEP') {
      console.log('bussi lähti pysäkiltä');
      engine.current.prepareNextStage();
      // todo: function to switch back to bus
      engine.current.enterBus();
    }
    else if (eventType === 'VJOUT') {
      console.log('bussi saapui PÄÄTTÄRILLE');
      // todo: wat do now
    }
  }

  return (
    <div id="gameContainer">
      <canvas id="gameCanvas" style={showGame ? visible : hidden} />
      {
        ready ?
          <BusMap
            mqttHandler={mqttHandler}
            gameMessageHandler={onMessage}
            initGame={startGameLoop}
          />
          : null
      }
    </div>
  );

}

export default Game;