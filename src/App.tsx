import React, { ReactElement } from 'react';
import './App.css';
import Game from './Game';

function App(): ReactElement {

  document.addEventListener('keydown', keyDownHandler, false);
  document.addEventListener('keyup', keyUpHandler, false);

  const KeyboardHelper = { w: 87, a: 65, s: 83, d: 68 };

  let wPressed = false;
  let aPressed = false;
  let sPressed = false;
  let dPressed = false;

  function keyDownHandler(event: { keyCode: number; }) {
    if (event.keyCode == KeyboardHelper.w) {
      wPressed = true;
    }
    else if (event.keyCode == KeyboardHelper.a) {
      aPressed = true;
    }
    if (event.keyCode == KeyboardHelper.s) {
      sPressed = true;
    }
    else if (event.keyCode == KeyboardHelper.d) {
      dPressed = true;
    }
  }
  

  function keyUpHandler(event: { keyCode: number; }) {
    if (event.keyCode == KeyboardHelper.w) {
      wPressed = false;
    }
    else if (event.keyCode == KeyboardHelper.a) {
      aPressed = false;
    }
    if (event.keyCode == KeyboardHelper.s) {
      sPressed = false;
    }
    else if (event.keyCode == KeyboardHelper.d) {
      dPressed = false;
    }
  }

  function isPressed() {
    if (wPressed) {
      console.log('You pressed W');
    }
    else if (aPressed) {
      console.log('You pressed A');
    }
    if (sPressed) {
      console.log('You pressed S');
    }
    else if (dPressed) {
      console.log('You pressed D');
    }
  }

  return (
    <div>
      <div>
        <Game width={1000} height={500} />
      </div>
      <div>
        <input onChange={isPressed}></input>
      </div>
    </div>
  );
}

export default App;