import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import DitherVertexShader from "./shaders/dither/vertex.glsl";
import DitherFragmentShader from "./shaders/dither/fragment.glsl";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import GUI from "lil-gui";
import waterVertexShader from "./shaders/water/vertex.glsl";
import waterFragmentShader from "./shaders/water/fragment.glsl";
import bottleVertexShader from "./shaders/bottle/vertex.glsl";
import bottleFragmentShader from "./shaders/bottle/fragment.glsl";
// TODO: Code structure -> bottle hover -> bottle click ->
//        paper appear popup (sh1 pickup example) -> add more fog
//        -> add more islands (re-bake model) -> ??

// canvas
const canvas = document.querySelector("canvas.webgl");
// Scene
const scene = new THREE.Scene();

/**
 * Loaders
 */
// Texture Loader
const textureLoader = new THREE.TextureLoader();
// Draco Loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("draco/");
// GLTF Loader
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
// RGBE Loader
const rgbeLoader = new RGBELoader();

/**
 * Debug object
 */
const debugObject = {
  SEAGULL_SPEED: 5,
  SHOWCASED_ROTATION_SPEED: 0.25,
};

const worldObjects = {
  topLayer: null,
  showcasedItem: null,
};

/**
 * GUI ADD
 */
const addGui = () => {
  if (window && window.location.search == "?debug") {
    // Axes helpers
    const axes = new THREE.AxesHelper(100);
    scene.add(axes);

    const gui = new GUI({ width: 340 });
    const general = gui.addFolder("GENERAL");
    const water = gui.addFolder("WATER");
    const cameraFolder = gui.addFolder("CAMERA");

    general.add(debugObject, "SEAGULL_SPEED").step(0.1).min(-100).max(100);
    water
      .add(waterMaterial.uniforms.uBigWavesElevation, "value")
      .min(0)
      .max(1)
      .step(0.001)
      .name("uBigWavesElevation");
    water
      .add(waterMaterial.uniforms.uBigWavesFrequency.value, "x")
      .min(0)
      .max(10)
      .step(0.001)
      .name("uBigWavesFrequencyX");
    water
      .add(waterMaterial.uniforms.uBigWavesFrequency.value, "y")
      .min(0)
      .max(10)
      .step(0.001)
      .name("uBigWavesFrequencyY");
    water
      .add(waterMaterial.uniforms.uBigWavesSpeed, "value")
      .min(0)
      .max(4)
      .step(0.001)
      .name("uBigWavesSpeed");

    water
      .add(waterMaterial.uniforms.uSmallWavesElevation, "value")
      .min(0)
      .max(1)
      .step(0.001)
      .name("uSmallWavesElevation");
    water
      .add(waterMaterial.uniforms.uSmallWavesFrequency, "value")
      .min(0)
      .max(30)
      .step(0.001)
      .name("uSmallWavesFrequency");
    water
      .add(waterMaterial.uniforms.uSmallWavesSpeed, "value")
      .min(0)
      .max(4)
      .step(0.001)
      .name("uSmallWavesSpeed");
    water
      .add(waterMaterial.uniforms.uSmallIterations, "value")
      .min(0)
      .max(5)
      .step(1)
      .name("uSmallIterations");

    water
      .add(waterMaterial.uniforms.uColorOffset, "value")
      .min(0)
      .max(1)
      .step(0.001)
      .name("uColorOffset");
    water
      .add(waterMaterial.uniforms.uColorMultiplier, "value")
      .min(0)
      .max(10)
      .step(0.001)
      .name("uColorMultiplier");
    cameraFolder
      .add(camera.position, "x")
      .min(-40)
      .max(40)
      .step(0.1)
      .name("x camera");
    cameraFolder
      .add(camera.position, "y")
      .min(-40)
      .max(40)
      .step(0.1)
      .name("y camera");
    cameraFolder
      .add(camera.position, "z")
      .min(-40)
      .max(40)
      .step(0.1)
      .name("z camera");
    cameraFolder
      .add(camera.quaternion, "_x")
      .min(-Math.PI)
      .max(Math.PI)
      .step(0.01)
      .name("x camera - ROT");
    cameraFolder
      .add(camera.quaternion, "_y")
      .min(-Math.PI)
      .max(Math.PI)
      .step(0.01)
      .name("y camera - ROT");
    cameraFolder
      .add(camera.quaternion, "_z")
      .min(-Math.PI)
      .max(Math.PI)
      .step(0.01)
      .name("z camera - ROT");
  }
};
/**
 * Textures
 */
