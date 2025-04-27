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
  }

  addText(text) {
    this.textDiv.innerHTML = text;
    this.container.appendChild(this.textDiv);
    this.container.classList.remove("z-order");
    this.addOption();
  }

  addOption() {
    this.container.appendChild(this.textDiv);
    this.container.appendChild(this.optionsDiv);
    this.textDiv.classList.add("vt323-regular", "message");
    this.optionsDiv.classList.add("vt323-regular", "options");
    this.optionsDiv.innerHTML = "<button>Yes</button><button>No</button>";
  }

  removeText() {
    this.container.classList.add("z-order");
    this.textDiv.innerHTML = "";
    this.optionsDiv.innerHTML = "";
    this.container.removeChild(this.textDiv);
    this.container.removeChild(this.optionsDiv);
  }
}
