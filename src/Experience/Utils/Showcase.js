import { Vector3, Vector4 } from "three";
import Experience from "../Experience";
import DarkLayer from "../Layer/DarkLayer";
import gsap from "gsap";
import EventEmitter from "./EventEmitter";
const SHOWCASED_ROTATION_SPEED = 0.25;
export default class Showcase extends EventEmitter {
  constructor() {
    super();
    this.experience = new Experience();
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
      if (this.itemShowcasing) {
        this.removeItemShowcasing(this.itemRef);
      } else {
        if (
          this.experience.raycaster &&
          this.experience.raycaster.currentIntersect
        ) {
          this.applyItem(this.experience.raycaster.currentIntersect);
        }
      }
      this.trigger("showcase", [this.itemShowcasing]);
    });
  }

  removeItemShowcasing(item) {
    try {
      item.position.copy(this.previousProperties.position);
      item.scale.copy(this.previousProperties.scale);
      item.quaternion.copy(this.previousProperties.rotation);
      this.tweakProperties(null, null, null, null);
      this.itemRef = null;
      this.itemShowcasing = false;
    } catch (e) {
      console.error(e);
    }
  }

  addItemShowcasing(item) {
    this.tweakProperties(
      item,
      new Vector3(item.position.x, item.position.y, item.position.z),
      new Vector4(
        item.quaternion.x,
        item.quaternion.y,
        item.quaternion.z,
        item.quaternion.w
      ),
      new Vector3(item.scale.x, item.scale.y, item.scale.z)
    );
    this.itemRef = item;
  }

  tweakProperties(item, pos, rotation, scale) {
    this.previousProperties.item = item;
    this.previousProperties.position = pos;
    this.previousProperties.rotation = rotation;
    this.previousProperties.scale = scale;
  }

  applyItem(item) {
    try {
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
      this.itemShowcasing = true;
    } catch (e) {
      console.error(e);
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
