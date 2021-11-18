import { World } from "ecsy";
import * as THREE from "three";
import { Vector2 } from "three";
import { Input, CameraComponent, Mouse, Grid } from "./ECS/Components";
import { initWorld } from "./ECS/Initializer";
import { InputManager } from "./InputManager";
import { ModelManager } from "./ModelManager";
import { mapToMeshes } from "./TileGen";
import { MAP_TEST, SHOP_MAP } from "./TileMap";
import { EntityGenerator } from "./Util/EntityGenerator";

const CELLSIZE = 6;

export class Engine {

  constructor(canvas, width, height, onReady) {
    this.inputManager = new InputManager();
    this.lastFrame = undefined;

    this.stages = [];
    this.currentStage = 0;

    this.mousePos = new Vector2();
    const aspectratio = width / height;
    this.camera = new THREE.OrthographicCamera(-15 * aspectratio, 15 * aspectratio, 15, -15, 1, 1000);
    this.camera.position.set(0, 0, 20);
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setSize(width, height, false);
    this.level = 0;

    this.modelManager = new ModelManager();
    this.modelManager.setModels(['knight.gltf', 'soldier1.gltf', 'uzi.gltf', 'knight2.gltf']);
    this.modelManager.load(() => {
      this.init();
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
    let i, j;
    for (i = 0; (i - 1) * CELLSIZE < bounds.width; i++) {
      const column = {};
      for (j = 0; (j - 1) * CELLSIZE < bounds.height; j++) {
        column[j] = [];
      }
      grid[i] = column;
    }

    const entity = world.createEntity();
    entity.addComponent(Grid, { cells: grid, bounds: bounds });

    this.addLight([5, 5, 2], scene);
    this.addLight([-5, 5, 2], scene);

    this.stages.push({
      scene: scene,
      world: world
    });
  }

  createBus() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    const world = new World();
    initWorld(world);
    const entityGenerator = new EntityGenerator(this.modelManager, scene);
    world.generator = entityGenerator;

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
    let i, j;
    for (i = 0; (i - 1) * CELLSIZE < bounds.width; i++) {
      const column = {};
      for (j = 0; (j - 1) * CELLSIZE < bounds.height; j++) {
        column[j] = [];
      }
      grid[i] = column;
    }

    const entity = world.createEntity();
    entity.addComponent(Grid, { cells: grid, bounds: bounds });

    this.addLight([5, 5, 2], scene);
    this.addLight([-5, 5, 2], scene);

    this.stages.push({
      scene: scene,
      world: world
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
    this.camera.top = top;
    this.camera.bottom = bottom;
    this.camera.left = left;
    this.camera.right = right;

    this.camera.updateProjectionMatrix();
  }

  setMousePos(pos) {
    this.mousePos = this.mousePos.set(pos.x, pos.y).normalize();
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

      const light = new THREE.AmbientLight(0x404040); // soft white light
      stage.scene.add(light);
    }

    //this.loop(performance.now());
  }

  loop(now) {
    now *= 0.001;
    if (this.lastFrame === undefined) this.lastFrame = now;
    const deltaTime = now - this.lastFrame;
    this.lastFrame = now;

    /* if (this.inputManager.keys.left.justPressed) {
        console.log("left")
    };
    if (this.inputManager.keys.right.justPressed) {
        console.log("right")
    };
    if (this.inputManager.keys.up.justPressed) {
        console.log("up")
    };
    if (this.inputManager.keys.down.justPressed) {
        console.log("down")
    }; */

    if (this.inputManager.keys.b.justPressed) {
      this.currentStage = (this.currentStage + 1) % 2;
    }

    const stage = this.stages[this.currentStage];
    stage.world.execute(deltaTime, now);
    this.inputManager.update();

    this.renderer.render(stage.scene, this.camera);
    requestAnimationFrame(this.loop.bind(this));
  }

  enterShop() {
    this.currentStage = 1;
  }

  enterBus() {
    this.currentStage = 0;
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


