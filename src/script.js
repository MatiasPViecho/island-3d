import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RGBELoader } from "three/examples/jsm/Loaders/RGBELoader.js";
import DitherVertexShader from "./shaders/dither/vertex.glsl";
import DitherFragmentShader from "./shaders/dither/fragment.glsl";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import GUI from "lil-gui";
// canvas
const canvas = document.querySelector("canvas.webgl");
// Scene
const scene = new THREE.Scene();
const gui = new GUI({ width: 340 });
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
 * Textures
 */
// baked texture
const bakedTexture = textureLoader.load("baked.jpg");
bakedTexture.flipY = false;
bakedTexture.colorSpace = THREE.SRGBColorSpace;
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
// Materials
const bakedMaterial = new THREE.MeshBasicMaterial({
  map: bakedTexture,
});
// geometries
gltfLoader.load("island.glb", (gltf) => {
  gltf.scene.traverse((child) => {
    child.material = bakedMaterial;
  });
  scene.add(gltf.scene);
});

/**
 * Water Section
 */
const waterMaterial = new THREE.MeshBasicMaterial({ color: 0x1578a1 });
const waterGeometry = new THREE.PlaneGeometry(180, 180);
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.set(-Math.PI * 0.5, 0, 0);
water.position.set(0, 0.1, 0);
scene.add(water);

/** After post Effects*/
/**
 * Fog Section
 */

// Load Enviroment Equirectangular HDR
rgbeLoader.load("kloppenheim_06_puresky_1k.hdr", (envMap) => {
  envMap.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = envMap;
  scene.environment = envMap;
});
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
  sizes.resolution.set(window.innerWidth, window.innerHeight);
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(sizes.pixelRatio);

  effectComposer.setSize(sizes.width, sizes.height);
  effectComposer.setPixelRatio(sizes.pixelRatio);
});

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.y = 8;
camera.position.x = 40;
camera.position.z = 2;
camera.rotation.x = Math.PI * 4;
camera.rotation.y = 1.4;
camera.rotation.x = 2.4;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

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
const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);

const ditherShader = {
  uniforms: {
    uResolution: new THREE.Uniform(sizes.resolution),
    uColorNum: new THREE.Uniform(256.0),
    uPixelSize: new THREE.Uniform(4.0),
    tDiffuse: new THREE.Uniform(null),
  },
  vertexShader: `${DitherVertexShader}`,
  fragmentShader: `${DitherFragmentShader}`,
};
// gui
//   .add(ditherShader.uniforms.uColorNum, "value")
//   .min(2)
//   .max(16)
//   .step(2)
//   .name("Color num");
// gui
//   .add(ditherShader.uniforms.uPixelSize, "value")
//   .min(2)
//   .max(16)
//   .step(2)
//   .name("Pixel Size");
// gui
//   .add(ditherShader.uniforms.tDiffuse, "value")
//   .min(0)
//   .max(1)
//   .step(0.01)
//   .name("T diffuse");

const ditherPass = new ShaderPass(ditherShader);
effectComposer.addPass(ditherPass);

/**
 * Animate
 */

const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // update controls
  controls.update();
  //render
  //renderer.render(scene, camera);
  effectComposer.render();
  // call tick again
  window.requestAnimationFrame(tick);
};

tick();
