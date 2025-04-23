import EventEmitter from "./EventEmitter";
import { Vector2 } from "three";
export default class Sizes extends EventEmitter {
  constructor() {
    super();
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.resolution = new Vector2(this.width, this.height);
    window.addEventListener("resize", () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.pixelRatio = Math.min(window.devicePixelRatio, 2);
      this.resolution.set(this.width, this.height);
      this.trigger("resize");
    });
  }
}
