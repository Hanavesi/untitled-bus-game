import React from 'react'
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Game from './Game';
import Credits from './Credits';

export default function Menu() {


  const list = () => (
    <div>
      
      <Link className="text-link" to="/">
      <button>Menu</button>
      </Link>
      <br/>
      <Link className="text-link" to="/Game"> 
      <button>Game</button>
      </Link>{' '}
      <br/>
      <Link className="text-link" to="/Credits">
        <button>Credits</button>
      </Link>{''}
      
    </div>
  )


  return (
  
    <Router>
       
      
      <Switch>
        
      <Route exact path="/" render={() => <h2></h2>} />
      
      <Route path ="/Game" component={Game} />
      <Route path ="/Credits" component={Credits} />
      <Route path="*" render={() => <h2>Error! Page not  found!</h2>} />
        
      </Switch>
      {list()}
    </Router>
  );
}

ReactDOM.render(<Menu/>, document.getElementById("root"));

