import * as THREE from "three";
import Experience from "../Experience";
import Environment from "./Environment";
import Island from "./Island";
import Water from "./Water";
import Bottle from "./Bottle";
export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    //wait for resources
    this.resources.on("ready", () => {
      //setup
      //this.floor = new Floor();
      this.island = new Island();
      this.water = new Water();
      this.bottle = new Bottle();
      this.environment = new Environment();
    });
  }

  update() {
    if (this.water) {
      this.water.update();
    }
  }
}
