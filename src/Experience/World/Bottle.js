import * as THREE from "three";
import Experience from "../Experience";
import bottleVertexShader from "../../shaders/bottle/vertex.glsl";
import bottleFragmentShader from "../../shaders/bottle/fragment.glsl";
export default class Bottle {
  constructor() {
    this.paper_name = "Plane002";
    this.glass_name = "Plane002_1";
    this.cork_name = "Plane002_2";
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;
    // debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("bottle");
    }

    //  setup
    this.resource = this.resources.items.bottleModel;
    this.paperBakedTexture = this.resources.items.bakedPaper;
    this.bottleBakedTexture = this.resources.items.bakedBottle;
    this.setBottleTexture();
    this.setPaperTexture();
    this.setModel();
    this.addToOultine();
    //this.setAnimation();
    //debug
  }
  setBottleTexture() {
    this.bottleBakedTexture.flipY = false;
    this.bottleBakedTexture.colorSpace = THREE.SRGBColorSpace;
    this.bakedBottleUniforms = {
      map: { value: this.bottleBakedTexture },
      uTime: { value: 0 },
      uShowcaseBrightness: {
        value: null,
      },
    };
    this.bottleTexture = new THREE.ShaderMaterial({
      uniforms: this.bakedBottleUniforms,
      vertexShader: bottleVertexShader,
      fragmentShader: bottleFragmentShader,
    });
  }
  setPaperTexture() {
    this.paperBakedTexture.flipY = false;
    this.paperBakedTexture.colorSpace = THREE.SRGBColorSpace;
    this.paperTexture = new THREE.MeshBasicMaterial({
      map: this.paperBakedTexture,
    });
  }
  setModel() {
    this.resource.scene.traverse((child) => {
      if (child.name == this.paper_name) {
        child.material = this.paperTexture;
      } else if (
        child.name == this.glass_name ||
        child.name == this.cork_name
      ) {
        child.material = this.bottleTexture;
      }
    });
    this.model = this.resource.scene;
    this.model.position.x = 7;
    this.model.position.y = -0.1;
    this.model.rotation.y = -Math.PI / 4;
    this.model.rotation.x = -Math.PI / 8;
    this.model.scale.set(0.75, 0.75, 0.75);
    this.scene.add(this.model);
  }
  addToOultine() {
    this.experience.renderer.outlinePass.addElementOutline(this.model);
  }
}
