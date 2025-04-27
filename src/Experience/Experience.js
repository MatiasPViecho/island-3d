import * as THREE from "three";
import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";
import Camera from "./Camera";
import Renderer from "./Renderer";
import World from "./World/World";
import Resources from "./Utils/Resources";
import sources from "./sources";
import Debug from "./Utils/Debug";
import Mouse from "./Utils/Mouse";
import Raycaster from "./Utils/Raycaster";
import Showcase from "./Utils/Showcase";
import TextUtil from "./Utils/TextUtil";
let instance = null;
export default class Experience {
  constructor(canvas) {
    // Singleton Pattern
    if (instance) {
      return instance;
    }
    instance = this;

    //global access
    window.experience = this;

    // Properties
    this.canvas = canvas;
    this.debug = new Debug();
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.resources = new Resources(sources);
    this.camera = new Camera(this);
    this.world = new World();
    this.renderer = new Renderer();
    this.mouse = new Mouse();
    this.raycaster = new Raycaster();
    this.showcase = new Showcase();
    this.userInteracted = false;
    /**
     * Events
     */

    // Time Tick event
    this.time.on("tick", () => {
      this.update();
    });

    // Sizes resize event
    this.sizes.on("resize", () => {
      this.resize();
    });

    this.mouse.on("mousemove", () => {
      this.mousemove();
    });

    this.showcase.on("showcase", (e) => {
      this.renderer.manageOutline(e);
      this.raycaster.managePointer(!e);
      this.world.showcase(e);
    });

    this.setBaseUserInteractions();
  }
  allowSounds() {
    this.world.allowSounds();
  }
  setBaseUserInteractions() {
    window.addEventListener("click", () => {
      this.allowSounds();
      this.markUserInteracted;
    });
    window.addEventListener("keydown", () => {
      this.allowSounds();
      this.markUserInteracted;
    });
    window.addEventListener("mousedown", () => {
      this.allowSounds();
      this.markUserInteracted;
    });
    window.addEventListener("touchstart", () => {
      this.allowSounds();
      this.markUserInteracted;
    });
  }
  markUserInteracted() {
    window.removeEventListener("click", this.markUserInteracted);
    window.removeEventListener("keydown", this.markUserInteracted);
    window.removeEventListener("mousedown", this.markUserInteracted);
    window.removeEventListener("touchstart", this.markUserInteracted);
  }

  mousemove() {
    this.raycaster.mousemove();
  }
  resize() {
    this.camera.resize();
    this.renderer.resize();
  }
  update() {
    //this.camera.update();
    this.world.update();
    this.renderer.update();
    this.showcase.update();
  }
  destroy() {
    this.sizes.off("resize");
    this.time.off("tick");

    // Check whole scene
    this.scene.traverse((child) => {
      // child is mesh
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();

        // loop material properties
        for (const key in child.material) {
          const value = child.material[key];

          // test if can be disposed
          if (value && typeof value.dispose == "function") {
            value.dipose();
          }
        }
      }
    });

    this.camera.controls.dispose();
    this.renderer.instance.dispose();
    // IF using post-processing (effectComposer, webGLRenderTarget...) needs to dispose those
  }
}
