import { LoadingManager } from "three";
import gsap from "gsap";
import EventEmitter from "./EventEmitter";
export default class LoadingBar extends EventEmitter {
  constructor() {
    super();
    this.loadingBarDOM = document.querySelector(".loading-bar");
    this.body = document.querySelector("body");
    this.container = document.querySelector(".loading-bar-container");
    this.percentageDOM = document.querySelector("#percentage");
    this.loadingManager = new LoadingManager(
      // loaded
      () => {
        gsap.delayedCall(0.5, () => {
          this.loadingBarDOM.classList.add("ended");
          this.container.classList.add("ended");
          this.loadingBarDOM.style.transform = ``;
          this.trigger("finished");
        });
      },
      // Progress
      (itemUrl, itemsLoaded, itemsTotal) => {
        const progressRatio = itemsLoaded / itemsTotal;
        percentage.innerHTML = `${progressRatio * 100}%`;
        this.loadingBarDOM.style.transform = `scaleX(${progressRatio})`;
      },
      // Error
      (e) => {
        console.error(e);
      }
    );
  }

  getLoadingManager() {
    return this.loadingManager;
  }

  fadeInCompleted() {
    this.container.removeChild(this.loadingBarDOM);
    this.body.removeChild(this.container);
  }
}
