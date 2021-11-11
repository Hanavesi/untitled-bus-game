import React from 'react'
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { MemoizedGame } from './Game';
import Credits from './Credits';
import BusMap from '../Data/BusMap';
import MenuList from './MenuList';
import HowToPlay from './HowToPlay'

export default function Menu() {
  return (

    <Router>
      <Switch>
        <Route exact path="/" render={MenuList} />
        <Route path="/Game" component={MemoizedGame} />
        <Route path="/Map" component={BusMap} />
        <Route path="/instructions" component={HowToPlay} />
        <Route path="/Credits" component={Credits} />
        <Route path="*" render={() => <h2>Error! Page not  found!</h2>} />
      </Switch>
    </Router>
  );
}

ReactDOM.render(<Menu />, document.getElementById("root"));

