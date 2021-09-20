import { System } from "ecsy";
import { Object3D, Playable, Vectors, Input } from "./components";
import { Vector3 } from "three";

/* export class RenderingSystem extends System {
    execute(delta) {
        const entities = this.queries.entities.results;
        for (const entity of entities) {

        }
    }
}

RenderingSystem.queries = {
    entities: { components: [Object3D] }
} */

export class MoveSystem extends System {
    execute() {
        const entities = this.queries.entities.results;
        const inputState = this.queries.inputState.results[0].getComponent(Input).state;
        for (const entity of entities) {
            const vectors = entity.getMutableComponent(Vectors);
            let newDir = new Vector3(0, 0, 0);
            if (inputState.left.down) newDir.x -= 1;
            if (inputState.right.down) newDir.x += 1;
            if (inputState.up.down) newDir.y += 1;
            if (inputState.down.down) newDir.y -= 1;
            vectors.direction = newDir.normalize();
        }
    }
}

MoveSystem.queries = {
    entities: { components: [Object3D, Vectors, Playable] },
    inputState: { components: [Input] }
}

export class UpdateVectorsSystem extends System {
    execute(delta) {
        const entities = this.queries.entities.results;
        for (const entity of entities) {
            const object = entity.getComponent(Object3D).object;
            const vectors = entity.getComponent(Vectors);
            object.translateOnAxis(vectors.direction, vectors.speed * delta);
        }
    }
}

UpdateVectorsSystem.queries = {
    entities: { components: [Object3D, Vectors] }
}
