import Experience from "../Experience";
import DarkLayer from "../Layer/DarkLayer";
import gsap from "gsap";
const SHOWCASED_ROTATION_SPEED = 0.25;
export default class Showcase {
  constructor() {
    this.experience = new Experience();
    this.darkLayer = new DarkLayer();
    this.time = this.experience.time;
    this.camera = this.experience.camera.instance;
    this.itemShowcasing = false;
    this.itemRef = null;
    this.previousProperties = {
      item: null,
      position: null,
      rotation: null,
      scale: null,
    };
    window.addEventListener("click", () => {
      if (
        this.experience.raycaster &&
        this.experience.raycaster.currentIntersect
      ) {
        this.applyItem(this.experience.raycaster.currentIntersect);
      }
    });
  }

  removeItemShowcasing(item) {
    try {
      item.position.copy(this.previousProperties.position);
      item.scale.copy(this.previousProperties.scale);
      item.quaternion.copy(this.previousProperties.rotation);
      this.tweakProperties(null, null, null, null);
      this.darkLayer.destroy();
      this.itemRef = null;
      this.itemShowcasing = false;
    } catch (e) {
      console.error(e);
    }
  }

  addItemShowcasing(item) {
    this.tweakProperties(item, item.position, item.quaternion, item.scale);
    this.itemRef = item;
    this.darkLayer.apply();
  }

  tweakProperties(item, pos, rotation, scale) {
    this.previousProperties.item = item;
    this.previousProperties.position = pos;
    this.previousProperties.rotation = rotation;
    this.previousProperties.scale = scale;
  }

  applyItem(item) {
    if (item && item.object && item.object.parent.name == "BottleAll") {
      this.addItemShowcasing(item.object.parent.parent);
      this.startShowcase(
        item.object.parent.parent,
        -Math.PI / 4,
        Math.PI / 4,
        0,
        0.25,
        0.75
      );
    }
  }

  startShowcase(
    item,
    angleXStart,
    angleYStart,
    angleZStart,
    scaleStart,
    scaleFinish
  ) {
    item.position.copy(this.camera.position);
    item.position.z -= 4;
    item.rotation.set(angleXStart, angleYStart, angleZStart);
    item.scale.set(scaleStart, scaleStart, scaleStart);
    gsap.to(item.scale, {
      duration: 0.5,
      x: scaleFinish,
      y: scaleFinish,
      z: scaleFinish,
    });
  }

  update() {
    if (this.itemRef) {
      this.itemRef.rotation.z =
        -Math.PI / 2 + SHOWCASED_ROTATION_SPEED * this.time.clock.elapedTime;
    }
  }
}
