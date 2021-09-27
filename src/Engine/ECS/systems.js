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
            const animRoot = skin.animRoot;
            moveRoot.translateOnAxis(vectors.direction, vectors.speed * delta);
            skin.update(delta);

            const hitBox = entity.getComponent(HitBox);
            for (const obj of tiles) {
                // bottomleft corner
                let entityX = moveRoot.position.x - hitBox.size.x / 2;
                let entityY = moveRoot.position.y - hitBox.size.y / 2;
                const r1 = { pos: new Vector2(entityX, entityY), size: hitBox.size };

                const tile = obj.getComponent(Tile);
                let tileX = tile.position.x - tile.size.x / 2;
                let tileY = tile.position.y - tile.size.y / 2;
                const r2 = { pos: new Vector2(tileX, tileY), size: tile.size };
                if (RectToRect(r1, r2)) {
                    //console.log(r2, moveRoot.position);
                }

                const rayOrigin = new Vector2(moveRoot.position.x, moveRoot.position.y);
                const rayDir = rayOrigin.clone().negate();
                const contactInfo = {contactNormal: null, contactPoint: null, tHitNear: null};

                if (RayToRect(rayOrigin, rayDir, r2, contactInfo)) {
                    if (contactInfo.tHitNear >= 0 && contactInfo.tHitNear < 1)
                        console.log(contactInfo, r2, rayDir);
                }
            }

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
    entities: { components: [Object3D, Vectors, HitBox] },
    tiles: { components: [Tile] }
}

const PointToRect = (p, r) => {
    return (p.x >= r.pos.x && p.y >= r.pos.y && p.x < r.pos.x + r.size.x && p.y < r.pos.y + r.size.y);
}

const RectToRect = (r1, r2) => {
    return (r1.pos.x < r2.pos.x + r2.size.x && r1.pos.x +r1.size.x > r2.pos.x && r1.pos.y < r2.pos.y + r2.size.y && r1.pos.y + r1.size.y > r2.pos.y);
}

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