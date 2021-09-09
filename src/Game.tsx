import React, { ReactElement, useEffect } from 'react';
import './App.css';
import * as TSE from './include/TSE/Engine';

interface Props  {
    width: number;
    height: number;
}

function Game(props: Props): ReactElement<Props> {
  const engine = new TSE.Engine(props);

  useEffect(()=> {
    engine.Awake();
    window.onresize = function() {
      engine.resize();
    }
  }, []);
  
  return (
    <div id="container" style={{width:'500px', height: '500px'}}>
      
    </div>
  );
}

export default Game;