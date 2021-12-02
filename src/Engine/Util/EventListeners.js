
/**
 * Registers the list of event listeners to window.
 * Expects list to contain sublists where first element is
 * event type and second element is callback function.
 * @param {[string, (() => void)[]]} eventListeners 
 */
export const addEventListeners = (eventListeners) => {
  for (const e of eventListeners) {
    window.addEventListener(e[0], e[1]);
  }
}

/**
 * Creates the event listeners used with the game engine so they can be 
 * registered and removed easily.
 * @param {Engine} engine 
 * @returns list of event listeners used in the game loop.
 */
export const getEventListeners = (engine) => {
  const eventListeners = [];

  eventListeners.push(
    [
      'resize',
      () => {
        const canvas = document.getElementById("gameCanvas");
        if (!canvas) return;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        engine.onWindowResize(width, height);
      }
    ]
  );

  eventListeners.push(
    [
      'mousemove',
      (e) => {
        const pos = { x: (e.clientX / window.innerWidth) * 2 - 1, y: -(e.clientY / window.innerHeight) * 2 + 1 };
        engine.setMousePos(pos);
      }
    ]
  );

  eventListeners.push(
    [
      'mousedown',
      () => {
        engine.inputManager.setKeyFromKeyCode(1, true);
      }
    ]
  );

  eventListeners.push(
    [
      'mouseup',
      () => {
        engine.inputManager.setKeyFromKeyCode(1, false);
      }
    ]
  );

  eventListeners.push(
    [
      'keydown',
      (e) => {
        engine.inputManager.setKeyFromKeyCode(e.keyCode, true);
      }
    ]
  );

  eventListeners.push(
    [
      'keyup',
      (e) => {
        engine.inputManager.setKeyFromKeyCode(e.keyCode, false);
      }
    ]
  );

  return eventListeners;
}

 /**
  * Removes the event listeners from use.
  * Expects list to contain sublists where first element is
  * event type and second element is callback function.
  * @param {[string, (() => void)[]]} eventListeners 
  */
export const removeEventListeners = (eventListeners) => {
  for (const e of eventListeners) {
    window.removeEventListener(e[0], e[1]);
  }
}