const bakedIslandTexture = textureLoader.load("baked.jpg");
bakedIslandTexture.flipY = false;
bakedIslandTexture.colorSpace = THREE.SRGBColorSpace;

const bakedBottleTexture = textureLoader.load("models/bottle/baked_bottle.jpg");
bakedBottleTexture.flipY = false;
bakedBottleTexture.colorSpace = THREE.SRGBColorSpace;

const bakedPaperTexture = textureLoader.load("models/bottle/baked_paper.jpg");
bakedPaperTexture.flipY = false;
bakedPaperTexture.colorSpace = THREE.SRGBColorSpace;
/**
 * Island
 */
// baked texture
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
// Materials
const bakedMaterial = new THREE.MeshBasicMaterial({
  map: bakedIslandTexture,
});
// geometries
gltfLoader.load("island.glb", (gltf) => {
  gltf.scene.traverse((child) => {
    child.material = bakedMaterial;
  });
  gltf.scene.position.y = -0.1;
  scene.add(gltf.scene);
});

/**
 * Seagull
 */

// Models
let mixers = [];
const SEAGULL_AMOUNT = 9;
const SEAGULL_REF = [];
for (let i = 0; i < SEAGULL_AMOUNT; i++) {
  gltfLoader.load("seagull.glb", (gltf) => {
    mixers.push(new THREE.AnimationMixer(gltf.scene));
    const action = mixers[i].clipAction(gltf.animations[0]);
    const action2 = mixers[i].clipAction(gltf.animations[1]);
    action.startAt(Math.abs(SEAGULL_AMOUNT / 2 - i) * 0.05);
    action2.startAt(Math.abs(SEAGULL_AMOUNT / 2 - i) * 0.05);
    action.play();
    action2.play();
    gltf.scene.position.y = 10 + -Math.abs(SEAGULL_AMOUNT / 2 - i) * 0.1;
    gltf.scene.position.z = i - 20;
    gltf.scene.position.x = -40 + -Math.abs(SEAGULL_AMOUNT / 2 - i);
    gltf.scene.rotation.y = Math.PI / 2;
    gltf.scene.INITIAL_X_POS = -40 + -Math.abs(SEAGULL_AMOUNT / 2 - i);
    gltf.scene.scale.set(
      0.2 + Math.random() / 100,
      0.2 + Math.random() / 100,
      0.2 + Math.random() / 100
    );
    scene.add(gltf.scene);
    SEAGULL_REF.push(gltf.scene);
  });
}

/**
 * Bottle
 *
 */
// Materials
const bakedBottleUniforms = {
  map: { value: bakedBottleTexture },
  uTime: { value: 0 },
  uShowcaseBrightness: {
    value: null,
  },
};
const bakedBottleMaterial = new THREE.ShaderMaterial({
  uniforms: bakedBottleUniforms,
  vertexShader: bottleVertexShader,
  fragmentShader: bottleFragmentShader,
});
const bakedPaperMaterial = new THREE.MeshBasicMaterial({
  map: bakedPaperTexture,
});

// Geometries
const paper_name = "Plane002";
const glass_name = "Plane002_1";
const cork_name = "Plane002_2";
let bottle_mesh = null;
gltfLoader.load("models/bottle/bottle.glb", (gltf) => {
  gltf.scene.traverse((child) => {
    if (child.name == paper_name) {
      child.material = bakedPaperMaterial;
    } else if (child.name == glass_name || child.name == cork_name) {
      child.material = bakedBottleMaterial;
    }
  });
  bottle_mesh = gltf.scene;
  bottle_mesh.position.x = 7;
  bottle_mesh.position.y = -0.1;

  bottle_mesh.rotation.y = -Math.PI / 4;
  bottle_mesh.rotation.x = -Math.PI / 8;
  bottle_mesh.scale.set(0.75, 0.75, 0.75);
  scene.add(bottle_mesh);
});
//
/**
 * Water Section
 */
// Material
const waterDepthColor = new THREE.Color(0x1578a1);
const waterMaterial = new THREE.ShaderMaterial({
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

    uDepthColor: { value: waterDepthColor },
    uSurfaceColor: { value: new THREE.Color(0x05587f) },
    uColorOffset: { value: 0.739 },
    uColorMultiplier: { value: 4.996 },
  },
});

