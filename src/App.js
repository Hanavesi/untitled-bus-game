import './App.css';
import React from 'react';
import Menu from './Components/Menu';
import {useMousePosition} from './Components/useMousePosition';


function App() {
  // const position = useMousePosition();

  return (
    <div>
      <Menu/>
    </div>
  );
}

export default App;
