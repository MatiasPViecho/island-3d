import Experience from "../Experience";
import DitherVertexShader from "../../shaders/dither/vertex.glsl";
import DitherFragmentShader from "../../shaders/dither/fragment.glsl";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { Uniform } from "three";
export default class DitherPass {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.setBaseShader();
    this.setPass();
  }
  setBaseShader() {
    this.shader = {
      uniforms: {
        uResolution: new Uniform(this.sizes.resolution),
        uColorNum: new Uniform(32.0),
        uPixelSize: new Uniform(2.0),
        tDiffuse: new Uniform(null),
      },
      vertexShader: `${DitherVertexShader}`,
      fragmentShader: `${DitherFragmentShader}`,
    };
  }
  setPass() {
    this.shaderPass = new ShaderPass(this.shader);
  }

  resize() {
    console.log("resizing dither pass");
    this.shaderPass.uniforms.uResolution.value = this.sizes.resolution;
    console.log(
      this.shader.uniforms.uResolution.value.x,
      this.shader.uniforms.uResolution.value.y
    );
  }
}
