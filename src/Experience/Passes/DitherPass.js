import Experience from "../Experience";
import DitherVertexShader from "../../shaders/dither/vertex.glsl";
import DitherFragmentShader from "../../shaders/dither/fragment.glsl";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { Uniform } from "three";
import gsap from "gsap";
export default class DitherPass {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.debug = this.experience.debug;
    this.uniformOptions = {
      pointLightViewDirectionX: 1.0,
      pointLightViewDirectionY: 1.0,
      pointLightViewDirectionZ: 1.0,
    };
    this.setBaseShader();
    this.setPass();
    // debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Dither");
      this.debugFolder
        .add(this.uniformOptions, "pointLightViewDirectionX")
        .min(-2.0)
        .max(2.0)
        .step(0.01)
        .name("X direction MULT");
      this.debugFolder
        .add(this.uniformOptions, "pointLightViewDirectionY")
        .min(-2.0)
        .max(2.0)
        .step(0.01)
        .name("Y direction MULT");
      this.debugFolder
        .add(this.uniformOptions, "pointLightViewDirectionZ")
        .min(-2.0)
        .max(2.0)
        .step(0.01)
        .name("Z direction MULT");
    }
  }
  setBaseShader() {
    this.shader = {
      uniforms: {
        uResolution: new Uniform(this.sizes.resolution),
        uColorNum: new Uniform(32.0),
        uPixelSize: new Uniform(2.0),
        tDiffuse: new Uniform(null),
        uFadeMultiplier: new Uniform(0.0),
        uAllowDither: new Uniform(0.0),
        pointLightViewDirectionX: new Uniform(
          this.uniformOptions.pointLightViewDirectionX
        ),
        pointLightViewDirectionY: new Uniform(
          this.uniformOptions.pointLightViewDirectionY
        ),
        pointLightViewDirectionZ: new Uniform(
          this.uniformOptions.pointLightViewDirectionZ
        ),
      },
      vertexShader: `${DitherVertexShader}`,
      fragmentShader: `${DitherFragmentShader}`,
    };
  }
  setPass() {
    this.shaderPass = new ShaderPass(this.shader);
  }

  resize() {
    this.shaderPass.uniforms.uResolution.value = this.sizes.resolution;
  }

  fadeIn() {
    gsap.to(this.shaderPass.uniforms.uFadeMultiplier, {
      value: 1,
      duration: 3,
      stagger: 0.1,
      onComplete: () => {
        this.experience.fadeInCompleted();
      },
    });
  }
}
