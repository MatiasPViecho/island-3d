import { Clock as THREEClock } from "three";
let instance = null;
export default class Clock {
  constructor() {
    if (instance) {
      return instance;
    }
    instance = this;
    this.clock = new THREEClock();
    this.previousTime = 0;
  }
  update() {
    this.elapedTime = this.clock.getElapsedTime();
    this.deltaTime = this.elapedTime - this.previousTime;
    this.previousTime = this.elapedTime;
  }
}
