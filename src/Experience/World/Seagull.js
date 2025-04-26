import { AnimationMixer } from "three";
import Experience from "../Experience";
// thanks to https://discourse.threejs.org/t/how-to-clone-a-model-thats-loaded-with-gltfloader/23723/9
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
export default class Seagull {
  constructor(amount) {
    this.seagull_speed = 5;
    this.seagull_restart_pos = 100;
    this.seagulls = [];
    this.mixers = [];
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;
    this.shouldStopAnimation = false;
    this.playedDuringRound = false;
    this.canPlaySounds = false;

    // Debug audio
    this.divider = 2;
    this.sum = 0.2;

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("seagull");
      this.debugFolder
        .add(this, "divider")
        .min(-100)
        .max(100)
        .step(1)
        .name("audio div");
      this.debugFolder
        .add(this, "sum")
        .min(-1)
        .max(1)
        .step(0.01)
        .name("audio sum");
      this.debugFolder
        .add(this, "seagull_speed")
        .min(-10)
        .max(10)
        .step(0.01)
        .name("Speed");
      this.debugFolder
        .add(this, "seagull_restart_pos")
        .min(-25)
        .max(100)
        .step(0.1)
        .name("restart POS");
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
  }
  update() {
    if (this.mixers && !this.shouldStopAnimation) {
      this.mixers.forEach((mixer) => {
        mixer.update(this.time.clock.deltaTime);
      });
    }
    this.seagulls.forEach((seagull) => {
      seagull.rotation.z =
        Math.sin(this.time.clock.deltaTime) * this.seagull_speed;
      if (!this.shouldStopAnimation) {
        seagull.position.x += this.time.clock.deltaTime * this.seagull_speed;
      }
      if (seagull.position.x > this.seagull_restart_pos) {
        seagull.position.x = seagull.INITIAL_X_POS;
        if (this.playedDuringRound) this.playedDuringRound = false;
      }
    });
    if (
      this.canPlaySounds &&
      Math.abs(this.seagulls[0].position.x / 4) <
        this.experience.camera.instance.position.x
    ) {
      let calculatedVolume =
        0.2 -
        Math.abs(this.seagulls[0].position.x / 8) / this.divider +
        this.sum;
      this.audio.volume = Math.min(1, Math.max(0, calculatedVolume));
      if (this.audio.volume > 0 && !this.playedDuringRound) {
        this.audio.play();
        this.playedDuringRound = true;
      }
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

  allowSounds() {
    this.canPlaySounds = true;
  }
}
