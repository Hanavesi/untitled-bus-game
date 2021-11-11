import { System } from "ecsy";
import { Object3D, Playable, Vectors, Input, Tile, HitBox, StateMachine, CameraComponent, Enemy, HealthBar, Mouse, Bullet, EntityGeneratorComp, Gun, TimeToLive } from "./components";
import { Vector3, Vector2 } from "three";
import { DynamicRectToRect, RayToRect, ResolveDynamicRectToRect } from "../util/collisions";

export class ControlPlayerSystem extends System {
    execute() {
        const entities = this.queries.entities.results;
        const inputState = this.queries.inputState.results[0].getComponent(Input).state;
        const generator = this.queries.generator.results[0].getComponent(EntityGeneratorComp).generator;
        const mousePos = this.queries.mouse.results[0].getComponent(Mouse).pos;
        for (const entity of entities) {
            const vectors = entity.getMutableComponent(Vectors);
            let newDir = new Vector2(0, 0);
            if (inputState.left.down) newDir.x -= 1;
            if (inputState.right.down) newDir.x += 1;
            if (inputState.up.down) newDir.y += 1;
            if (inputState.down.down) newDir.y -= 1;
            vectors.direction = newDir.normalize();

            const object = entity.getComponent(Object3D).object;

            const { x, y } = vectors.direction;
            const animRoot = object.animRoot;
            const fsm = entity.getComponent(StateMachine).fsm;
            if (x === 0 && y === 0) { // If standing still, look "down"
                if (fsm && fsm.state !== 'idle') {
                    fsm.transition('idle');
                }
            } else {
                if (fsm && fsm.state !== 'run') {
                    fsm.transition('run');
                }
            }

            const angle = Math.atan2(mousePos.y, mousePos.x);
            const newAngle = angle + Math.PI / 2;
            animRoot.setRotationFromAxisAngle(new Vector3(0, 1, 0), newAngle);
            animRoot.rotateOnWorldAxis(new Vector3(1, 0, 0), 0.8);

            if (inputState.leftMouse.down) {
                const barrel = entity.getComponent(Gun).barrel;
                const pos = new Vector3();
                const speed = 30;
                barrel.getWorldPosition(pos);
                const dir = new Vector2(mousePos.x, mousePos.y);
                generator.createBullet(pos, dir, speed);
            }
        }
    }
}

ControlPlayerSystem.queries = {
    entities: { components: [Object3D, Vectors, Playable] },
    inputState: { components: [Input] },
    generator: { components: [EntityGeneratorComp] },
    mouse: { components: [Mouse] }
}

export class TempHealthSystem extends System {
    execute() {
        const entities = this.queries.entities.results;
        for (const entity of entities) {
            const healthBar = entity.getMutableComponent(HealthBar);
            const current = healthBar.current;
            const max = healthBar.max;
            const scale = (current / max);
            healthBar.bar.scale.set(scale * 5, 0.2, 1);
            healthBar.bar.position.x = (scale * 5 - 5) / 2;
            //healthBar.current -= 0.05;
            if (healthBar.current < 0) healthBar.current = 0;
        }
    }
}

TempHealthSystem.queries = {
    entities: { components: [HealthBar] }
}

