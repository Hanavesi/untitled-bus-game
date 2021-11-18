export const addEventListeners = (eventListeners) => {
  for (const e of eventListeners) {
    window.addEventListener(e[0], e[1]);
  }
}

export const getEventListeners = (engine) => {
  const eventListeners = [];

  eventListeners.push(
    [
      'resize',
      () => {
        const canvas = document.getElementById("gameCanvas");
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

export const removeEventListeners = (eventListeners) => {
  for (const e of eventListeners) {
    window.removeEventListener(e[0], e[1]);
  }
}