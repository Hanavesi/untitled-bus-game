export class InputManager {
  constructor() {
    this.keys = {};
    this.keyMap = new Map();

    this.addKey(65, 'left');
    this.addKey(68, 'right');
    this.addKey(87, 'up');
    this.addKey(83, 'down');
    this.addKey(66, 'b');
    this.addKey(1, 'leftMouse');
  }

  setKey = (keyName, pressed) => {
    const keyState = this.keys[keyName];
    keyState.justPressed = pressed && !keyState.down;
    keyState.down = pressed;
  };

  addKey = (keyCode, name) => {
    this.keys[name] = { down: false, justPressed: false };
    this.keyMap.set(keyCode, name);
  };

  setKeyFromKeyCode = (keyCode, pressed) => {
    const keyName = this.keyMap.get(keyCode);
    if (!keyName) {
      return;
    }
    this.setKey(keyName, pressed);
  };

  update() {
    for (const keyState of Object.values(this.keys)) {
      if (keyState.justPressed) {
        keyState.justPressed = false;
      }
    }
  }
}