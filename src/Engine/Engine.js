import { World } from "ecsy";
import * as THREE from "three";
import { Vector2, Vector4 } from "three";
import { Input, CameraComponent, Mouse, Grid, Level, Shop, Bus } from "./ECS/Components";
import { initWorld } from "./ECS/Initializer";
import { InputManager } from "./InputManager";
import { ModelManager } from "./ModelManager";
import { mapToMeshes } from "./TileGen";
import { MAP_TEST, SHOP_MAP } from "./TileMap";
import { EntityGenerator } from "./Util/EntityGenerator";
import { SoundController } from "./Util/SoundController";
import { HalftonePass } from "three/examples/jsm/postprocessing/HalftonePass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";

import run from '../Assets/sounds/run.mp3';
import piu from '../Assets/sounds/piu.mp3';
import busMusic from '../Assets/sounds/busMusic.mp3';


const CELLSIZE = 12.1;

export class Engine {

  constructor(canvas, width, height, onReady) {
    this.sounds = new SoundController();
    this.sounds.registerSound(run, true, 0.05);
    this.sounds.registerSound(busMusic, true);
    this.sounds.registerSound(piu, false, 0.05);
    this.sounds.setVolume(0.5);

    this.inputManager = new InputManager();
    this.lastFrame = undefined;

    this.stages = [];
    this.currentStage = 0;
    this.running = true;

    this.mousePos = new Vector2();
    const aspectratio = width / height;
    this.camera = new THREE.OrthographicCamera(-15 * aspectratio, 15 * aspectratio, 15, -15, 1, 1000);
    this.camera.position.set(0, 0, 20);
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setSize(width, height, false);
    this.composer = new EffectComposer(this.renderer);
    this.renderPass = new RenderPass(new THREE.Scene(), this.camera);
    this.composer.addPass(this.renderPass);
    this.composer.addPass(new HalftonePass(width, height, {
      radius: 2,
      shape: 1,
    }));
    this.level = 1;

    this.modelManager = new ModelManager();
    this.modelManager.setModels(['knight.gltf', 'soldier1.gltf', 'uzi.gltf', 'knight2.gltf']);
    this.modelManager.load(() => {
      this.init(1);
      onReady(true);
    });
    this.onWindowResize(width, height);
  }

  createShop() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    const world = new World();

    initWorld(world);
    const entityGenerator = new EntityGenerator(this.modelManager, scene);
    world.generator = entityGenerator;
    world.sounds = this.sounds;

    entityGenerator.createPlayer(world.createEntity(), { x: 0, y: 0 });

    const { meshes, bounds } = mapToMeshes(SHOP_MAP);
    for (const tile of meshes) {
      scene.add(tile);
      if (tile.name === 'floor') continue;
      entityGenerator.createTile(world.createEntity(), tile, 3.5);
      // debug collision tiles
      /* const material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); 
      const geometry = new THREE.PlaneGeometry(3.5, 3.5);
      const plane = new THREE.Mesh(geometry, material);
      plane.position.x = tile.position.x;
      plane.position.y = tile.position.y;
      this.scene.add(plane); */
    }
    const grid = {};
    let iMax = Math.floor(bounds.width / CELLSIZE) + 1;
    let jMax = Math.floor(bounds.height / CELLSIZE) + 1;
    for (let i = 0; i < iMax; i++) {
      const column = {};
      for (let j = 0; j < jMax; j++) {
        column[j] = [];
      }
      grid[i] = column;
    }

    const entity = world.createEntity();
    entity
      .addComponent(Grid, { cells: grid, bounds: bounds })
      .addComponent(Shop);

    this.addLight([5, 5, 2], scene);
    this.addLight([-5, 5, 2], scene);
    const name = 'shop';

