import React, { useEffect, useRef, useState } from 'react';
import { Engine } from '../Engine/Engine';
import { getEventListeners, addEventListeners, removeEventListeners } from '../Engine/Util/EventListeners';
import BusMap from '../Data/BusMap';
import YouWon from '../Screens/YouWon';
import GameOver from '../Screens/GameOver';
import Info from './Info';
import GameStats from './GameStats';



export function Game({ mqttHandler }) {
  const [ready, setReady] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const engine = useRef(null);
  const visible = { visibility: 'visible' };
  const hidden = { visibility: 'hidden' };
  const [gameStatus, setGameStatus] = useState('ingame');

  useEffect(() => {
    const canvas = document.getElementById("gameCanvas");
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const scoreElem = document.getElementById("score");
    engine.current = new Engine(canvas, scoreElem, width, height, setReady);
    const eventListeners = getEventListeners(engine.current);
    addEventListeners(eventListeners);

    return (() => {
      mqttHandler.disconnect();
      removeEventListeners(eventListeners);
      engine.current.sounds.stop();
      engine.current.running = false;
    });
  }, []);

  const startGameLoop = () => {
    setShowGame(true);
    engine.current.enterBus();
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
      mqttHandler.unsubscribeAll();
      mqttHandler.disconnect();
      setGameStatus('won')
    }
  }

  if (gameStatus === 'won') {
    return (
      <YouWon />
    )
  }

  if (gameStatus === 'lost') {
    return (
      <GameOver />
    )
  }

  return (
    <div id="gameContainer">
      {
        showGame ?
          null
          :
          <Info />
      }
      <canvas id="gameCanvas" style={showGame ? visible : hidden} />
      <GameStats style={showGame ? visible : hidden} />
      {
        ready ?
          <div>
            <BusMap
              mqttHandler={mqttHandler}
              gameMessageHandler={onMessage}
              initGame={startGameLoop}
            />
          </div>
          : null
      }
    </div>
  );





}

export default Game;
