import GUI from "lil-gui";
export default class Debug {
  constructor() {
    this.active = window.location.hash == "#debug";
    this.ui = new GUI();
    this.settingsMenu = this.ui.addFolder("Sounds");
    this.ui.close();
  }
}
