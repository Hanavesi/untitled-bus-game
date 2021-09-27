import { System } from "ecsy";
import { Object3D, Playable, Vectors, Input, Position, Tile } from "./components";
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
            const position = entity.getMutableComponent(Position);
            let newDir = new Vector3(0, 0, 0);
            if (inputState.left.down) newDir.x -= 1;
            if (inputState.right.down) newDir.x += 1;
            if (inputState.up.down) newDir.y += 1;
            if (inputState.down.down) newDir.y -= 1;
            vectors.direction = newDir.normalize();
            //console.log(position);
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
                animRoot.setRotationFromAxisAngle(new Vector3(0, 1, 0), Math.PI * 2);
            } else {
                const angle = Math.atan2(x, -y);
                animRoot.setRotationFromAxisAngle(new Vector3(0, 1, 0), angle);
            }
            animRoot.rotateOnWorldAxis(new Vector3(1, 0, 0), 0.8);
        }
    }
}

UpdateVectorsSystem.queries = {
    entities: { components: [Object3D, Vectors] },

}

export class CollisionSystem extends System {
    execute() {
        const entities = this.queries.entities.results;
        const tiles = this.queries.tiles.results;
        for (const entity of entities) {
            const skin = entity.getComponent(Object3D).skin;
            const moveRoot = skin.moveRoot;
            const position = { x: moveRoot.position.x, y: moveRoot.position.y }
            for (const tile of tiles) {
                const obj = tile.getComponent(Tile)
                const left = obj.x - obj.size / 2
                const right = obj.x + obj.size / 2
                const up = obj.y + obj.size / 2
                const down = obj.y - obj.size / 2
                if (position.x > left && position.x < right && position.y > down && position.y < up) {
                    console.log(obj.x, obj.y);
                }
            }




        }
    }
}

CollisionSystem.queries = {
    tiles: { components: [Tile] },
    entities: { components: [Object3D, Vectors] },
}
