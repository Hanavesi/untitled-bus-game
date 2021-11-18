export class InputManager {
  constructor() {
    // Object that holds key states
    this.keys = {};
    // Map for converting key codes to key names
    this.keyMap = new Map();

    this.addKey(65, 'left');
    this.addKey(68, 'right');
    this.addKey(87, 'up');
    this.addKey(83, 'down');
    this.addKey(66, 'b');
    this.addKey(1, 'leftMouse');
  }

  /**
   * Set key state based on key name.
   * @param {string} keyName 
   * @param {boolean} pressed 
   */
  setKey = (keyName, pressed) => {
    const keyState = this.keys[keyName];
    keyState.justPressed = pressed && !keyState.down;
    keyState.down = pressed;
  };

  /**
   * Add key to keymap and keys so
   * that state can be queried.
   * @param {number} keyCode 
   * @param {string} name 
   */
  addKey = (keyCode, name) => {
    this.keys[name] = { down: false, justPressed: false };
    this.keyMap.set(keyCode, name);
  };

  /**
   * Set key state based on key code.
   * @param {number} keyCode 
   * @param {boolean} pressed 
   * @returns 
   */
  setKeyFromKeyCode = (keyCode, pressed) => {
    const keyName = this.keyMap.get(keyCode);
    if (!keyName) {
      return;
    }
    this.setKey(keyName, pressed);
  };

  /**
   * Update key states from **justPressed=true** to **justPressed=false**
   */
  update() {
    for (const keyState of Object.values(this.keys)) {
      if (keyState.justPressed) {
        keyState.justPressed = false;
      }
    }
  }
}