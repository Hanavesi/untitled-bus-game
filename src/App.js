import { fetchBusRoutes } from './Data/RouteData';
import './App.css';
import Game from './Game';
import TileMap from './Engine/TileMap'
import React from 'react';
import { Mqtt } from './Data/Mqtt';

function App() {

  return (
    <div>
      <Game width={800} height={500} />
    </div>
  );
}

export default App;
