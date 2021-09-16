import { fetchBusRoutes } from './Data/RouteData';
import './App.css';
import Game from './Game';
import React from 'react';
import { Mqtt } from './Data/Mqtt';

function App() {

  const mqtt = new Mqtt();


  const fetchData = async () => {
    const data = await fetchBusRoutes();
    console.log('bus route data', data);
  }
  React.useEffect(() => {
    mqtt.connect();
    mqtt.getBuses();
    fetchData();
  }, []);

  return (
    <Game width={800} height={500} />
  );
}

export default App;
