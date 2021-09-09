import React, { ReactElement } from 'react';
import './App.css';
import Game from './Game';

function App(): ReactElement {
  return (
    <div>
      <Game width={400} height={800}/>
    </div>
  );
}

export default App;