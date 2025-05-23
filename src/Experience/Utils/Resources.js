import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import EventEmitter from "./EventEmitter";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
export default class Resources extends EventEmitter {
  constructor(sources, loadingManager) {
    super();
    // options
    this.sources = sources;
    // setup
    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;
    this.dracoEnabled = true;
    this.setLoaders(loadingManager);
    this.startLoading();
  }

  setLoaders(loadingManager) {
    this.loaders = {};
    this.loaders.gltfLoader = new GLTFLoader(loadingManager);
    if (this.dracoEnabled) {
      this.dracoLoader = new DRACOLoader();
      this.dracoLoader.setDecoderPath("draco/");
    }
    this.loaders.gltfLoader.setDRACOLoader(this.dracoLoader);
    this.loaders.textureLoader = new THREE.TextureLoader(loadingManager);
    this.loaders.rgbeLoader = new RGBELoader(loadingManager);
  }

  startLoading() {
    for (const source of this.sources) {
      if (source.type === "gltfModel") {
        this.loaders.gltfLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "texture") {
        this.loaders.textureLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "rgbeTexture") {
        this.loaders.rgbeLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "audio") {
        this.sourceLoaded(source, new Audio(source.path), true);
      }
    }
  }
  sourceLoaded(source, file, isAudio = false) {
    this.items[isAudio ? source.name + "Audio" : source.name] = file;
    this.loaded++;
    if (this.loaded == this.toLoad) {
      this.trigger("ready");
    }
  }
}
