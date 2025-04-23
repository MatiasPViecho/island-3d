import { DoubleSide, Mesh, PlaneGeometry, ShaderMaterial } from "three";
import Experience from "../Experience";
export default class DarkLayer {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.camera = this.experience.camera.instance;
  }
  setMesh() {
    this.mesh = new Mesh(
      new PlaneGeometry(2, 2),
      new ShaderMaterial({
        fragmentShader: `void main(){gl_FragColor = vec4(0.0, 0.0, 0.0, 0.4);}`,
        side: DoubleSide,
        transparent: true,
      })
    );
  }
  destroy() {
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.scene.remove(this.mesh);
    this.mesh = null;
  }

  apply() {
    if (!this.mesh) this.setMesh();
    this.mesh.position.copy(this.camera.position);
    this.mesh.position.z -= 1;
    this.scene.add(this.mesh);
  }
}
