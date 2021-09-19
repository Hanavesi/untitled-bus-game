import { World } from "ecsy";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { InputManager } from "./InputManager";
import { ModelManager } from "./ModelManager";
import { SkinInstance } from "./SkinInstance";

export class Engine {

    constructor(canvas, width, height, onReady) {
        this.inputManager = new InputManager();
        this.lastFrame = 0;
        this.world = new World(); // ecsy world object
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.005, 10000);
        this.camera.position.set(0, 20, 40);
        const controls = new OrbitControls(this.camera, canvas);
        controls.target.set(0, 0, 0);
        controls.update();
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('white');
        this.renderer = new THREE.WebGLRenderer({ canvas });
        this.renderer.render(this.scene, this.camera);

        this.modelManager = new ModelManager();
        this.modelManager.setModels(['knight.gltf']);
        this.modelManager.load(() => {
            this.init();
            onReady(true);
        });
    }

    init() {
        this.knight = new SkinInstance(this.modelManager.models['knight'], this.scene);
        this.test = new SkinInstance(this.modelManager.models['knight'], this.scene);
        this.knight.setAnimation('Run');
        this.test.setAnimation('Idle');

        this.addLight(5, 5, 2);
        this.addLight(-5, 5, 2);

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
        if (this.inputManager.keys.a.justPressed) {
            console.log("a")
        };
        if (this.inputManager.keys.b.justPressed) {
            console.log("b")
        };

        this.inputManager.update();
        this.knight.update(deltaTime);
        this.test.update(deltaTime);

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