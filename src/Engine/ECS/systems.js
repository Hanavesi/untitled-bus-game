import { System } from "ecsy";
import { Object3D, Playable, Vectors, Input, Position, Tile, HitBox } from "./components";
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
            for (const tile of tiles) {
                const obj = tile.getComponent(Tile);
                box2boxCollision(entity, obj);
            }
        }
    }
}

CollisionSystem.queries = {
    tiles: { components: [Tile] },
    entities: { components: [Object3D, Vectors, HitBox] },
}

const box2boxCollision = (collider, object) => {
    const colliderRoot = collider.getComponent(Object3D).skin.moveRoot;
    const colliderVectors = collider.getMutableComponent(Vectors);
    const colliderDir = colliderVectors.direction;
    const colliderHitBox = collider.getComponent(HitBox);

    const l1 = colliderRoot.position.x - colliderHitBox.size / 2;
    const t1 = colliderRoot.position.y + colliderHitBox.size / 2;
    const r1 = colliderRoot.position.x + colliderHitBox.size / 2;
    const b1 = colliderRoot.position.y - colliderHitBox.size / 2;

    const l2 = object.x - object.size / 2;
    const t2 = object.y + object.size / 2;
    const r2 = l2 + object.size;
    const b2 = t2 - object.size;

    if (b1 > t2 || t1 < b2 || r1 < l2 || l1 > r2) {
        return;
    }

    var pMidX = colliderRoot.position.x;
    var pMidY = colliderRoot.position.y;
    var aMidX = object.x;
    var aMidY = object.y;

    // To find the side of entry calculate based on
    // the normalized sides
    // collider on left: dx is positive
    // collider on top: dy is negative
    var dx = (aMidX - pMidX) / (colliderHitBox.size / 2);
    var dy = (aMidY - pMidY) / (colliderHitBox.size / 2);

    // Calculate the absolute change in x and y
    var absDX = Math.abs(dx);
    var absDY = Math.abs(dy);

    let newX = colliderRoot.position.x;
    let newY = colliderRoot.position.y;
    // Check if approaching from corner
    if (Math.abs(absDX- absDY) < 0.1) {
        // If approaching from left / negative X
        if (dx > 0) {
            // new X = l2 + hitbox
            newX = l2 + colliderHitBox.size;
        } else {
            // new X = r2
            newX = r2;
        }
        // If approaching from top / positive Y
        if (dy < 0) {
            // new Y = t2 - hitbox
            newY = t2 - colliderHitBox.size;
        } else {
            // new Y = b2
            newY = b2;
        }
        // Approaching more from sides
    } else if (absDX > absDY) {
        // If approaching from left / negative X
        if (dx > 0) {
            // new X = l2 + hitbox
            newX = l2 + colliderHitBox.size;
        } else {
            // new X = r2
            newX = r2;
        }
        //Approaching more from top/bottom
    } else {
        // If approaching from top / positive Y
        if (dy < 0) {
            // new Y = t2 - hitbox
            newY = t2 - colliderHitBox.size;
        } else {
            // new Y = b2
            newY = b2;
        }
    }

    //newX -= colliderHitBox.size/2;
    if (dy < 0) newY += 2.001;
    if (dy > 0) newY -= 2.001;
    if (dx < 0) newX += 2.001;
    if (dx > 0) newX -= 2.001;
    colliderRoot.position.x = newX;
    colliderRoot.position.y = newY;
    console.log(newX, newY);

}
