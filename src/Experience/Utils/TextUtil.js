import Experience from "../Experience";
import EventEmitter from "./EventEmitter";

export default class TextUtil extends EventEmitter {
  constructor() {
    super();
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.container = document.createElement("div");
    this.textDiv = document.createElement("div");
    this.body = document.querySelector("body");
    this.body.appendChild(this.container);
    this.container.classList.add("container", "z-order");
    this.optionsDiv = document.createElement("div");
    this.yesButton = document.createElement("button");
    this.yesButton.innerHTML = "Yes";
    this.currentEffect = null;
  }

  addText(text, effect) {
    this.textDiv.innerHTML = text;
    this.container.appendChild(this.textDiv);
    this.container.classList.remove("z-order");
    this.addOption(effect);
  }

  addOption(effect) {
    this.container.appendChild(this.textDiv);
    this.container.appendChild(this.optionsDiv);
    this.textDiv.classList.add("vt323-regular", "message");
    this.optionsDiv.classList.add("vt323-regular", "options");
    this.currentEffect = effect;
    this.yesButton.addEventListener("click", effect);
    this.optionsDiv.appendChild(this.yesButton);
    this.noButton = document.createElement("button");
    this.noButton.innerHTML = "No";

    this.optionsDiv.appendChild(this.noButton);
  }

  removeText() {
    this.container.classList.add("z-order");
    this.textDiv.innerHTML = "";
    this.optionsDiv.innerHTML = "";
    this.yesButton.removeEventListener("click", this.currentEffect);
    this.currentEffect = null;
    this.container.removeChild(this.textDiv);
    this.container.removeChild(this.optionsDiv);
  }
}
