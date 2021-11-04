import * as CANNON from 'cannon';
import * as THREE from "three";
import { System } from "ecsy";
import { Object3D, Playable, Vectors, Input, Tile, HitBox, StateMachine, CameraComponent, Enemy, HealthBar, Bullet } from "./components";
import { Vector3, Vector2, Ray } from "three";
import { DynamicRectToRect, ResolveDynamicRectToRect } from "../util/collisions";
const bulletImg = require('../util/bullet.png')

export class ControlPlayerSystem extends System {
    execute() {
        const entities = this.queries.entities.results;
        const inputState = this.queries.inputState.results[0].getComponent(Input).state;
        for (const entity of entities) {
            const vectors = entity.getMutableComponent(Vectors);
            let newDir = new Vector2(0, 0);
            if (inputState.left.down) newDir.x -= 1;
            if (inputState.right.down) newDir.x += 1;
            if (inputState.up.down) newDir.y += 1;
            if (inputState.down.down) newDir.y -= 1;

            vectors.direction = newDir.normalize();
        }
    }
}

ControlPlayerSystem.queries = {
    entities: { components: [Object3D, Vectors, Playable] },
    inputState: { components: [Input] }
}

export class ControlBulletSystem extends System {
    execute() {
        const player = this.queries.player.results[0].getComponent(Object3D);
        const playerMoveRoot = player.skin.moveRoot;
        const entities = this.queries.entities.results;
        const bullets = this.queries.bullets.results;

        for (const entity of entities) {
            window.addEventListener("click", function (e) {
                entity.addComponent(Bullet, {
                    x: playerMoveRoot.position.x,
                    y: playerMoveRoot.position.y,
                    size: new THREE.Vector2(1.5, 1.5),
                    skin: bulletImg
                })
            });
        }

        for (const bullet of bullets) {
            const dir = new Ray(playerPos, { x: 30, y: 30 });
            const vectors = bullet.getMutableComponent(Vectors);
            vectors.speed = 5;
            vectors.direction = dir.normalize();
        }

    }
}

ControlBulletSystem.queries = {
    player: { components: [Playable] },
    entities: { components: [Object3D, Vectors, HitBox, Bullet] },
    bullets: { components: [Bullet] }
}


export class TempHealthSystem extends System {
    execute() {
        const healthBar = this.queries.entities.results[0].getMutableComponent(HealthBar);
        const current = healthBar.current;
        const max = healthBar.max;
        const scale = (current / max);
        healthBar.bar.scale.set(scale * 5, 0.2, 1);
        healthBar.bar.position.x = (scale * 5 - 5) / 2;
        healthBar.current -= 0.1;
        if (healthBar.current < 0) healthBar.current = 0;
    }
}

TempHealthSystem.queries = {
    entities: { components: [HealthBar] }
}

export class ControlEnemySystem extends System {
    execute() {
        const player = this.queries.player.results[0].getComponent(Object3D);
        const playerMoveRoot = player.skin.moveRoot;
        const playerPos = new Vector2(playerMoveRoot.position.x, playerMoveRoot.position.y);

        const enemies = this.queries.enemies.results;
        for (const enemy of enemies) {
            const enemyRoot = enemy.getComponent(Object3D).skin.moveRoot;
            const enemyPos = new Vector2(enemyRoot.position.x, enemyRoot.position.y);
            const dir = new Vector2().addVectors(enemyPos.negate(), playerPos);
            const dist = Math.sqrt(dir.x * dir.x + dir.y * dir.y);
            const vectors = enemy.getMutableComponent(Vectors);
            if (dist <= 10) {
                vectors.speed = 0;
            } else {
                vectors.speed = 3;
            }
            vectors.direction = dir.normalize();
        }
    }
}

ControlEnemySystem.queries = {
    player: { components: [Playable] },
    enemies: { components: [Enemy, Object3D, Vectors] }
}

