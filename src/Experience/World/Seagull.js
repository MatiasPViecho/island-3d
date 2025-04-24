import { AnimationMixer } from "three";
import Experience from "../Experience";
// thanks to https://discourse.threejs.org/t/how-to-clone-a-model-thats-loaded-with-gltfloader/23723/9
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
export default class Seagull {
  constructor(amount) {
    this.seagull_speed = 5;
    this.seagulls = [];
    this.mixers = [];
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("seagull");
      this.debugFolder
        .add(this, "seagull_speed")
        .min(-10)
        .max(10)
        .step(0.01)
        .name("seagull speed");
    }
    this.resource = this.resources.items.seagullModel;
    this.instanciateModels(amount);
    // for (i = 0; i < amount; i++) {
    // }
  }
  instanciateModels(amount) {
    for (let i = 0; i < amount; i++) {
      const model = clone(this.resource.scene);
      this.mixers.push(new AnimationMixer(model));
      const action = this.mixers[i].clipAction(this.resource.animations[0]);
      const action2 = this.mixers[i].clipAction(this.resource.animations[1]);
      action.startAt(Math.abs(amount / 2 - i) * 0.05);
      action2.startAt(Math.abs(amount / 2 - i) * 0.05);
      action.play();
      action2.play();
      model.position.y = 10 + -Math.abs(amount / 2 - i) * 0.1;
      model.position.z = i - 20;
      model.position.x = -40 + -Math.abs(amount / 2 - i);
      model.rotation.y = Math.PI / 2;
      model.INITIAL_X_POS = -40 + -Math.abs(amount / 2 - i);
      model.scale.set(
        0.2 + Math.random() / 100,
        0.2 + Math.random() / 100,
        0.2 + Math.random() / 100
      );
      this.seagulls.push(model);
      this.scene.add(model);
    }
    console.log(this.seagulls);
    console.log(this.scene);
  }
  update() {
    if (this.mixers) {
      this.mixers.forEach((mixer) => {
        mixer.update(this.time.clock.deltaTime);
      });
    }
    this.seagulls.forEach((seagull) => {
      seagull.rotation.z =
        Math.sin(this.time.clock.deltaTime) * this.seagull_speed;
      seagull.position.x += this.time.clock.deltaTime * this.seagull_speed;
      if (seagull.position.x > 100) {
        seagull.position.x = seagull.INITIAL_X_POS;
      }
    });
  }
}
