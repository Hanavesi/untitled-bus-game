import React, { ReactElement, useEffect } from 'react';
import './App.css';
import * as TSE from './include/TSE/Engine';

function App(): ReactElement {
  const engine = new TSE.Engine();

  useEffect(()=> {
    engine.start();
    window.onresize = function() {
      engine.resize();
    }
  }, []);
  
  return (
    <div id="container">
      
    </div>
  );
}

export default App;