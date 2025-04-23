import Experience from "../Experience";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutlinePass as THREEOutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";

export default class OutlinePass {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.options = {
      edgeStrength: 4.5,
      edgeGlow: 0.2,
      pulsePeriod: 4,
      visibleEdgeColor: "#ffffff",
      hiddenEdgeColor: "#000000",
    };
    this.objects = [];
    this.setBaseShader();
    this.setPass();
  }
  setBaseShader() {
    this.shader = new THREEOutlinePass(
      this.sizes,
      this.experience.scene,
      this.experience.camera.instance,
      this.objects
    );
    this.shader.edgeStrength = this.options.edgeStrength;
    this.shader.edgeGlow = this.options.edgeGlow;
    this.shader.pulsePeriod = this.options.pulsePeriod;
    this.shader.visibleEdgeColor.set(this.options.visibleEdgeColor);
    this.shader.hiddenEdgeColor.set(this.options.hiddenEdgeColor);
  }
  setPass() {
    this.shaderPass = this.shader;
  }

  addElementOutline(elem) {
    this.objects.push(elem);
  }
  removeAllElements() {
    this.objects = [];
  }
  disable() {
    this.shaderPass.enabled = false;
  }
  enable() {
    this.shaderPass.enabled = true;
  }
}
