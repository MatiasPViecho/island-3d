import Experience from "../Experience";

export default class Soundtrack {
  constructor() {
    this.experience = new Experience();
    this.soundtrack = [];
    this.baseVolume = 0.23;
    this.volume = this.baseVolume;
    this.addSettings();
    this.currentSoundtrack = -1;
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
      this.currentSoundtrack = pos;
      this.soundtrack[pos].volume = this.volume;
      this.soundtrack[pos].play();
    }
  }
  allowSounds() {
    this.startPlaying(0);
  }
  addSettings() {
    this.volumeMenu =
      this.experience.debug.settingsMenu.addFolder("Soundtrack");
    this.volumeMenu.add(this, "volume").min(0).max(1).step(0.01).name("Volume");
  }
}
