import { Howl, Howler } from 'howler';

export class SoundController {
  constructor() {
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
      [name]: {
        howl: howl,
        baseVol: volume
      }
    }
  }

  playSound(name) {
    if (this.sounds[name] !== undefined) {
      this.sounds[name].howl.play();
    }
  }

  focus(focus) {
    for (const name of Object.keys(this.sounds)) {
      if (name === focus) continue;
      const sound = this.sounds[name];
      sound.howl.volume(0.01);
    }
  }

  unfocus() {
    for (const name of Object.keys(this.sounds)) {
      const sound = this.sounds[name];
      sound.howl.volume(sound.baseVol);
    }
  }

  isPlaying(name) {
    if (this.sounds[name] !== undefined) {
      return this.sounds[name].howl.playing();
    }
    return false;
  }

  stopSound(name) {
    if (this.sounds[name] !== undefined) {
      this.sounds[name].howl.stop();
    }
  }

  stop() {
    Howler.stop();
  }
}