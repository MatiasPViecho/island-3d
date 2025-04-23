import Experience from "../Experience";
import { Vector2 } from "three";
import EventEmitter from "./EventEmitter";

export default class Mouse extends EventEmitter {
  constructor() {
    super();
    this.experience = new Experience();
    this.mouse = new Vector2();
    window.addEventListener("mousemove", (e) => {
      this.mouse.x = (e.clientX / this.experience.sizes.width) * 2 - 1;
      this.mouse.y = -(e.clientY / this.experience.sizes.height) * 2 + 1;
      this.trigger("mousemove");
    });
  }
}
