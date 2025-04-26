export default class Soundtrack {
  constructor() {
    this.soundtrack = [];
    this.baseVolume = 0.66;
    this.volume = this.baseVolume;
  }
  addSoundtrack(soundtrack) {
    try {
      this.soundtrack.push(soundtrack);
    } catch (e) {
      console.error(e);
    }
  }
  startPlaying(pos) {
    if (pos < this.soundtrack.length) {
      this.soundtrack[pos].volume = this.volume;
      this.soundtrack[pos].play();
    }
  }
  allowSounds() {
    this.startPlaying(0);
  }
}
