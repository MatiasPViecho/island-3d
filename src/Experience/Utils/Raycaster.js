import Experience from "../Experience";
import { Raycaster as THREERaycaster } from "three";
export default class Raycaster {
  constructor() {
    this.experience = new Experience();
    this.camera = this.experience.camera;
    this.mouse = this.experience.mouse;
    this.world = this.experience.world;
    this.raycaster = new THREERaycaster();
  }
  mousemove() {
    this.raycaster.setFromCamera(this.mouse.mouse, this.camera.instance);
    this.checkIntersects();
  }
  checkIntersects() {
    if (this.world && this.world.bottle) {
      this.intersects = this.raycaster.intersectObject(this.world.bottle.model);
      if (this.intersects.length) {
        this.experience.canvas.classList.add("pointer");
        this.currentIntersect = this.intersects[0];
      } else {
        this.experience.canvas.classList.remove("pointer");
        this.currentIntersect = null;
      }
    }
  }
}
