import * as THREE from "three";
import Experience from "../Experience";
import waterVertexShader from "../../shaders/water/vertex.glsl";
import waterFragmentShader from "../../shaders/water/fragment.glsl";
export default class Water {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.time = this.experience.time;
    this.debug = this.experience.debug;
    this.shouldStopAnimation = false;
    this.missingTime = 0;
    /**
     * Debug
     */
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("water");
    }

    /**
     * Setup
     */
    this.setMaterial();
    this.setGeometry();
    this.setMesh();
    //this.setAnimation();
    //debug
  }
  setMaterial() {
    this.waterDepthColor = new THREE.Color(0x1578a1);
    this.surfaceColor = new THREE.Color(0x05587f);
    this.waterMaterial = new THREE.ShaderMaterial({
      vertexShader: waterVertexShader,
      fragmentShader: waterFragmentShader,
      uniforms: {
        uTime: { value: 0 },

        uBigWavesElevation: { value: 0.237 },
        uBigWavesFrequency: { value: new THREE.Vector2(0.51, 0.51) },
        uBigWavesSpeed: { value: 1.844 },

        uSmallWavesElevation: { value: 0.051 },
        uSmallWavesFrequency: { value: 22.413 },
        uSmallWavesSpeed: { value: 0.885 },
        uSmallIterations: { value: 1 },

        uDepthColor: { value: this.waterDepthColor },
        uSurfaceColor: { value: this.surfaceColor },
        uColorOffset: { value: 0.739 },
        uColorMultiplier: { value: 4.996 },
      },
    });
  }
  setGeometry() {
    this.waterGeometry = new THREE.PlaneGeometry(200, 200, 1024, 1024);
    this.waterGeometry.deleteAttribute("normal");
    this.waterGeometry.deleteAttribute("uv");
  }
  setMesh() {
    this.mesh = new THREE.Mesh(this.waterGeometry, this.waterMaterial);
    this.mesh.rotation.set(-Math.PI * 0.5, 0, 0);
    this.mesh.position.set(0, 0.16, 0);
    this.scene.add(this.mesh);
  }

  update() {
    if (!this.shouldStopAnimation) {
      this.waterMaterial.uniforms.uTime.value =
        this.time.clock.elapedTime + this.missingTime;
    } else {
      this.missingTime =
        this.waterMaterial.uniforms.uTime.value - this.time.clock.elapedTime;
    }
  }

  showcase(e) {
    this.shouldStopAnimation = e;
  }

  addAudio(audio) {
    try {
      this.audio = audio;
    } catch (e) {
      console.error(e);
    }
  }
}
