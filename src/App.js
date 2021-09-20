import { fetchBusRoutes } from './Data/RouteData';
import './App.css';
import Game from './Game';
import React from 'react';
import { Mqtt } from './Data/Mqtt';

function App() {

  return (
    <Game width={800} height={500} />
  );
}

export default App;
