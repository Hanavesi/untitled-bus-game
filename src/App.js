import { fetchBusRoutes } from './Data/RouteData';
import './App.css';
import Game from './Game';
import React from 'react';
import mqttConnection from './Data/Mqtt';

function App() {

  mqttConnection();

  const fetchData = async () => {
    const data = await fetchBusRoutes();
    console.log('bus route data', data);
  }
  React.useEffect(() => {
    fetchData();
  }, []);
  return (
    <Game width={800} height={500} />
  );
}

export default App;
