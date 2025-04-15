import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import DitherVertexShader from "./shaders/dither/vertex.glsl";
import DitherFragmentShader from "./shaders/dither/fragment.glsl";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import GUI from "lil-gui";
import waterVertexShader from "./shaders/water/vertex.glsl";
import waterFragmentShader from "./shaders/water/fragment.glsl";
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
const bakedTexture = textureLoader.load("baked.jpg");
bakedTexture.flipY = false;
bakedTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Island
 */
// baked texture
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
 * Seagull
 */
let mixers = [];
const SEAGULL_AMOUNT = 3;
const SEAGULL_REF = [];
for (let i = 0; i < SEAGULL_AMOUNT; i++) {
  gltfLoader.load("seagull.glb", (gltf) => {
    mixers.push(new THREE.AnimationMixer(gltf.scene));
    const action = mixers[i].clipAction(gltf.animations[0]);
    const action2 = mixers[i].clipAction(gltf.animations[1]);
    action.play();
    action2.play();
    gltf.scene.position.y = 10 + (i + 1) / 10;
    gltf.scene.position.z = 4 * (i + 1);
    gltf.scene.position.x = 8 / (i + 1);
    gltf.scene.scale.set(0.3, 0.3, 0.3);
    scene.add(gltf.scene);
    SEAGULL_REF.push(gltf.scene);
  });
}
//
/**
 * Water Section
 */
// Material
const waterMaterial = new THREE.ShaderMaterial({
  vertexShader: waterVertexShader,
  fragmentShader: waterFragmentShader,
  uniforms: {
    uTime: { value: 0 },

    uTime: { value: 0 },

    uBigWavesElevation: { value: 0.554 },
    uBigWavesFrequency: { value: new THREE.Vector2(0.51, 0.278) },
    uBigWavesSpeed: { value: 0.575 },

    uSmallWavesElevation: { value: 0.36 },
    uSmallWavesFrequency: { value: 5.94 },
    uSmallWavesSpeed: { value: 3.267 },
    uSmallIterations: { value: 1 },

    uDepthColor: { value: new THREE.Color(0x1578a1) },
    uSurfaceColor: { value: new THREE.Color(0x05587f) },
    uColorOffset: { value: 0.786 },
    uColorMultiplier: { value: 7.703 },
  },
});

const waterGeometry = new THREE.PlaneGeometry(200, 200, 1024, 1024);
waterGeometry.deleteAttribute("normal");
waterGeometry.deleteAttribute("uv");
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.set(-Math.PI * 0.5, 0, 0);
water.position.set(0, 0.12, 0);
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
  sizes.resolution.set(800, 600);
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(sizes.pixelRatio);

  // Camera update
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // update effect composer
  effectComposer.setSize(sizes.width, sizes.height);
  effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
// camera.position.y = 3;
// camera.position.x = 0.0;
// camera.position.z = 28;
camera.position.x = 10;
camera.position.y = 20;
camera.position.z = 25;
camera.rotation.set(Math.PI * 0.05, -Math.PI * 0.05, Math.PI * 0.0085);
scene.add(camera);

// // Controls
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
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
effectComposer.setSize(sizes.width, sizes.height);
const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);

const ditherShader = {
  uniforms: {
    uResolution: new THREE.Uniform(sizes.resolution),
    uColorNum: new THREE.Uniform(8.0),
    uPixelSize: new THREE.Uniform(4.0),
    tDiffuse: new THREE.Uniform(null),
  },
  vertexShader: `${DitherVertexShader}`,
  fragmentShader: `${DitherFragmentShader}`,
};
const ditherPass = new ShaderPass(ditherShader);
effectComposer.addPass(ditherPass);

/**
 * Animate
 */

const clock = new THREE.Clock();
let previousTime = 0;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;
  // Update animations
  if (mixers) {
    mixers.forEach((mixer) => {
      mixer.update(deltaTime);
    });
  }

  // updating materials
  waterMaterial.uniforms.uTime.value = elapsedTime;

  // update seagulls
  if (SEAGULL_REF.length > 0) {
    SEAGULL_REF.forEach((seagull, i) => {
      seagull.position.y = 10 + (0.5 + i / 5) * Math.cos(elapsedTime);
      seagull.rotation.z = Math.sin(elapsedTime * 0.4 * (i / 10 + 1)) * 0.5;
      seagull.rotation.y =
        90 + -(2 * (i / 10 + 1)) - elapsedTime * (0.15 + i / 100);
      seagull.position.x = Math.sin(elapsedTime * 0.2) * 20 * (i + 1 / 10 + 1);
      seagull.position.z = -Math.cos(elapsedTime * 0.2) * 15 * (i + 1 / 10 + 1);
    });
  }

  // update controls
  controls.update();
  //render
  //renderer.render(scene, camera);
  effectComposer.render();
  // call tick again
  window.requestAnimationFrame(tick);
};

tick();
