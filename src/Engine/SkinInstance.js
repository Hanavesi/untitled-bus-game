import { clone } from "three/examples/jsm/utils/SkeletonUtils";
import { AnimationMixer } from "three";


export class SkinInstance {
    /**
     * Takes a model object from ModelManager
     * @param {*} model 
     */
    constructor(model, scene) {
        this.model = model;
        this.animRoot = clone(this.model.gltf.scene);
        this.mixer = new AnimationMixer(this.animRoot);
        scene.add(this.animRoot);
        this.actions = {};
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
}