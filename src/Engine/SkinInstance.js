import { clone } from "three/examples/jsm/utils/SkeletonUtils";
import { AnimationMixer, Group, Mesh, MeshBasicMaterial, PlaneGeometry } from "three";


export class SkinInstance {
    /**
     * Takes a model object from ModelManager
     * @param {*} model 
     */
    constructor(model, scene) {
        this.model = model;
        this.moveRoot = new Group();
        this.animRoot = clone(this.model.gltf.scene);
        this.mixer = new AnimationMixer(this.animRoot);
        this.moveRoot.add(this.animRoot);
        scene.add(this.moveRoot);
        this.actions = {};
        this.setHitBoxVisible();
    }

    setAnimation(animName) {
        const clip = this.model.animations[animName];
        
        // turn off all current actions
        for (const action of Object.values(this.actions)) {
            action.enabled = false;
        }
        // get or create existing action for clip
        const action = this.mixer.clipAction(clip);
        action.enabled = true;
        action.reset();
        action.play();
        this.actions[animName] = action;
    }

    update(deltaTime) {
        this.mixer.update(deltaTime);
    }

    setHitBoxVisible() {
        const material = new MeshBasicMaterial({ color: 0xff0000 });
        const geometry = new PlaneGeometry(1.5,1.5);
        const plane = new Mesh( geometry, material );
        this.moveRoot.add(plane);
    }
}