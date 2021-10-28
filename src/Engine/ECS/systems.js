import { System } from "ecsy";
import { Object3D, Playable, Vectors, Input, Tile, HitBox, StateMachine, CameraComponent } from "./components";
import { Vector3, Vector2 } from "three";
import { DynamicRectToRect, ResolveDynamicRectToRect } from "../util/collisions";

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
        const tiles = this.queries.tiles.results;
        const camera = this.queries.camera.results[0].getMutableComponent(CameraComponent).camera;
        for (const entity of entities) {
            const skin = entity.getComponent(Object3D).skin;
            const moveRoot = skin.moveRoot;
            const vectors = entity.getComponent(Vectors);
            skin.update(delta);

            // initializing some arrays that hold collision data
            const collisions = [];
            const tileBoxes = [];

            const hitBox = entity.getComponent(HitBox);
            const vel = new Vector2(vectors.direction.x, vectors.direction.y).multiplyScalar(vectors.speed);
            // gathering required data from moving entity for AABB collision calculations
            let entityX = moveRoot.position.x - hitBox.size.x / 2;
            let entityY = moveRoot.position.y - hitBox.size.y / 2;
            const r1 = { pos: new Vector2(entityX, entityY), size: hitBox.size };

            // First check for collision on the current frame
            for (let i = 0, obj; obj=tiles[i]; i++) {
                // gathering the same data for static collidable tiles
                // TODO: optimize this by only checking tiles close to the entity
                const tile = obj.getComponent(Tile);
                let tileX = tile.position.x - tile.size.x / 2;
                let tileY = tile.position.y - tile.size.y / 2;
                const r2 = { pos: new Vector2(tileX, tileY), size: tile.size };

                // saving the tile bounding box for possible collision resolution
                tileBoxes.push(r2);

                // initializing contactInfo object that holds the data through collision caltulations
                const contactInfo = {contactNormal: null, contactPoint: null, tHitNear: 0};

                // If collision is detected, get tile index and collision "time" for collision resolution.
                // The time is basically just a scalar value that tells when the first collision happens
                // on one of the axes
                if(DynamicRectToRect(r1, vel, delta, r2, contactInfo)) {
                    collisions.push({ index: i, time: contactInfo.tHitNear });
                }
            }

            // sort the collisions based on collision time
            collisions.sort((a, b) => a.time - b.time);
            
            // resolve the collisions in order
            for (const collision of collisions) {
                ResolveDynamicRectToRect(r1, vel, delta, tileBoxes[collision.index])
            }
            
            moveRoot.translateX(vel.x * delta);
            moveRoot.translateY(vel.y * delta);

            camera.position.set(moveRoot.position.x, moveRoot.position.y, 20);

            // wacky solution to rotate moving objects according to direction
            // while keeping them titled on the screen
            const x = vectors.direction.x;
            const y = vectors.direction.y;
            const animRoot = skin.animRoot;
            const fsm = entity.getComponent(StateMachine).fsm;
            if (x === 0 && y === 0) { // If standing still, look "down"
                if (fsm && fsm.state !== 'idle') {
                    fsm.transition('idle');
                }
                continue;
                animRoot.setRotationFromAxisAngle(new Vector3(0, 1, 0), Math.PI * 2);
                
            } else {
                const angle = Math.atan2(x, -y);
                animRoot.setRotationFromAxisAngle(new Vector3(0, 1, 0), angle);
                if (fsm && fsm.state !== 'run') {
                    fsm.transition('run');
                }
            }
            animRoot.rotateOnWorldAxis(new Vector3(1, 0, 0), 0.8);
        }
    }
}

UpdateVectorsSystem.queries = {
    entities: { components: [Object3D, Vectors, HitBox] },
    tiles: { components: [Tile] },
    camera: { components: [CameraComponent] }
}