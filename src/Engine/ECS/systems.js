import { System } from "ecsy";
import { Object3D, Playable, Vectors, Input, Tile, HitBox } from "./components";
import { Vector3, Vector2 } from "three";

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
        const tiles = this.queries.tiles.results;
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

            // wacky solution to rotate moving objects according to direction
            const x = vectors.direction.x;
            const y = vectors.direction.y;
            const animRoot = skin.animRoot;
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
    entities: { components: [Object3D, Vectors, HitBox] },
    tiles: { components: [Tile] }
}

/**
 * Returns whether point p is inside rect r.
 * @param {Vector2} p 
 * @param {{pos: Vector2, size: Vector2}} r 
 * @returns boolean
 */
const PointToRect = (p, r) => {
    return (p.x >= r.pos.x && p.y >= r.pos.y && p.x < r.pos.x + r.size.x && p.y < r.pos.y + r.size.y);
}

/**
 * 
 * @param {{pos: Vector2, size: Vector2}}} r1 
 * @param {{pos: Vector2, size: Vector2}}} r2 
 * @returns true if given rectangles overlap
 */
const RectToRect = (r1, r2) => {
    return (r1.pos.x < r2.pos.x + r2.size.x && r1.pos.x +r1.size.x > r2.pos.x && r1.pos.y < r2.pos.y + r2.size.y && r1.pos.y + r1.size.y > r2.pos.y);
}

/**
 * 
 * @param {Vector2} rayOrigin 
 * @param {Vector2} rayDir 
 * @param {{pos: Vector2, size: Vector2}} target 
 * @param {{contactNormal: Vector2, contactPoint: Vector2, tHitNear: number}} contactInfo 
 * @returns If the specified ray intersects the target rectangle and modifies the contactInfo object.
 */
const RayToRect = (rayOrigin, rayDir, target, contactInfo) => {
    const contactNormal = new Vector2();
    const contactPoint = new Vector2();
    let tHitNear;

    const invDir = new Vector2(1 / rayDir.x, 1 / rayDir.y);

    const tNear = new Vector2((target.pos.x - rayOrigin.x) * invDir.x, (target.pos.y - rayOrigin.y) * invDir.y);
    const tFar = new Vector2((target.pos.x + target.size.x - rayOrigin.x) * invDir.x, (target.pos.y + target.size.y - rayOrigin.y) * invDir.y);

    if (isNaN(tNear.x) || isNaN(tNear.y) || isNaN(tFar.x) || isNaN(tFar.y)) return false;

    if (tNear.x > tFar.x) [tNear.x, tFar.x] = [ tFar.x, tNear.x];
    if (tNear.y > tFar.y) [tNear.y, tFar.y] = [ tFar.y, tNear.y];

    if (tNear.x > tFar.y || tNear.y > tFar.x) return false;

    tHitNear = Math.max(tNear.x, tNear.y);

    const tHitFar = Math.min(tFar.x, tFar.y);

    if (tHitFar < 0) return false;

    contactPoint.add(rayOrigin).add(new Vector2().add(rayDir).multiplyScalar(tHitNear));

    if (tNear.x > tNear.y) {
        if (invDir.x < 0) {
            contactNormal.add(new Vector2(1, 0));
        } else {
            contactNormal.add(new Vector2(-1, 0));
        }
    } else if (tNear.x < tNear.y) {
        if (invDir.y < 0) {
            contactNormal.add(new Vector2(0, 1));
        } else {
            contactNormal.add(new Vector2(0, -1));
        }
    }

    contactInfo.contactNormal = contactNormal;
    contactInfo.contactPoint = contactPoint;
    contactInfo.tHitNear = tHitNear;
    return true;
}

/**
 * Checks whether a dynamic (moving) rectangle collides with a static rectangle and returns
 * collision data in contactInfo object. It contains the normal vector, the
 * contact point and the "time" of the collision.
 * @param {{pos: Vector2, size: Vector2}} dr dynamic rectangle that is moving
 * @param {Vector2} vel dynamic rectangle's velocity
 * @param {number} delta delta time
 * @param {{pos: Vector2, size: Vector2}} sr static rectangle
 * @param {{contactNormal: Vector2, contactPoint: Vector2, tHitNear: number}} contactInfo 
 * @returns true when colliding and modifies provided contactInfo object with collison data.
 */
const DynamicRectToRect = (dr, vel, delta, sr, contactInfo) => {
    if (vel.x === 0 && vel.y === 0) {
        return false;
    }
    const expandedTarget = {
        pos: new Vector2().addVectors(sr.pos.clone(), dr.size.clone().multiplyScalar(-0.5)),
        size: new Vector2().addVectors(sr.size, dr.size)
    };

    if (RayToRect(new Vector2().addVectors(dr.pos, dr.size.clone().multiplyScalar(0.5)), vel.clone().multiplyScalar(delta), expandedTarget, contactInfo))
        return (contactInfo.tHitNear >= 0 && contactInfo.tHitNear <= 1);
    else
        return false;
}

/**
 * Resolves collision of a dynamic rectangle on a static rectangle and modifies the velocity vector as nevessary.
 * @param {{pos: Vector2, size: Vector2}} dr dynamic rectangle that is moving
 * @param {Vector2} vel dynamic rectangle's velocity
 * @param {number} delta delta time
 * @param {{pos: Vector2, size: Vector2}} sr static rectangle
 * @returns boolean on whether collision happens or not
 */
const ResolveDynamicRectToRect = (dr, vel, delta, sr) => {
    const contactInfo = {contactNormal: null, contactPoint: null, tHitNear: null};
    if (DynamicRectToRect(dr, vel, delta, sr, contactInfo)) {
        vel.addVectors(vel, new Vector2(Math.abs(vel.x), Math.abs(vel.y)).multiply(contactInfo.contactNormal).multiplyScalar(1 - contactInfo.tHitNear));
        return true;
    }
    return false;
}