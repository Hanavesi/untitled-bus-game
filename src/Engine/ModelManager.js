import { LoadingManager } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";


export class ModelManager {
    constructor() {
        this.manager = new LoadingManager();
        this.models = {};
        this.loader = new GLTFLoader(this.manager);
    }

    /**
     * Set the models to be loaded with a list of asset names.
     * @param {string[]} models 
     */
    setModels(models) {
        for (const model of models) {
            const name = model.split('.')[0];
            const path = 'assets/' + model;
            this.models[name] = { url: path, gltf: undefined, animations: [] }
        }
    }

    /**
     * Load assets that are set with setModels. onLoad will be called when everything is loaded.
     * @param {function} onLoad
     */
    load(onLoad) {
        this.manager.onLoad = () => {
            prepModels(this.models);
            onLoad();
        }

        Object.keys(this.models).forEach(name => {
            const model = this.models[name];
            this.loader.load(model.url, (gltf) => {
                model.gltf = gltf;
            });
        })
    }

}

const prepModels = (models) => {
    Object.keys(models).forEach(name => {
        const model = models[name];
        const animsByName = {};
        model.gltf.animations.forEach(clip => {
            animsByName[clip.name] = clip;
        });
        model.animations = animsByName;
    });
}