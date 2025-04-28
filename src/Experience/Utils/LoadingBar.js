import { LoadingManager } from "three";
import gsap from "gsap";
import EventEmitter from "./EventEmitter";
export default class LoadingBar extends EventEmitter {
  constructor() {
    super();
    this.loadingBarDOM = document.querySelector(".loading-bar");
    this.loadingManager = new LoadingManager(
      // loaded
      () => {
        gsap.delayedCall(0.5, () => {
          this.loadingBarDOM.classList.add("ended");
          this.loadingBarDOM.style.transform = ``;
          this.trigger("finished");
        });
      },
      // Progress
      (itemUrl, itemsLoaded, itemsTotal) => {
        console.log(itemUrl, itemsLoaded, itemsTotal);
        const progressRatio = itemsLoaded / itemsTotal;
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
    this.body = document.querySelector("body");
    this.body.removeChild(this.loadingBarDOM);
  }
}
