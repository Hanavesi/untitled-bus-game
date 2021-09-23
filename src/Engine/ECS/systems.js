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
// TODO: move animation handling to a different system and maybe component
export class UpdateVectorsSystem extends System {
    execute(delta) {
        const entities = this.queries.entities.results;
        for (const entity of entities) {
            const skin = entity.getComponent(Object3D).skin;
            const moveRoot = skin.moveRoot;
            const vectors = entity.getComponent(Vectors);
            const animRoot = skin.animRoot;
            moveRoot.translateOnAxis(vectors.direction, vectors.speed * delta);
            skin.update(delta);

            // wacky solution to rotate moving objects according to direction
            const x = vectors.direction.x;
            const y = vectors.direction.y;

            if (x === 0 && y === 0) { // If standing still, look "down"
                animRoot.setRotationFromAxisAngle(new Vector3(0, 1, 0), Math.PI*2);
            } else {
                const angle = Math.atan2(x,-y);
                animRoot.setRotationFromAxisAngle(new Vector3(0, 1, 0), angle);    
            }
            animRoot.rotateOnWorldAxis(new Vector3(1,0,0), 0.8);
        }
    }
}

UpdateVectorsSystem.queries = {
    entities: { components: [Object3D, Vectors] }
}
