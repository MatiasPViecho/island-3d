import * as THREE from "three";
import Experience from "../Experience";

export default class Environment {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("environment");
    }
    //this.setSunLight();
    //this.setAmbientLight();
  }
  setAmbientLight() {
    this.light = new THREE.AmbientLight(0xffffff, 1.0);
    this.scene.add(this.light);
  }
  // setSunLight() {
  //   this.sunLight = new THREE.DirectionalLight("#ffffff", 4);
  //   this.sunLight.castShadow = true;
  //   this.sunLight.shadow.camera.far = 15;
  //   this.sunLight.shadow.mapSize.set(1024, 1024);
  //   this.sunLight.shadow.normalBias = 0.05;
  //   this.sunLight.position.set(3.5, 2, -1.25);
  //   this.scene.add(this.sunLight);

  //   if (this.debug.active) {
  //     this.debugFolder
  //       .add(this.sunLight, "intensity")
  //       .name("sunLightIntensity")
  //       .min(0)
  //       .max(4)
  //       .step(0.001);
  //     this.debugFolder
  //       .add(this.sunLight.position, "x")
  //       .name("sunX")
  //       .min(-5)
  //       .max(5)
  //       .step(0.001);
  //     this.debugFolder
  //       .add(this.sunLight.position, "y")
  //       .name("sunY")
  //       .min(-5)
  //       .max(5)
  //       .step(0.001);
  //   }
  // }
}