    this.stages.push({
      scene: scene,
      world: world,
      name: name
    });
  }

  createBus() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    const world = new World();
    initWorld(world);
    const entityGenerator = new EntityGenerator(this.modelManager, scene);
    world.generator = entityGenerator;
    world.sounds = this.sounds;

    entityGenerator.createPlayer(world.createEntity(), { x: 0, y: 0 });
    entityGenerator.createSoldier(world.createEntity(), { x: 0, y: 10 });

    const { meshes, bounds } = mapToMeshes(MAP_TEST);
    for (const tile of meshes) {
      scene.add(tile);
      if (tile.name === 'floor') continue;
      entityGenerator.createTile(world.createEntity(), tile, 3.5);
      // debug collision tiles
      /* const material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); 
      const geometry = new THREE.PlaneGeometry(3.5, 3.5);
      const plane = new THREE.Mesh(geometry, material);
      plane.position.x = tile.position.x;
      plane.position.y = tile.position.y;
      this.scene.add(plane); */
    }
    const grid = {};
    let iMax = Math.floor(bounds.width / CELLSIZE) + 1;
    let jMax = Math.floor(bounds.height / CELLSIZE) + 1;
    for (let i = 0; i < iMax; i++) {
      const column = {};
      for (let j = 0; j < jMax; j++) {
        column[j] = [];
      }
      grid[i] = column;
    }

    const entity = world.createEntity();
    entity
      .addComponent(Grid, { cells: grid, bounds: bounds })
      .addComponent(Level, { stageNumber: this.level })
      .addComponent(Bus);

    this.addLight([5, 5, 2], scene);
    this.addLight([-5, 5, 2], scene);
    const name = 'bus';
    this.stages.push({
      scene: scene,
      world: world,
      name: name
    });
  }

  onWindowResize(width, height) {
    let bottom, top, left, right;
    const ratio = width / height;
    if (ratio > 1) {
      top = 30 / ratio;
      bottom = -30 / ratio;
      left = -30;
      right = 30;
    } else {
      top = 30;
      bottom = -30;
      left = -30 * ratio;
      right = 30 * ratio;
    }
    this.renderer.setSize(width, height, false);
    this.composer.setSize(width, height);
    this.camera.top = top;
    this.camera.bottom = bottom;
    this.camera.left = left;
    this.camera.right = right;

    this.camera.updateProjectionMatrix();
  }

  setMousePos(pos) {
    const { top, right } = this.camera;
    this.mousePos.set(pos.x * right, pos.y * top);
  }

  prepareNextStage() {
    this.stages = [];
    this.level += 1;
    this.init()
  }

  init() {
    this.createBus();
    this.createShop();
    for (const stage of this.stages) {
      const mouseEntity = stage.world.createEntity();
      mouseEntity.addComponent(Mouse, { pos: this.mousePos });

      const cameraEntity = stage.world.createEntity();
      cameraEntity.addComponent(CameraComponent, { camera: this.camera });

      const inputEntity = stage.world.createEntity();
      inputEntity
        .addComponent(Input, { state: this.inputManager.keys })

      this.addLight([5, 5, 2], stage.scene);
      this.addLight([-5, 5, 2], stage.scene);

      const light = new THREE.AmbientLight(0x808080); // soft white light
      stage.scene.add(light);

      if (stage.name === 'bus') {
        console.log('level', this.level);
        for (let i = 0; i < (this.level * 5); i++) {
          const x = Math.ceil(Math.random() * 30) * (Math.round(Math.random()) ? 1 : -1);
          const y = Math.ceil(Math.random() * 18) * (Math.round(Math.random()) ? 1 : -1);
          let entity = stage.world.createEntity();
          stage.world.generator.createSoldier(entity, new Vector2(x, y));
        }
      }
    }
    //this.loop(performance.now());
  }


  loop(now) {
    now *= 0.001;
    const deltaTime = now - (this.lastFrame || 0);
    this.lastFrame = now;

    const stage = this.stages[this.currentStage];
    stage.world.execute(deltaTime);

    this.inputManager.update();

    //this.renderer.render(stage.scene, this.camera);
    this.composer.render();

    if (!stage.world.enabled) {
      this.renderer.setAnimationLoop(null)
      return (
        window.location = 'http://localhost:3000/GameOver'
      )
    }
    if (this.running)
      requestAnimationFrame(this.loop.bind(this));
  }

  enterShop() {
    this.currentStage = 1;
    this.renderPass.scene = this.stages[1].scene;
    this.sounds.stopSound('run');
    if (!this.sounds.isPlaying('busMusic'))
      this.sounds.playSound('busMusic');
  }

  enterBus() {
    this.currentStage = 0;
    this.renderPass.scene = this.stages[0].scene;
    this.sounds.stopSound('busMusic');
    if (!this.sounds.isPlaying('run'))
      this.sounds.playSound('run');
  }

  addLight(pos, scene) {
    const color = 0xFFFFFF;
    const intensity = 0.5;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(...pos);
    scene.add(light);
    scene.add(light.target);
  }
}


