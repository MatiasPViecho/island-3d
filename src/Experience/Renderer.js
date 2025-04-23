import Experience from "./Experience";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import DitherPass from "./Passes/DitherPass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import OutlinePass from "./Passes/OutlinePass";

export default class Renderer {
  constructor() {
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.setInstance();
    this.ditherPass = new DitherPass();
    this.outlinePass = new OutlinePass();
    this.addPass(this.ditherPass.shaderPass);
    this.addPass(this.outlinePass.shaderPass);
  }
  setInstance() {
    this.base = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.renderTarget = new THREE.WebGLRenderTarget(480, 320, {
      samples: this.base.getPixelRatio() === 1 ? 2 : 0,
    });
    this.base.setClearColor("#211d20");
    this.base.setSize(this.sizes.width, this.sizes.height);
    this.base.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
    this.instance = new EffectComposer(this.base, this.renderTarget);
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
    this.renderPass = new RenderPass(this.scene, this.camera.instance);
    this.instance.addPass(this.renderPass);
  }

  addPass(pass) {
    try {
      this.instance.addPass(pass);
    } catch (e) {
      console.error(e);
    }
  }
  resize() {
    this.base.setSize(this.sizes.width, this.sizes.height);
    this.base.setPixelRatio(this.sizes.pixelRatio);
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
    this.ditherPass.resize();
  }
  update() {
    this.instance.render(this.scene, this.camera.instance);
  }
}