export class CameraPositionSystem extends System {
    execute() {
        const player = this.queries.entities.results[0].getComponent(Object3D);
        const camera = this.queries.camera.results[0].getMutableComponent(CameraComponent).camera;
        const moveRoot = player.skin.moveRoot;
        camera.position.set(moveRoot.position.x, moveRoot.position.y, 20);
    }
}

CameraPositionSystem.queries = {
    entities: { components: [Playable] },
    camera: { components: [CameraComponent] }
}

// TODO: move animation handling to a different system and maybe component
export class UpdateVectorsSystem extends System {
    execute(delta) {
        const entities = this.queries.entities.results;
        const tiles = this.queries.tiles.results;
        const enemies = this.queries.enemies.results;

        for (const entity of entities) {
            const skin = entity.getComponent(Object3D).skin;
            const moveRoot = skin.moveRoot;
            const vectors = entity.getComponent(Vectors);
            skin.update(delta);

            // initializing some arrays that hold collision data
            const collisions = [];
            const tileBoxes = [];
            // ENEMIES
            const enemyCollisions = [];
            const enemyBoxes = [];

            // Player HITBOX
            const hitBox = entity.getComponent(HitBox);
            const vel = new Vector2(vectors.direction.x, vectors.direction.y).multiplyScalar(vectors.speed);
            // gathering required data from moving entity for AABB collision calculations
            let entityX = moveRoot.position.x - hitBox.size.x / 2;
            let entityY = moveRoot.position.y - hitBox.size.y / 2;
            const r1 = { pos: new Vector2(entityX, entityY), size: hitBox.size };

            // First check for collisions to ENEMIES on the current frame
            for (let i = 0, enemy; enemy = enemies[i]; i++) {
                // Enemy HITBOX
                const enemyHitBox = enemy.getComponent(HitBox);
                const enemySkin = enemy.getComponent(Object3D).skin;
                const enemyRoot = enemySkin.moveRoot;
                //console.log(enemyRoot.position);
                let enemyX = enemyRoot.position.x - enemyHitBox.size.x / 2;
                let enemyY = enemyRoot.position.y - enemyHitBox.size.y / 2;
                //console.log(enemyX, enemyY);
                const r2 = { pos: new Vector2(enemyX, enemyY), size: enemyHitBox.size };
                //console.log(r2);

                // saving the enemy bounding box for possible collision resolution
                enemyBoxes.push(r2);

                // initializing contactInfo object that holds the data through collision caltulations
                const contactInfo = { contactNormal: null, contactPoint: null, tHitNear: 0 };

                if (DynamicRectToRect(r1, vel, delta, r2, contactInfo)) {
                    enemyCollisions.push({ index: i, time: contactInfo.tHitNear });
                }
            }

            // First check for collisions to TILES on the current frame
            for (let i = 0, obj; obj = tiles[i]; i++) {
                // gathering the same data for static collidable tiles
                // TODO: optimize this by only checking tiles close to the entity
                const tile = obj.getComponent(Tile);
                let tileX = tile.position.x - tile.size.x / 2;
                let tileY = tile.position.y - tile.size.y / 2;
                const r2 = { pos: new Vector2(tileX, tileY), size: tile.size };

                // saving the tile bounding box for possible collision resolution
                tileBoxes.push(r2);

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
            enemyCollisions.sort((a, b) => a.time - b.time)

            // resolve the collisions in order
            for (const collision of collisions) {
                ResolveDynamicRectToRect(r1, vel, delta, tileBoxes[collision.index]);
            }
            // resolve the collisions in order
            for (const enemyCollision of enemyCollisions) {
                ResolveDynamicRectToRect(r1, vel, delta, enemyBoxes[enemyCollision.index])
            }

            moveRoot.translateX(vel.x * delta);
            moveRoot.translateY(vel.y * delta);

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
                //animRoot.setRotationFromAxisAngle(new Vector3(0, 1, 0), Math.PI * 2);
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
    entities: { components: [Object3D, Vectors, HitBox, Bullet] },
    tiles: { components: [Tile] },
    enemies: { components: [Enemy, Object3D, Vectors, HitBox] },
    bullets: { components: [Object3D, Bullet] }
}