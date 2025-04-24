import Experience from "../Experience";
import { AmbientLight } from "three";

export default class Environment {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("environment");
    }
    this.addLight();
    this.addEnvMap();
  }

  addLight() {
    this.scene.add(new AmbientLight(0xffffff, 1.7));
  }

  addEnvMap() {
    this.scene.background = this.resources.items.pureskyEnvmap;
    this.scene.environment = this.resources.items.pureskyEnvmap;
    this.scene.backgroundIntensity = 0.33;
    this.scene.background.offset.y = 0.05;
  }
}
