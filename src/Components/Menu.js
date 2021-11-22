import React from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Game from './Game';
import Credits from './Credits';
import BusMap from '../Data/BusMap';
import MenuList from './MenuList';
import HowToPlay from './HowToPlay'
import GameOver from '../Screens/GameOver';
import YouWon from '../Screens/YouWon';
import { MqttHandler } from '../Data/Mqtt';

export default function Menu() {
  const mqttHandler = new MqttHandler();

  return (

    <Router>
      <Switch>
        <Route exact path="/" render={MenuList} />
        <Route path="/Game" render={(props) => <Game {...props} mqttHandler={mqttHandler} />} />
        <Route path="/instructions" component={HowToPlay} />
        <Route path="/Credits" component={Credits} />
        <Route path="/Gameover" component={GameOver} />
        <Route path="/Gamewon" component={YouWon} />
        <Route path="*" render={() => <h2>Error! Page not  found!</h2>} />
      </Switch>
    </Router>
  );
}