export class ControlEnemySystem extends System {
    execute(delta) {
        const player = this.queries.player.results[0];
        const playerMoveRoot = player.getComponent(Object3D).object.moveRoot;
        const playerPos = new Vector2(playerMoveRoot.position.x, playerMoveRoot.position.y);
        const playerVectors = player.getComponent(Vectors);
        const generator = this.queries.generator.results[0].getComponent(EntityGeneratorComp).generator;

        const enemies = this.queries.enemies.results;

        for (const enemy of enemies) {
            const enemyObject = enemy.getComponent(Object3D).object;
            const enemyMoveRoot = enemyObject.moveRoot;
            const enemyPos = new Vector2(enemyMoveRoot.position.x, enemyMoveRoot.position.y);
            const enemyToPlayer = new Vector2().addVectors(enemyPos.negate(), playerPos);
            const dist = Math.sqrt(enemyToPlayer.x * enemyToPlayer.x + enemyToPlayer.y * enemyToPlayer.y);
            const dir = enemyToPlayer.clone().normalize();
            const vectors = enemy.getMutableComponent(Vectors);
            if (dist <= 2) {
                playerVectors.velocity.add(dir.multiplyScalar(20));
            }
            vectors.direction = dir.normalize();

            const { x, y } = vectors.direction;
            const animRoot = enemyObject.animRoot;
            const fsm = enemy.getComponent(StateMachine).fsm;
            if (x === 0 && y === 0) { // If standing still, look "down"
                if (fsm && fsm.state !== 'idle') {
                    fsm.transition('idle');
                }
                continue;
                //animRoot.setRotationFromAxisAngle(new Vector3(0, 1, 0), Math.PI * 2);
            } else {
                const angle = Math.atan2(x, -y);
                animRoot.setRotationFromAxisAngle(new Vector3(0, 1, 0), angle);
                if (fsm && fsm.state !== 'run') {
                    fsm.transition('run');
                }
            }
            //console.log(timeToShoot);
            let waitTime;
            if (enemy.timeToShoot === undefined) {
                enemy.timeToShoot = 0;
            } else {
                enemy.timeToShoot += delta;
            }
            waitTime = Math.random() * 2 + 5;
            //console.log(enemy.timeToShoot);
            if (enemy.timeToShoot > waitTime) {
                const barrel = enemy.getComponent(Gun).barrel;
                const pos = new Vector3();
                barrel.getWorldPosition(pos);
                //console.log('2s menny');
                enemy.timeToShoot = 0;
                const speed = 15;
                //const pos = new Vector2(enemyMoveRoot.position.x, enemyMoveRoot.position.y);
                //barrel.getWorldPosition(pos);
                /* const dir = new Vector2(playerMoveRoot.position.x, playerMoveRoot.position.y);
                dir.normalize() */
                generator.createBullet(pos.add(new Vector3(0, -0.5, 0)), dir, speed);
            }

            animRoot.rotateOnWorldAxis(new Vector3(1, 0, 0), 0.8);
        }
    }
}

ControlEnemySystem.queries = {
    player: { components: [Playable] },
    enemies: { components: [Enemy, Object3D, Vectors] },
    generator: { components: [EntityGeneratorComp] },
}

export class CameraPositionSystem extends System {
    execute() {
        const player = this.queries.entities.results[0].getComponent(Object3D);
        const camera = this.queries.camera.results[0].getMutableComponent(CameraComponent).camera;
        const moveRoot = player.object.moveRoot;
        camera.position.set(moveRoot.position.x, moveRoot.position.y, 20);
    }
}

CameraPositionSystem.queries = {
    entities: { components: [Playable] },
    camera: { components: [CameraComponent] }
}

export class UpdateBulletsSystem extends System {
    execute(delta) {
        const bullets = this.queries.bullets.results;
        const entities = this.queries.entities.results;
        bullets: for (const bullet of bullets) {
            const object = bullet.getMutableComponent(Object3D).object;
            /* const ttl = bullet.getMutableComponent(TimeToLive);
            ttl.age += delta;
            if (ttl.age >= ttl.max) {
                object.geometry.dispose();
                object.material.dispose();
                object.removeFromParent();
                bullet.remove();
                continue bullets;
            } */
            const vectors = bullet.getMutableComponent(Vectors);
            const pos = new Vector2(object.position.x, object.position.y);
            const ray = vectors.direction.clone().multiplyScalar(vectors.speed * delta);
            entities: for (const entity of entities) {
                const enemy = entity.getMutableComponent(Object3D).object
                const entityPos = entity.getComponent(Object3D).object.moveRoot.position;
                const hitbox = entity.getComponent(HitBox);
                const healthBar = entity.getMutableComponent(HealthBar);
                const entityX = (entityPos.x - hitbox.size.x / 2) + hitbox.offset.x;
                const entityY = (entityPos.y - hitbox.size.y / 2) + hitbox.offset.y;
                const rect = { pos: new Vector2(entityX, entityY), size: hitbox.size };
                const contactInfo = { contactNormal: null, contactPoint: null, tHitNear: 0 };
                if (RayToRect(pos, ray, rect, contactInfo)) {
                    if (contactInfo.tHitNear >= 0 && contactInfo.tHitNear <= 1) {
                        object.geometry.dispose();
                        object.material.dispose();
                        object.removeFromParent();
                        bullet.remove();
                        healthBar.current -= 10
                        continue bullets;
                    }
                }
                if (healthBar.current < 0) {
                    entity.remove()
                }
            }
            object.translateOnAxis(new Vector3(vectors.direction.x, vectors.direction.y, 0), vectors.speed * delta);
        }
    }
}

