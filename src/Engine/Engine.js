import { World } from "ecsy";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Input, Object3D, Playable, Vectors } from "./ECS/components";
import { initWorld } from "./ECS/initializer";
import { InputManager } from "./InputManager";
import { ModelManager } from "./ModelManager";
import { SkinInstance } from "./SkinInstance";
import { mapToMeshes } from "./TileGen";
import { MAP_TEST } from "./TileMap";

export class Engine {

    constructor(canvas, width, height, onReady) {
        this.inputManager = new InputManager();
        this.lastFrame = 0;
        this.world = initWorld();
        //this.camera = new THREE.PerspectiveCamera(45, width / height, 0.005, 10000);
        this.camera = new THREE.OrthographicCamera(width / -30, width / 30, height / 30, height / -30, 1, 1000);
        this.camera.position.set(0, 0, 20);
        const controls = new OrbitControls(this.camera, canvas);
        controls.target.set(0, 0, 0);
        controls.update();
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('white');
        this.renderer = new THREE.WebGLRenderer({ canvas });
        this.renderer.render(this.scene, this.camera);

        this.modelManager = new ModelManager();
        this.modelManager.setModels(['knight.gltf', 'checkers.gltf']);
        this.modelManager.load(() => {
            this.init();
            onReady(true);
        });
    }

    init() {
        const knight = new SkinInstance(this.modelManager.models['knight'], this.scene);
        knight.setAnimation('Run');
        let entity = this.world.createEntity();
        entity
            .addComponent(Vectors, { direction: new THREE.Vector3(1, 0, 0), speed: 20 })
            .addComponent(Object3D, { skin: knight })
            .addComponent(Playable);

        const tilemap = mapToMeshes(MAP_TEST);
        for (const tile of tilemap) {
            this.scene.add(tile);
        }

        const inputEntity = this.world.createEntity()
        inputEntity
            .addComponent(Input, { state: this.inputManager.keys })

        this.addLight(5, 5, 2);
        this.addLight(-5, 5, 2);

        const light = new THREE.AmbientLight(0x404040); // soft white light
        this.scene.add(light);

        this.loop(0);
    }

    loop(now) {
        now *= 0.001;
        const deltaTime = now - this.lastFrame;
        this.lastFrame = now;

        if (this.inputManager.keys.left.justPressed) {
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
        };
      
        if (this.inputManager.keys.b.justPressed) {
            console.log("b")
        };

        this.world.execute(deltaTime, now);
        this.inputManager.update();

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.loop.bind(this));
    }

    addLight(...pos) {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(...pos);
        this.scene.add(light);
        this.scene.add(light.target);
    }
}