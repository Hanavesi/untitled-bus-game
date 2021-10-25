import { fetchBusRoutes } from './Data/RouteData';
import './App.css';
import Game from './Components/Game';
import TileMap from './Engine/TileMap'
import React from 'react';
import { Mqtt } from './Data/Mqtt';
import Menu from './Components/Menu';
import PlaySound from './Components/PlaySound';


function App() {

  return (
    <div>
      <Menu />
      <PlaySound  />
    </div>
  );
}

export default App;