UpdateBulletsSystem.queries = {
    bullets: { components: [Bullet] },
    entities: { components: [Object3D, Vectors, HitBox, HealthBar] },
}

// TODO: move animation handling to a different system and maybe component
export class UpdateVectorsSystem extends System {
    execute(delta) {
        const entities = this.queries.entities.results;
        const tiles = this.queries.tiles.results;
        for (const entity of entities) {
            const object = entity.getComponent(Object3D).object;
            const moveRoot = object.moveRoot;
            const vectors = entity.getMutableComponent(Vectors);
            object.update(delta);

            // initializing some arrays that hold collision data
            const collisions = [];
            const tileBoxes = [];

            // Entity HITBOX
            const hitbox = entity.getComponent(HitBox);
            const vel = new Vector2().add(vectors.direction).multiplyScalar(vectors.speed).add(vectors.velocity);
            //if (entity.hasComponent(Enemy)) console.log(vectors)
            // gathering required data from moving entity for AABB collision calculations
            const entityX = moveRoot.position.x - hitbox.size.x / 2;
            const entityY = moveRoot.position.y - hitbox.size.y / 2;
            const r1 = { pos: new Vector2(entityX, entityY), size: hitbox.size };

            // check for collisions to TILES on the current frame
            for (let i = 0, obj; obj = tiles[i]; i++) {
                // gathering the same data for static collidable tiles
                // TODO: optimize this by only checking tiles close to the entity
                const tile = obj.getComponent(Tile);
                let tileX = tile.position.x - tile.size.x / 2;
                let tileY = tile.position.y - tile.size.y / 2;
                const r2 = { pos: new Vector2(tileX, tileY), size: tile.size };

                const entityToTile = r1.pos.clone().negate().add(r2.pos);
                const dist = entityToTile.length();
                // saving the tile bounding box for possible collision resolution
                tileBoxes.push(r2);
                if (dist > 5) continue;
                // initializing contactInfo object that holds the data through collision caltulations
                const contactInfo = { contactNormal: null, contactPoint: null, tHitNear: 0 };

                // If collision is detected, get tile index and collision "time" for collision resolution.
                // The time is basically just a scalar value that tells when the first collision happens
                // on one of the axes
                if (DynamicRectToRect(r1, vel, delta, r2, contactInfo)) {
                    collisions.push({ index: i, time: contactInfo.tHitNear });
                }
            }

            // sort the collisions based on collision time
            collisions.sort((a, b) => a.time - b.time);
            // resolve the collisions in order
            for (const collision of collisions) {
                ResolveDynamicRectToRect(r1, vel, delta, tileBoxes[collision.index]);
            }
            vectors.velocity = vel.clone().multiplyScalar(0.8);

            moveRoot.translateX(delta * vel.x);
            moveRoot.translateY(delta * vel.y);
        }
    }
}

UpdateVectorsSystem.queries = {
    entities: { components: [Object3D, Vectors, HitBox] },
    tiles: { components: [Tile] }
}