const waterGeometry = new THREE.PlaneGeometry(200, 200, 1024, 1024);
waterGeometry.deleteAttribute("normal");
waterGeometry.deleteAttribute("uv");
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.set(-Math.PI * 0.5, 0, 0);
water.position.set(0, 0.16, 0);
scene.add(water);
/** After post Effects*/
/**
 * Fog Section
 */

// // Load Enviroment Equirectangular HDR
// rgbeLoader.load("kloppenheim_06_puresky_1k.hdr", (envMap) => {
//   envMap.mapping = THREE.EquirectangularReflectionMapping;
//   scene.background = envMap;
//   scene.environment = envMap;
// });
//sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
};
sizes.resolution = new THREE.Vector2(sizes.width, sizes.height);
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);
  sizes.resolution.set(sizes.width, sizes.height);
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(sizes.pixelRatio);

  // Camera update
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // update effect composer
  effectComposer.setSize(sizes.width, sizes.height);
  effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  // dither shader update
  if (ditherShader) {
    ditherPass.uniforms.uResolution.value = sizes.resolution;
  }
});
const mouse = new THREE.Vector2();
window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / sizes.width) * 2 - 1;
  mouse.y = -(e.clientY / sizes.height) * 2 + 1;
});

/*
 * Clickable Events
 */

const showcaseItemHolder = {
  item: null,
  pos: null,
  rotation: null,
  scale: null,
  action: "logTest",
};
window.addEventListener("click", () => {
  if (showcaseItemHolder.item) {
    if (showcaseItemHolder.action && showcaseItemHolder.action == "logTest") {
      console.log("test");
    }
    removeItemShowcasing();
  } else {
    // ugly code model should be renamed
    if (
      currentIntersect &&
      currentIntersect.object &&
      currentIntersect.object.parent.name == "BottleAll"
    ) {
      showcaseItem(
        currentIntersect.object.parent.parent,
        -Math.PI / 4,
        Math.PI / 4,
        0,
        0.25,
        0.75
      );
    }
  }
});

const showcaseItem = (
  item,
  angleXStart,
  angleYStart,
  angleZStart,
  scaleStart,
  scaleFinish
) => {
  const previousPosition = new THREE.Vector3(0, 0, 0).copy(item.position);
  const previousRotation = new THREE.Vector4(0, 0, 0).copy(item.quaternion);
  const previousScale = new THREE.Vector3(0, 0, 0).copy(item.scale);
  const cameraPosition = camera.position;
  item.position.copy(cameraPosition);
  item.position.z -= 4;
  item.rotation.z = angleZStart;
  item.rotation.x = angleXStart;
  item.rotation.y = angleYStart;
  item.scale.x = scaleStart;
  item.scale.y = scaleStart;
  item.scale.z = scaleStart;
  gsap.to(item.scale, {
    duration: 0.5,
    x: scaleFinish,
    y: scaleFinish,
    z: scaleFinish,
  });
  hideOutlineColor();
  setItemShowcasing(
    item,
    previousPosition,
    previousRotation,
    previousScale,
    "logTest"
  );
  //item.position.copy(cameraPosition);
};

const addDarkLayer = () => {
  const fakeBlack = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.ShaderMaterial({
      fragmentShader: `void main(){gl_FragColor = vec4(0.0, 0.0, 0.0, 0.4);}`,
      side: THREE.DoubleSide,
      transparent: true,
    })
  );

  fakeBlack.position.copy(camera.position);
  fakeBlack.position.z -= 1;
  scene.add(fakeBlack);
  worldObjects.topLayer = fakeBlack;
};
const removeTopLayer = () => {
  worldObjects.topLayer.geometry.dispose();
  worldObjects.topLayer.material.dispose();
  scene.remove(worldObjects.topLayer);
  worldObjects.topLayer = null;
};
const setItemShowcasing = (item, pos, rotation, scale, fn = null) => {
  if (item) {
    item.isShowcasing = true;
    addDarkLayer();
  }
  worldObjects.showcasedItem = item;
  showcaseItemHolder.item = item;
  showcaseItemHolder.pos = pos;
  showcaseItemHolder.rotation = rotation;
  showcaseItemHolder.scale = scale;
  showcaseItemHolder.action = fn;
};

const removeItemShowcasing = () => {
  showcaseItemHolder.item.position.copy(showcaseItemHolder.pos);
  showcaseItemHolder.item.scale.copy(showcaseItemHolder.scale);
  showcaseItemHolder.item.quaternion.copy(showcaseItemHolder.rotation);
  showcaseItemHolder.item.isShowcasing = false;
  setItemShowcasing(null, null, null, null, null);
  removeTopLayer();
  showOutlineColor();
};
/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
// BOTTLE DEBUG POSITIONS
// camera.position.x = 7.1;
// camera.position.y = 0.6;
// camera.position.z = 4.9;
// camera.quaternion.x = -0.01;
// camera.quaternion.y = 0.01;
// camera.quaternion.z = 0;

