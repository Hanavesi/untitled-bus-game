import { fetchBusRoutes } from './Data/RouteData';
import './App.css';
import Game from './Game';
import React from 'react';
import { Mqtt } from './Data/Mqtt';
import BusList from './Data/BusList';
import BusMap from './Data/BusMap';

function App() {

  const fetchData = async () => {
    const data = await fetchBusRoutes();
    console.log('bus route data', data);
  }

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <BusMap />
    </div>
  );
}

export default App;
