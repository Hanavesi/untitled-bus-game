import { World } from "ecsy";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { clone } from "three/examples/jsm/utils/SkeletonUtils";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { InputManager } from "./InputManager";

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
        this.animationMixers = [];
        this.assetLoader(onReady);
    }

    assetLoader(onReady) {
        const manager = new THREE.LoadingManager();
        const models = [];
        models.push({ url: 'assets/knight.gltf', gltf: undefined, animations: [] });

        manager.onLoad = () => {
            this.init(models);
            onReady(true);
        };
        const loader = new GLTFLoader(manager);

        for (const model of models) {
            loader.load(model.url, (gltf) => {
                model.gltf = gltf;
            });
        }
        console.log(models);
    }

    prepModelsAndAnimations(models) {
        models.forEach(model => {
            const animsByName = {};
            console.log(model);
            model.gltf.animations.forEach(clip => {
                animsByName[clip.name] = clip;
            });
            model.animations = animsByName;
        });
    }

    init(models) {
        console.log('done');
        this.prepModelsAndAnimations(models);

        models.forEach((model, index) => {
            console.log(index);
            const clonedScene = clone(model.gltf.scene);
            const root = new THREE.Object3D();
            root.add(clonedScene);
            this.scene.add(root);
            root.position.x = 0;

            const mixer = new THREE.AnimationMixer(clonedScene);
            const firstClip = Object.values(model.animations)[3];
            const action = mixer.clipAction(firstClip);
            action.play();
            this.animationMixers.push(mixer);
        });

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

        this.inputManager.update();

        for (const mixer of this.animationMixers) {
            mixer.update(deltaTime);
        }

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