camera.position.x = 5.5;
camera.position.y = 3.3;
camera.position.z = 30.3;
camera.quaternion.x = 0.03;
camera.quaternion.y = 0.01;
camera.quaternion.z = 0;

scene.add(camera);

// // Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

/**
 * Renderer
 */
const rendererParameters = {};
rendererParameters.clearColor = "#2680ab";

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setClearColor(rendererParameters.clearColor);
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);

/**
 * Post Effects
 */
const renderTarget = new THREE.WebGLRenderTarget(480, 320, {
  samples: renderer.getPixelRatio() === 1 ? 2 : 0,
});
const effectComposer = new EffectComposer(renderer, renderTarget);
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
effectComposer.setSize(sizes.width, sizes.height);
const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);

const ditherShader = {
  uniforms: {
    uResolution: new THREE.Uniform(sizes.resolution),
    uColorNum: new THREE.Uniform(32.0),
    uPixelSize: new THREE.Uniform(2.0),
    tDiffuse: new THREE.Uniform(null),
  },
  vertexShader: `${DitherVertexShader}`,
  fragmentShader: `${DitherFragmentShader}`,
};
const ditherPass = new ShaderPass(ditherShader);
effectComposer.addPass(ditherPass);
const selectedObjects = [];
const outlinePass = new OutlinePass(
  renderPass.sizes,
  renderPass.scene,
  renderPass.camera,
  selectedObjects
);
outlinePass.edgeStrength = 1.425;
outlinePass.edgeStrength = 4.5;
outlinePass.edgeGlow = 0.2;
outlinePass.pulsePeriod = 4;
outlinePass.visibleEdgeColor.set("#ffffff");
outlinePass.hiddenEdgeColor.set("#000000");
const hideOutlineColor = () => {
  outlinePass.visibleEdgeColor.set("#000000");
};
const showOutlineColor = () => {
  outlinePass.visibleEdgeColor.set("#ffffff");
};
effectComposer.addPass(outlinePass);

//effectComposer.addPass(outlinePass);
/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster();
/**
 * Animate
 */

const clock = new THREE.Clock();
let previousTime = 0;
let currentIntersect = null;
let updated = false;
let firstItemsTick = {
  bottle: false,
};
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  raycaster.setFromCamera(mouse, camera);

  if (!firstItemsTick.bottle) {
    if (bottle_mesh) {
      bakedBottleUniforms.uShowcaseBrightness.value =
        worldObjects.showcasedItem == bottle_mesh ? 1.0 : 0.0;
    }
  }
  // Update animations
  if (mixers) {
    mixers.forEach((mixer) => {
      mixer.update(deltaTime);
    });
  }

  // updating materials
  waterMaterial.uniforms.uTime.value = elapsedTime;
  bakedBottleMaterial.uniforms.uTime.value = elapsedTime;
  // update seagulls
  if (SEAGULL_REF.length > 0) {
    SEAGULL_REF.forEach((seagull, i) => {
      seagull.rotation.z = Math.sin(deltaTime) * debugObject.SEAGULL_SPEED;
      seagull.position.x += deltaTime * debugObject.SEAGULL_SPEED;
      if (seagull.position.x > 100) {
        seagull.position.x = seagull.INITIAL_X_POS;
      }
    });
  }

  // Update current intersects
  if (bottle_mesh) {
    if (!updated) {
      selectedObjects.push(bottle_mesh);
      updated = true;
    }
    if (bottle_mesh.isShowcasing) {
      bottle_mesh.rotation.z =
        Math.PI / 2 + debugObject.SHOWCASED_ROTATION_SPEED * elapsedTime;
    } else {
      // no need to check for intersects if item is already being showcased
      const intersects = raycaster.intersectObject(bottle_mesh);
      if (intersects.length) {
        canvas.classList.add("pointer");
        currentIntersect = intersects[0];
      } else {
        canvas.classList.remove("pointer");
        currentIntersect = null;
      }
    }
  }
  // update controls
  //controls.update();
  //render
  //renderer.render(scene, camera);
  effectComposer.render();
  // call tick again
  window.requestAnimationFrame(tick);
};

tick();
addGui();
