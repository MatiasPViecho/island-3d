import Experience from "../Experience";
import Environment from "./Environment";
import Island from "./Island";
import Water from "./Water";
import Bottle from "./Bottle";
import Seagull from "./Seagull";
import Soundtrack from "../Utils/Soundtrack";
export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.generalVolume = 0.5;
    //wait for resources
    this.resources.on("ready", () => {
      this.island = new Island();
      this.water = new Water();
      this.bottle = new Bottle();
      this.seagull = new Seagull(7);
      this.environment = new Environment();
      this.soundtrack = new Soundtrack();
      this.seagull.addAudio(this.resources.items.seagullAudio);
      this.water.addAudio(this.resources.items.waterAudio);
      this.soundtrack.addSoundtrack(this.resources.items.kalimbaAudio);
    });
    this.generalVolumeSettings();
  }

  update() {
    if (this.water) {
      this.water.update();
    }
    if (this.seagull) {
      this.seagull.update();
    }
  }

  showcase(e) {
    if (this.seagull) this.seagull.showcase(e);
    if (this.water) this.water.showcase(e);
  }

  allowSounds() {
    this.seagull.allowSounds();
    this.water.allowSounds();
    this.soundtrack.allowSounds();
  }
  updateVolume(e) {
    this.generalVolume = e;
    this.water.updateGeneralVolume(e);
    this.seagull.updateGeneralVolume(e);
  }
  generalVolumeSettings() {
    this.experience.debug.settingsMenu
      .add(this, "generalVolume")
      .min(0)
      .max(1)
      .step(0.01)
      .name("General Volume")
      .onChange((e) => this.updateVolume(e));
  }
}
