import * as THREE from "three";
import Experience from "../Experience";
export default class Island {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;
    // debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("island");
    }

    //  setup
    this.resource = this.resources.items.islandModel;
    this.textureResource = this.resources.items.bakedIsland;

    this.setTexture();
    this.setModel();
    //this.setAnimation();
    //debug
  }
  setTexture() {
    this.textureResource.flipY = false;
    this.textureResource.colorSpace = THREE.SRGBColorSpace;
    this.texture = new THREE.MeshBasicMaterial({ map: this.textureResource });
  }
  setModel() {
    this.resource.scene.traverse((child) => {
      child.material = this.texture;
    });
    this.resource.scene.position.y = -0.1;
    this.model = this.resource.scene;
    //this.model.scale.set(0.02, 0.02, 0.02);
    this.scene.add(this.model);
  }
}
