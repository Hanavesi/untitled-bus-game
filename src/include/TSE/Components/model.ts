import { Asset } from "../../Scene/Asset";
import { GLTFImporter } from "../../Scene/GLTFImporter";
import { IComponent } from "../../util/ecs/component.h";
import { Entity } from "../../util/ecs/entity";

export class ModelComponent implements IComponent {
    public Entity: Entity;
    private URI: string;
    private asset: Asset;
    public loaded = false;

    constructor(URI: string) {
        this.URI = URI;
    }

    Awake(): void {
        if (!this.loaded) {
            const importer = new GLTFImporter();
            importer.importModel(this.asset, this.URI).then(result => this.loaded = result );
        }
    }

    Update(deltaTime: number): void {
        // Do stuff with animations
    }


}