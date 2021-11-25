import { Howl, Howler } from 'howler';

export class SoundController {
  contructor() {
    this.sounds = {};
  }

  setVolume(vol) {
    Howler.volume(vol);
  }

  registerSound(src, loop = false, volume = 1) {
    const howl = new Howl({
      src: src,
      loop: loop,
      volume: volume
    });
    const parts = src.split('/');
    const name = parts[parts.length - 1].split('.')[0];
    this.sounds = {
      ...this.sounds,
      [name]: howl
    }
  }

  playSound(name) {
    if (this.sounds[name] !== undefined) {
      this.sounds[name].play();
    }
  }

  stopSound(name) {
    if (this.sounds[name] !== undefined) {
      this.sounds[name].stop();
    }
  }

  stop() {
    Howler.stop();
  }
}